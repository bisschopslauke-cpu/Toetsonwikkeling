import React, { useState } from 'react';
import { ChatWidget } from '../components/ChatWidget';
import { useLanguage } from '../contexts/LanguageContext';
import { useGenerator } from '../hooks/useGenerator';
import { GeneratorInput } from '../components/generator/GeneratorInput';
import { QuestionTypeSelector } from '../components/generator/QuestionTypeSelector';
import { GeneratorResults } from '../components/generator/GeneratorResults';

export const GeneratorPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [isReviewMode, setIsReviewMode] = useState(false);

  const {
    config,
    setConfig,
    result,
    isLoading,
    error,
    setError,
    regeneratingId,
    handleReset,
    loadExample,
    addFiles,
    removeFile,
    generate,
    regenerateQuestion,
    updateQuestion
  } = useGenerator();

  const handleResetWrapper = () => {
    if (handleReset()) {
      setIsReviewMode(false);
      setActiveTab('text');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <ChatWidget config={config} />

      {/* Header Section */}
      <div className="mb-10 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t.generator.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
          {t.generator.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input (4 cols) - Hidden in Review Mode */}
        {!isReviewMode && (
          <div className="lg:col-span-4">
             <GeneratorInput 
               config={config}
               setConfig={setConfig}
               activeTab={activeTab}
               setActiveTab={setActiveTab}
               isLoading={isLoading}
               error={error}
               setError={setError}
               onGenerate={() => generate(activeTab)}
               onReset={handleResetWrapper}
               onLoadExample={loadExample}
               onAddFiles={addFiles}
               onRemoveFile={removeFile}
             />
          </div>
        )}

        {/* Middle Column: Configuration (2 cols) - Hidden in Review Mode */}
        {!isReviewMode && (
          <div className="lg:col-span-2">
            <QuestionTypeSelector config={config} setConfig={setConfig} />
          </div>
        )}

        {/* Right Column: Output */}
        <div className={`space-y-6 ${isReviewMode ? 'lg:col-span-12 max-w-4xl mx-auto' : 'lg:col-span-6'}`}>
           <GeneratorResults 
             result={result}
             config={config}
             isLoading={isLoading}
             isReviewMode={isReviewMode}
             setIsReviewMode={setIsReviewMode}
             regeneratingId={regeneratingId}
             onRegenerate={regenerateQuestion}
             onUpdate={updateQuestion}
           />
        </div>
      </div>
    </div>
  );
};