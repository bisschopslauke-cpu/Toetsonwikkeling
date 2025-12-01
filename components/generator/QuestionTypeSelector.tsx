import React from 'react';
import { SlidersHorizontal, Sparkles, CheckCircle2, CheckSquare, MessageSquare } from 'lucide-react';
import { GeneratorConfig, QuestionType } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuestionTypeSelectorProps {
  config: GeneratorConfig;
  setConfig: React.Dispatch<React.SetStateAction<GeneratorConfig>>;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({ config, setConfig }) => {
  const { t } = useLanguage();

  const questionTypeOptions = [
    {
      id: QuestionType.MIXED,
      label: 'Radboud Mix',
      icon: Sparkles,
      description: '90% Single Choice, 10% Multiple Response.',
    },
    {
      id: QuestionType.SINGLE_CHOICE,
      label: 'Single Choice',
      icon: CheckCircle2,
      description: '1-of-4',
    },
    {
      id: QuestionType.MULTIPLE_RESPONSE,
      label: 'Multiple Response',
      icon: CheckSquare,
      description: 'Multiple answers',
    },
    {
      id: QuestionType.OPEN,
      label: 'Open',
      icon: MessageSquare,
      description: 'Rubric based',
    }
  ];

  return (
    <div className="ru-card p-4 h-full">
      <h2 className="text-xs font-bold uppercase text-gray-500 mb-4 flex items-center gap-1">
        <SlidersHorizontal size={14} /> {t.generator.questionType}
      </h2>
      <div className="space-y-3">
        {questionTypeOptions.map((option) => (
          <div 
            key={option.id}
            onClick={() => setConfig({...config, questionType: option.id})}
            className={`
              relative p-3 rounded border cursor-pointer transition-all duration-200 group
              ${config.questionType === option.id 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'}
            `}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className={`
                p-1.5 rounded transition-colors
                ${config.questionType === option.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}
              `}>
                <option.icon size={20} />
              </div>
              <div>
                <h3 className={`font-bold text-xs ${config.questionType === option.id ? 'text-primary' : 'text-gray-700'}`}>
                  {option.label}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};