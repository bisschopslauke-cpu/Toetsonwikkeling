import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, FileText, Presentation, FileSpreadsheet, Layers, Table, Download, Calculator, UserCheck, AlertCircle } from 'lucide-react';
import { Button } from '../Button';
import { QuestionCard } from '../QuestionCard';
import { ExamMatrix } from '../ExamMatrix';
import { GeneratedExam, GeneratorConfig, Question, RegenerationMode } from '../../types';
import { downloadCSV, downloadPPT, downloadWord, downloadBrightspaceGrades, downloadAnsExport } from '../../utils/exportUtils';
import { useLanguage } from '../../contexts/LanguageContext';

interface GeneratorResultsProps {
  result: GeneratedExam | null;
  config: GeneratorConfig;
  isLoading: boolean;
  isReviewMode: boolean;
  setIsReviewMode: (mode: boolean) => void;
  regeneratingId: number | null;
  onRegenerate: (index: number, mode: RegenerationMode) => void;
  onUpdate: (index: number, q: Question) => void;
}

export const GeneratorResults: React.FC<GeneratorResultsProps> = ({
  result,
  config,
  isLoading,
  isReviewMode,
  setIsReviewMode,
  regeneratingId,
  onRegenerate,
  onUpdate
}) => {
  const [resultTab, setResultTab] = useState<'questions' | 'matrix' | 'integration'>('questions');
  const [isStudentVersion, setIsStudentVersion] = useState(false);
  const { t } = useLanguage();

  // Handle Review Mode Toggle logic (switching tabs)
  const handleReviewToggle = () => {
    setIsReviewMode(!isReviewMode);
    setResultTab('questions'); // Always jump to questions when reviewing
  };

  const calculateCesuur = (questions: Question[]) => {
    let totalPoints = 0;
    let guessingPoints = 0;

    questions.forEach(q => {
      const points = q.score || 3;
      totalPoints += points;
      
      if (q.type === 'single_choice' && q.options) {
        guessingPoints += (points / q.options.length);
      } else if (q.type === 'multiple_response' && q.options) {
        guessingPoints += (points / q.options.length); 
      }
    });

    const cesuurScore = guessingPoints + 0.55 * (totalPoints - guessingPoints);
    const percentage = totalPoints > 0 ? (cesuurScore / totalPoints) * 100 : 0;

    return { totalPoints, guessingPoints, cesuurScore, percentage };
  };

  if (!result && !isLoading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded bg-white">
        <BookOpen size={48} className="mb-4 opacity-20" />
        <p className="text-base text-center font-medium">{t.generator.emptyState}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-6 bg-white rounded border border-gray-200">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{t.generator.generating}</h3>
          <p className="text-sm text-gray-500">{t.generator.checkAlignment}</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-6"> 
      
      {/* Header Card */}
      <div className="ru-card p-6">
        <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{result.metadata.title}</h2>
              <div className="flex gap-4 text-sm text-gray-600 mt-2">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">{result.metadata.courseCode || 'CODE'}</span>
                <span>{result.questions.length} {t.common.questions}</span>
                <span>{config.difficulty}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 items-end">
              {/* Review Mode Toggle */}
              <button
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${isReviewMode ? 'bg-primary text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={handleReviewToggle}
              >
                  {isReviewMode ? <EyeOff size={14}/> : <Eye size={14}/>}
                  {isReviewMode ? t.generator.stopReview : t.generator.startReview}
              </button>

              {/* Export Student View Toggle */}
              {!isReviewMode && (
                <div 
                    className="flex items-center gap-2 cursor-pointer border border-gray-200 px-3 py-1.5 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsStudentVersion(!isStudentVersion)}
                  >
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${isStudentVersion ? 'bg-primary' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isStudentVersion ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{t.generator.exportStudent}</span>
                </div>
              )}
            </div>
        </div>

        {!isReviewMode && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => downloadWord(result, config, isStudentVersion)} className="!px-3 flex-1 text-xs py-2">
              <FileText size={16} /> Word
            </Button>
            <Button variant="outline" onClick={() => downloadPPT(result, config, isStudentVersion)} className="!px-3 flex-1 text-xs py-2">
              <Presentation size={16} /> PowerPoint
            </Button>
            <Button variant="ghost" onClick={() => downloadCSV(result)} className="!px-3 flex-1 text-xs py-2 border border-gray-200">
              <FileSpreadsheet size={16} /> CSV
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t px-2">
        <button 
          onClick={() => setResultTab('questions')}
          className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${resultTab === 'questions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <Layers size={16} /> {t.generator.tabQuestions}
        </button>
        <button 
          onClick={() => setResultTab('matrix')}
          className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${resultTab === 'matrix' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <Table size={16} /> {t.generator.tabMatrix}
        </button>
        <button 
          onClick={() => setResultTab('integration')}
          className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${resultTab === 'integration' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <BookOpen size={16} /> {t.generator.tabDossier}
        </button>
      </div>

      {/* Tab Content */}
      {resultTab === 'questions' && (
        <div className="space-y-4">
          {result.questions.map((q, idx) => (
            <QuestionCard 
              key={idx} 
              question={q} 
              index={idx} 
              onRegenerate={onRegenerate}
              onUpdate={onUpdate}
              isRegenerating={regeneratingId === idx}
              isReviewMode={isReviewMode}
            />
          ))}
        </div>
      )}

      {resultTab === 'matrix' && (
        <ExamMatrix questions={result.questions} metadata={result.metadata} />
      )}

      {resultTab === 'integration' && (
        <div className="space-y-6">
          
          {/* Export Actions for Platforms */}
          <div className="ru-card p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
              <Download size={20} className="text-primary"/> {t.generator.platformExport}
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => downloadBrightspaceGrades(result)} className="text-sm bg-orange-700 hover:bg-orange-800 border-orange-700 justify-start">
                  Brightspace Import (Grades)
                </Button>
                <Button onClick={() => downloadAnsExport(result)} className="text-sm bg-black hover:bg-gray-800 border-black justify-start">
                  Ans Import (Questions)
                </Button>
            </div>
          </div>

          {/* Cesuur Calculator */}
          <div className="ru-card p-6 border-l-4 border-blue-600">
            <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
              <Calculator size={20} className="text-blue-600"/> {t.generator.cesuurTitle}
            </h3>
            
            {(() => {
              const stats = calculateCesuur(result.questions);
              return (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-blue-50/50 rounded border border-blue-100">
                        <span className="block text-xs font-bold text-blue-800 uppercase">{t.generator.totalPoints}</span>
                        <span className="font-mono font-bold text-lg">{stats.totalPoints}</span>
                      </div>
                      <div className="p-3 bg-red-50/50 rounded border border-red-100">
                        <span className="block text-xs font-bold text-red-800 uppercase">{t.generator.guessingChance}</span>
                        <span className="font-mono font-bold text-lg">{stats.guessingPoints.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-sm text-gray-600 mb-2">
                        {t.generator.cesuurAdvice}<br/>
                        <code className="text-xs bg-gray-200 px-1 rounded">Gokkans + 0.55 * (Totaal - Gokkans)</code>
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">{stats.cesuurScore.toFixed(1)}</span>
                        <span className="text-sm text-gray-500"> / {stats.totalPoints} {t.common.points} ({stats.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                </div>
              );
            })()}
          </div>

          {/* Four Eyes Principle Checklist */}
          <div className="ru-card p-6 border-l-4 border-green-600">
            <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
              <UserCheck size={20} className="text-green-600"/> {t.generator.fourEyesTitle}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t.generator.fourEyesDesc}
            </p>
            <div className="space-y-2">
              {[
                t.generator.check1,
                t.generator.check2,
                t.generator.check3,
                t.generator.check4
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="h-5 w-5 rounded border border-gray-300 bg-white"></div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-xs border border-yellow-200 rounded flex gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              {t.generator.tipWord}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};