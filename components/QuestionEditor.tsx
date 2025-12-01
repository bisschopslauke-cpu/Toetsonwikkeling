import React, { useState } from 'react';
import { Save, X as XIcon } from 'lucide-react';
import { Question } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { refineText } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface QuestionEditorProps {
  question: Question;
  index: number;
  onSave: (q: Question) => void;
  onCancel: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, index, onSave, onCancel }) => {
  const [editForm, setEditForm] = useState<Question>(question);
  const { t } = useLanguage();

  const handleAiRefine = async (text: string, action: string) => {
    return await refineText(text, action);
  };

  const handleOptionChange = (optIndex: number, val: string) => {
    if (!editForm.options) return;
    const newOpts = [...editForm.options];
    newOpts[optIndex] = val;
    setEditForm({ ...editForm, options: newOpts });
  };

  return (
    <div className="ru-card p-6 border-l-4 border-primary relative">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-primary">{t.common.edit} {t.common.question} {index + 1}</span>
        <div className="flex gap-2">
          <button 
            onClick={() => onSave(editForm)} 
            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded hover:bg-primary-hover text-xs font-bold transition-colors"
          >
            <Save size={14}/> {t.common.save}
          </button>
          <button 
            onClick={onCancel} 
            className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
          >
            <XIcon size={16}/>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Context / Stem</label>
          <RichTextEditor 
            value={editForm.stem}
            onChange={(val) => setEditForm({...editForm, stem: val})}
            onAiAssist={handleAiRefine}
            placeholder="Context..."
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t.common.question}</label>
          <RichTextEditor 
            value={editForm.question}
            onChange={(val) => setEditForm({...editForm, question: val})}
            onAiAssist={handleAiRefine}
            placeholder="Question?"
            className="font-bold"
            minHeight="60px"
          />
        </div>
        
        {editForm.options && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase block">Options</label>
            {editForm.options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-xs w-6 font-bold pt-3 text-center">{String.fromCharCode(65 + i)}</span>
                <div className="flex-1">
                  <RichTextEditor
                    value={opt}
                    onChange={(val) => handleOptionChange(i, val)}
                    onAiAssist={handleAiRefine}
                    minHeight="40px"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t.common.correctAnswer}</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded text-sm"
            value={Array.isArray(editForm.correctAnswer) ? editForm.correctAnswer.join(', ') : editForm.correctAnswer}
            onChange={(e) => setEditForm({...editForm, correctAnswer: e.target.value})}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t.common.explanation}</label>
          <RichTextEditor
            value={editForm.explanation}
            onChange={(val) => setEditForm({...editForm, explanation: val})}
            onAiAssist={handleAiRefine}
            minHeight="80px"
          />
        </div>
      </div>
    </div>
  );
};