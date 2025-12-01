import React, { useState, useEffect, useRef } from 'react';
import { Edit2, CheckCircle, Target, Wand2, TrendingUp, TrendingDown, Shuffle, Scissors, AlertCircle } from 'lucide-react';
import { Question, RegenerationMode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { QuestionEditor } from './QuestionEditor';

interface QuestionCardProps {
  question: Question;
  index: number;
  onRegenerate: (index: number, mode: RegenerationMode) => void;
  onUpdate: (index: number, q: Question) => void;
  isRegenerating: boolean;
  isReviewMode?: boolean; 
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  index, 
  onRegenerate, 
  onUpdate, 
  isRegenerating,
  isReviewMode = false
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { t } = useLanguage();
  
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOptions([]);
    setAnswerStatus(null);
    setShowFeedback(false);
    setIsEditing(false); // Reset editing state on question change
  }, [question]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRegenerateClick = (mode: RegenerationMode) => {
    setShowMenu(false);
    onRegenerate(index, mode);
  };

  const toggleOptionSelection = (optIndex: number) => {
    if (!isReviewMode) return; 
    
    if (question.type === 'multiple_response') {
      if (selectedOptions.includes(optIndex)) {
        setSelectedOptions(selectedOptions.filter(i => i !== optIndex));
      } else {
        setSelectedOptions([...selectedOptions, optIndex]);
      }
    } else {
      setSelectedOptions([optIndex]);
    }
    setAnswerStatus(null);
    setShowFeedback(false);
  };

  const checkAnswer = () => {
    if (!question.options || selectedOptions.length === 0) {
       setShowFeedback(true);
       return;
    }

    const correctIndices: number[] = [];
    const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
    
    question.options.forEach((opt, idx) => {
      const cleanOpt = opt.replace(/<[^>]*>/g, '').trim();
      const isCorrect = correctAnswers.some(ans => {
         const cleanAns = ans.replace(/<[^>]*>/g, '').trim();
         return cleanOpt === cleanAns;
      });
      if (isCorrect) correctIndices.push(idx);
    });

    const sortedSelected = [...selectedOptions].sort();
    const sortedCorrect = correctIndices.sort();
    
    const isMatch = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
    setAnswerStatus(isMatch ? 'correct' : 'incorrect');
    setShowFeedback(true);
  };

  const renderCorrectAnswer = () => {
    if (question.type === 'open' || !question.options) {
      return (
        <div dangerouslySetInnerHTML={{ 
          __html: Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer 
        }} />
      );
    }

    const answers = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer 
      : [question.correctAnswer];

    return (
      <div className="flex flex-col gap-1">
        {answers.map((ans, idx) => {
          const optIndex = question.options?.findIndex(opt => opt.trim() === ans.trim());
          const identifier = optIndex !== undefined && optIndex !== -1 
            ? String.fromCharCode(65 + optIndex)
            : '?';
          
          return (
            <div key={idx} className="flex items-start gap-2">
               {optIndex !== undefined && optIndex !== -1 && (
                 <span className="font-bold uppercase bg-green-100 text-green-800 border border-green-200 px-1.5 py-0.5 rounded text-xs mt-0.5 shrink-0">
                   {identifier}
                 </span>
               )}
               <span className="font-medium" dangerouslySetInnerHTML={{__html: ans}} />
            </div>
          );
        })}
      </div>
    );
  };

  if (isRegenerating) {
    return (
      <div className="ru-card p-12 flex justify-center items-center opacity-70">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <QuestionEditor 
        question={question} 
        index={index} 
        onSave={(updatedQ) => {
          onUpdate(index, updatedQ);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className={`ru-card p-6 hover:shadow-md transition-shadow group relative ${isReviewMode ? 'border-l-4' : ''} ${isReviewMode && answerStatus === 'correct' ? 'border-green-500' : isReviewMode && answerStatus === 'incorrect' ? 'border-primary' : 'border-gray-200'}`}>
      
      {/* Meta Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 flex-wrap">
           <span className="inline-flex items-center px-3 py-1 rounded text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
            {t.common.question} {index + 1}
          </span>
          <span className={`text-xs px-2 py-1 rounded font-medium border ${
            question.cognitiveLevel === 'Reproductie' || question.cognitiveLevel === 'Reproduction' ? 'border-blue-200 text-blue-800 bg-blue-50' :
            question.cognitiveLevel === 'Inzicht' || question.cognitiveLevel === 'Insight' ? 'border-purple-200 text-purple-800 bg-purple-50' :
            'border-green-200 text-green-800 bg-green-50'
          }`}>
            {question.cognitiveLevel}
          </span>
          {!isReviewMode && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold">
              {question.score || 3} {t.common.points}
            </span>
          )}
        </div>

        {/* Edit & Regenerate Tools - HIDDEN IN REVIEW MODE */}
        {!isReviewMode && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setIsEditing(true)} 
              className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded transition-colors"
              title={t.common.edit}
            >
              <Edit2 size={16} />
            </button>
            
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)} 
                className={`p-1.5 rounded transition-colors ${showMenu ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-primary hover:bg-primary/5'}`}
                title={t.common.regenerate}
              >
                <Wand2 size={16} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded shadow-xl border border-gray-200 z-10 py-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                    {t.common.regenerate}
                  </div>
                  
                  <button 
                    onClick={() => handleRegenerateClick('harder')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-2"
                  >
                    <TrendingUp size={14} className="text-orange-500" /> {t.common.makeHarder}
                  </button>
                  
                  <button 
                    onClick={() => handleRegenerateClick('easier')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-2"
                  >
                    <TrendingDown size={14} className="text-green-500" /> {t.common.makeEasier}
                  </button>

                  <button 
                    onClick={() => handleRegenerateClick('distractors')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-2"
                  >
                    <Target size={14} className="text-blue-500" /> {t.common.newDistractors}
                  </button>

                  <button 
                    onClick={() => handleRegenerateClick('shorter')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-2"
                  >
                    <Scissors size={14} className="text-purple-500" /> {t.common.shortenText}
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button 
                    onClick={() => handleRegenerateClick('random')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-2"
                  >
                    <Shuffle size={14} className="text-gray-500" /> {t.common.randomVariant}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 mb-3">
         <Target size={14} className="text-gray-400 mt-0.5" />
         <p className="text-xs text-gray-500 italic">{question.learningObjective}</p>
      </div>

      {question.stem && (
        <div 
          className="mb-4 text-sm text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-gray-300 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: question.stem }}
        />
      )}

      <div className="mb-4">
        <h3 
          className="text-base font-bold text-gray-900 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: question.question }}
        />
      </div>

      {question.options && question.options.length > 0 ? (
        <div className="space-y-2 mb-6">
          {question.options.map((opt, i) => {
            const isSelected = selectedOptions.includes(i);
            const reviewClasses = isReviewMode 
               ? `cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary border-primary bg-primary/5' : 'hover:bg-gray-50'}` 
               : 'cursor-default';
            
            return (
              <div 
                key={i} 
                onClick={() => toggleOptionSelection(i)}
                className={`flex items-start gap-3 p-2.5 rounded border ${reviewClasses} ${!isReviewMode ? 'border-transparent hover:bg-gray-50 hover:border-gray-200' : isSelected ? '' : 'border-gray-200'}`}
              >
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border mt-0.5 transition-colors ${isSelected && isReviewMode ? 'bg-primary text-white border-primary' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span 
                  className="text-gray-800 text-sm leading-relaxed prose prose-sm max-w-none [&>p]:m-0"
                  dangerouslySetInnerHTML={{ __html: opt }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-6 p-6 border-2 border-dashed border-gray-200 rounded text-gray-400 text-sm italic text-center">
          {isReviewMode ? 'Open question.' : 'Open question - See answer key.'}
        </div>
      )}

      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
        <button 
          onClick={isReviewMode ? checkAnswer : () => setShowFeedback(!showFeedback)}
          className={`text-sm font-bold flex items-center gap-1 ${isReviewMode ? 'px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-hover' : 'text-primary hover:underline'}`}
        >
          {isReviewMode ? (showFeedback ? t.common.checkAnswer : t.common.showAnswer) : (showFeedback ? t.common.hideAnswer : t.common.showAnswer)}
        </button>

        {isReviewMode && answerStatus && showFeedback && (
          <span className={`font-bold text-sm flex items-center gap-1 ${answerStatus === 'correct' ? 'text-green-600' : 'text-primary'}`}>
             {answerStatus === 'correct' ? (
                <><CheckCircle size={16} /> {t.common.correct}</>
             ) : (
                <><AlertCircle size={16} /> {t.common.incorrect}</>
             )}
          </span>
        )}
      </div>

      {showFeedback && (
          <div className="mt-4 animate-fadeIn">
            {/* Answer Box */}
            <div className={`p-4 rounded border mb-4 ${answerStatus === 'incorrect' ? 'bg-red-50/50 border-red-100' : 'bg-green-50/50 border-green-100'}`}>
              <p className="text-xs font-bold text-green-800 uppercase mb-2 flex items-center gap-2">
                <CheckCircle size={14} />
                {question.type === 'open' ? t.common.modelAnswer : t.common.correctAnswer}
              </p>
              
              <div className="text-sm text-gray-800 mb-3">
                {renderCorrectAnswer()}
              </div>

              <div className="border-t border-green-100 my-2"></div>
              <div className="text-sm text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-700 block mb-1">{t.common.explanation}: </span>
                <div dangerouslySetInnerHTML={{ __html: question.explanation }} className="prose prose-sm max-w-none" />
              </div>
            </div>

            {/* Rubric Table */}
            {question.type === 'open' && (
               <div className="mt-2 overflow-x-auto border border-gray-200 rounded">
                 {question.rubric && question.rubric.length > 0 ? (
                    <table className="w-full text-xs text-left text-gray-600">
                      <thead className="bg-gray-100 text-gray-800 font-bold border-b border-gray-200">
                        <tr>
                          <th className="p-2 border-r border-gray-200">{t.common.criterion}</th>
                          <th className="p-2 border-r border-gray-200 bg-red-50 text-red-800">{t.common.insufficient} (0)</th>
                          <th className="p-2 border-r border-gray-200 bg-orange-50 text-orange-800">{t.common.sufficient} (1)</th>
                          <th className="p-2 border-r border-gray-200 bg-yellow-50 text-yellow-800">{t.common.good} (2)</th>
                          <th className="p-2 bg-green-50 text-green-800">{t.common.excellent} (3)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {question.rubric.map((row, rid) => {
                          if (typeof row === 'string') {
                            return (
                               <tr key={rid} className="border-b last:border-0 border-gray-200">
                                  <td className="p-2 font-medium" colSpan={5} dangerouslySetInnerHTML={{__html: row}} />
                               </tr>
                            )
                          }
                          return (
                            <tr key={rid} className="border-b last:border-0 border-gray-200">
                              <td className="p-2 font-medium text-gray-900 border-r border-gray-200 bg-gray-50" dangerouslySetInnerHTML={{__html: row.criterion}} />
                              <td className="p-2 border-r border-gray-200 align-top" dangerouslySetInnerHTML={{__html: row.insufficient}} />
                              <td className="p-2 border-r border-gray-200 align-top" dangerouslySetInnerHTML={{__html: row.sufficient}} />
                              <td className="p-2 border-r border-gray-200 align-top" dangerouslySetInnerHTML={{__html: row.good}} />
                              <td className="p-2 align-top" dangerouslySetInnerHTML={{__html: row.excellent}} />
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                 ) : (
                   <div className="p-4 text-center text-gray-500 text-sm">
                     No rubric available.
                   </div>
                 )}
               </div>
            )}
          </div>
        )}
    </div>
  );
};