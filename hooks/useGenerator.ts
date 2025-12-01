import { useState, useEffect, useRef } from 'react';
import { GeneratorConfig, GeneratedExam, Difficulty, QuestionType, UploadedFile, RegenerationMode, Question } from '../types';
import { generateQuestions, regenerateOneQuestion } from '../services/geminiService';
import { MOCK_EXAMPLES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const STORAGE_KEY = 'dtm_session_v2_ru';

export const useGenerator = () => {
  const { language, t } = useLanguage();
  
  // Initialize Config from Storage
  const [config, setConfig] = useState<GeneratorConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaults = {
      language: language,
      sourceText: '',
      learningObjectives: '',
      sourceScope: '', // Default empty
      courseCode: '',
      targetGroup: '',
      weighting: '',
      files: [],
      numQuestions: 5,
      difficulty: Difficulty.WO_BA,
      questionType: QuestionType.MIXED
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaults, ...parsed.config, language };
      } catch (e) { console.error("Error parsing storage", e); }
    }
    return defaults;
  });

  // Initialize Result from Storage
  const [result, setResult] = useState<GeneratedExam | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).result || null;
      } catch (e) {}
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);

  // Sync Language
  useEffect(() => {
    setConfig(prev => ({ ...prev, language }));
  }, [language]);

  // Persist State
  useEffect(() => {
    const dataToSave = {
      config,
      result,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [config, result]);

  const handleReset = () => {
    if (window.confirm(language === 'nl' ? "Weet je zeker dat je alles wilt wissen?" : "Are you sure you want to clear everything?")) {
      localStorage.removeItem(STORAGE_KEY);
      setConfig({
        language,
        sourceText: '',
        learningObjectives: '',
        sourceScope: '', // Reset
        courseCode: '',
        targetGroup: '',
        weighting: '',
        files: [],
        numQuestions: 5,
        difficulty: Difficulty.WO_BA,
        questionType: QuestionType.MIXED
      });
      setResult(null);
      setError(null);
      return true; // Signal that reset happened
    }
    return false;
  };

  const loadExample = (id: string) => {
    const example = MOCK_EXAMPLES.find(ex => ex.id === id);
    if (example) {
      setConfig(prev => ({
        ...prev,
        sourceText: example.text[language],
        learningObjectives: example.learningObjectives[language],
        courseCode: example.courseCode
      }));
    }
  };

  const addFiles = (newFiles: UploadedFile[]) => {
    setConfig(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const removeFile = (index: number) => {
    setConfig(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const generate = async (activeTab: 'text' | 'file') => {
    if (activeTab === 'text' && config.sourceText.length < 50) {
      setError(language === 'nl' ? "Voer minimaal 50 karakters tekst in." : "Enter at least 50 characters.");
      return;
    }
    if (activeTab === 'file' && config.files.length === 0) {
      setError(language === 'nl' ? "Upload eerst minstens één bestand." : "Upload at least one file.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const exam = await generateQuestions(config);
      setResult(exam);
    } catch (err: any) {
      setError(err.message || "Error during generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateQuestion = async (index: number, mode: RegenerationMode = 'random') => {
    if (!result) return;
    setRegeneratingId(index);
    try {
      const currentQuestion = result.questions[index];
      const newQuestion = await regenerateOneQuestion(config, mode, currentQuestion);
      
      const updatedQuestions = [...result.questions];
      updatedQuestions[index] = newQuestion;
      setResult({ ...result, questions: updatedQuestions });
    } catch (err) {
      console.error("Failed to regenerate", err);
    } finally {
      setRegeneratingId(null);
    }
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    if (!result) return;
    const updatedQuestions = [...result.questions];
    updatedQuestions[index] = updatedQuestion;
    setResult({ ...result, questions: updatedQuestions });
  };

  return {
    config,
    setConfig,
    result,
    setResult, // Exposed if needed for advanced manipulation
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
  };
};