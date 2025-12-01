import React, { useRef } from 'react';
import { Upload, FileText, Settings, AlertCircle, FileIcon, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '../Button';
import { GeneratorConfig, Difficulty, UploadedFile } from '../../types';
import { MOCK_EXAMPLES } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';

interface GeneratorInputProps {
  config: GeneratorConfig;
  setConfig: React.Dispatch<React.SetStateAction<GeneratorConfig>>;
  activeTab: 'text' | 'file';
  setActiveTab: (tab: 'text' | 'file') => void;
  isLoading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  onGenerate: () => void;
  onReset: () => void;
  onLoadExample: (id: string) => void;
  onAddFiles: (files: UploadedFile[]) => void;
  onRemoveFile: (index: number) => void;
}

export const GeneratorInput: React.FC<GeneratorInputProps> = ({
  config,
  setConfig,
  activeTab,
  setActiveTab,
  isLoading,
  error,
  setError,
  onGenerate,
  onReset,
  onLoadExample,
  onAddFiles,
  onRemoveFile
}) => {
  const { language, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const newFiles: UploadedFile[] = [];
    let currentError = null;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > 4 * 1024 * 1024) { 
        currentError = `File "${file.name}" is too large (max 4MB).`;
        continue;
      }
      try {
        const base64Content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        newFiles.push({
          name: file.name,
          mimeType: file.type,
          base64: base64Content,
          size: file.size
        });
      } catch (err) {
        console.error("Error reading file", err);
        currentError = `Error reading "${file.name}".`;
      }
    }
    if (currentError) setError(currentError);
    else setError(null);
    
    onAddFiles(newFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetClick = () => {
    onReset();
    if(selectRef.current) selectRef.current.value = "";
    setActiveTab('text');
  };

  const inputClass = "w-full rounded border border-gray-300 bg-white p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm transition-colors placeholder:text-gray-400";
  const labelClass = "block text-xs font-bold uppercase text-gray-500 mb-1.5";

  return (
    <div className="space-y-6">
      <div className="ru-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
            <FileText size={18} />
            {t.generator.inputTitle}
          </h2>
          <button 
            onClick={handleResetClick} 
            className="text-xs flex items-center gap-1 text-gray-400 hover:text-primary transition-colors font-medium"
          >
            <RotateCcw size={12} /> {t.generator.reset}
          </button>
        </div>
        
        <div className="flex bg-gray-100 rounded p-1 mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded transition-all ${activeTab === 'text' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('text')}
          >
            {t.generator.tabText}
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded transition-all ${activeTab === 'file' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('file')}
          >
            {t.generator.tabDocs}
          </button>
        </div>

        {activeTab === 'text' ? (
          <div className="space-y-3">
            <textarea
              className="w-full h-48 p-3 rounded border border-gray-300 bg-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none text-sm shadow-inner"
              placeholder={t.generator.placeholderText}
              value={config.sourceText}
              onChange={(e) => setConfig({...config, sourceText: e.target.value})}
            ></textarea>
            
            <div className="pt-2 border-t border-gray-100">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{t.generator.orSelectExample}</label>
              <div className="relative">
                <select 
                  ref={selectRef}
                  onChange={(e) => onLoadExample(e.target.value)}
                  className="w-full text-xs p-2 pr-8 rounded border border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 focus:border-primary focus:outline-none cursor-pointer appearance-none"
                  defaultValue=""
                >
                  <option value="" disabled>{t.generator.selectExamplePlaceholder}</option>
                  {MOCK_EXAMPLES.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.label[language]}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.txt,.md,.pptx,.docx" 
                multiple
                onChange={handleFileChange}
              />
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-700 font-medium">{t.generator.dragDrop}</p>
              <p className="text-xs text-gray-400 mt-1">{t.generator.fileTypes}</p>
            </div>
            {config.files.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {config.files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileIcon size={14} className="text-primary" />
                      <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                    </div>
                    <button onClick={() => onRemoveFile(idx)} className="text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className={labelClass}>
            {t.generator.sourceScope}
          </label>
          <input 
            type="text" 
            className={inputClass}
            placeholder={t.generator.sourceScopePlaceholder}
            value={config.sourceScope || ''}
            onChange={(e) => setConfig({...config, sourceScope: e.target.value})}
          />
          <p className="text-xs text-gray-400 mt-1">{t.generator.sourceScopeHelp}</p>
        </div>
      </div>

      {/* Config Section */}
      <div className="ru-card p-6 space-y-5">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
          <Settings size={18} />
          {t.generator.settingsTitle}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t.generator.courseCode}</label>
            <input 
              type="text" 
              value={config.courseCode || ''}
              onChange={(e) => setConfig({...config, courseCode: e.target.value})}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t.generator.targetGroup}</label>
            <input 
              type="text" 
              value={config.targetGroup || ''}
              onChange={(e) => setConfig({...config, targetGroup: e.target.value})}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t.generator.learningObjectives}</label>
          <textarea
            className="w-full h-24 p-2.5 rounded border border-gray-300 bg-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none text-sm shadow-sm"
            placeholder={t.generator.learningObjectivesPlaceholder}
            value={config.learningObjectives || ''}
            onChange={(e) => setConfig({...config, learningObjectives: e.target.value})}
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t.generator.numQuestions}</label>
            <input 
              type="number" 
              min="1" 
              max="20"
              value={config.numQuestions}
              onChange={(e) => setConfig({...config, numQuestions: parseInt(e.target.value)})}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>{t.generator.difficulty}</label>
            <select 
              className={inputClass}
              value={config.difficulty}
              onChange={(e) => setConfig({...config, difficulty: e.target.value as Difficulty})}
            >
              {Object.values(Difficulty).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <Button onClick={onGenerate} className="w-full font-bold" isLoading={isLoading}>
            {t.generator.generateBtn}
          </Button>
          {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};