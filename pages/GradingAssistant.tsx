
import React, { useState, useRef } from 'react';
import { Upload, FileIcon, Trash2, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, MinusCircle, ArrowRight, Gavel, GraduationCap, Download } from 'lucide-react';
import { Button } from '../components/Button';
import { UploadedFile, GradingResult } from '../types';
import { gradeStudentWork } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

export const GradingAssistantPage: React.FC = () => {
  const [teacherFile, setTeacherFile] = useState<UploadedFile | null>(null);
  const [studentFile, setStudentFile] = useState<UploadedFile | null>(null);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [totalPoints, setTotalPoints] = useState<number | undefined>(undefined);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const teacherInputRef = useRef<HTMLInputElement>(null);
  const studentInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isTeacher: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError("File is too large (max 8MB).");
      return;
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

      const uploadedFile: UploadedFile = {
        name: file.name,
        mimeType: file.type,
        base64: base64Content,
        size: file.size
      };

      if (isTeacher) setTeacherFile(uploadedFile);
      else setStudentFile(uploadedFile);
      setError(null);
    } catch (err) {
      setError("Error reading file.");
    }
    
    // Reset input
    e.target.value = '';
  };

  const handleGrade = async () => {
    if (!teacherFile || !studentFile) {
      setError("Upload both the answer key and student work.");
      return;
    }
    if (!privacyConfirmed) {
      setError("Please confirm privacy compliance.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const gradingResult = await gradeStudentWork(teacherFile, studentFile, totalPoints);
      setResult(gradingResult);
    } catch (err: any) {
      setError(err.message || "Error during grading.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const content = `REPORT
Date: ${new Date().toLocaleDateString()}
Score: ${result.totalScore} / ${result.maxScore}
Grade: ${result.calculatedGrade}
Feedback: ${result.generalFeedback}

DETAILS:
------------------
${result.questions.map(q => `
${q.questionId} (${q.awardedPoints}/${q.maxPoints} pt) - ${q.status.toUpperCase()}
Teacher Feedback: ${q.feedback}
Student Feedback: ${q.studentFeedback}
`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Grading_Report_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatusIcon = (status: string) => {
    switch(status) {
      case 'correct': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'incorrect': return <XCircle className="text-red-500" size={20} />;
      default: return <MinusCircle className="text-orange-500" size={20} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-10 border-b border-gray-200 pb-6 flex items-start justify-between">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Gavel className="text-primary" size={32} /> {t.grading.title}
           </h1>
           <p className="text-gray-600 mt-2 text-base max-w-2xl">
            {t.grading.subtitle}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Docent File */}
          <div className="ru-card p-6 border-l-4 border-gray-800">
             <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
               {t.grading.teacherFileTitle}
             </h2>
             <p className="text-sm text-gray-500 mb-4">
               {t.grading.teacherFileDesc}
             </p>

             {!teacherFile ? (
               <div 
                 onClick={() => teacherInputRef.current?.click()}
                 className="border-2 border-dashed border-gray-300 rounded bg-gray-50 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
               >
                 <Upload className="text-gray-400 mb-2" />
                 <span className="text-sm font-bold text-gray-600">{t.grading.uploadModel}</span>
                 <input type="file" ref={teacherInputRef} className="hidden" onChange={(e) => handleFileUpload(e, true)} accept=".pdf,.docx,.txt" />
               </div>
             ) : (
               <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded border border-gray-200">
                       <FileIcon size={16} className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{teacherFile.name}</p>
                      <p className="text-xs text-gray-500">{t.grading.modelLabel}</p>
                    </div>
                  </div>
                  <button onClick={() => setTeacherFile(null)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
               </div>
             )}
          </div>

          {/* 2. Student File */}
          <div className="ru-card p-6 border-l-4 border-primary">
             <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
               {t.grading.studentFileTitle}
             </h2>
             <p className="text-sm text-gray-500 mb-4">
               {t.grading.studentFileDesc}
             </p>

             {!studentFile ? (
               <div 
                 onClick={() => studentInputRef.current?.click()}
                 className="border-2 border-dashed border-gray-300 rounded bg-gray-50 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
               >
                 <Upload className="text-gray-400 mb-2" />
                 <span className="text-sm font-bold text-gray-600">{t.grading.uploadStudent}</span>
                 <input type="file" ref={studentInputRef} className="hidden" onChange={(e) => handleFileUpload(e, false)} accept=".pdf,.docx,.txt" />
               </div>
             ) : (
               <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded border border-gray-200">
                       <FileIcon size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{studentFile.name}</p>
                      <p className="text-xs text-gray-500">{t.grading.studentLabel}</p>
                    </div>
                  </div>
                  <button onClick={() => setStudentFile(null)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
               </div>
             )}
          </div>

          {/* Settings & Privacy */}
          <div className="ru-card p-6 bg-white">
             <div className="mb-4">
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">{t.grading.totalPointsLabel}</label>
               <input 
                 type="number" 
                 className="w-full rounded border border-gray-300 p-2 text-sm focus:border-primary focus:outline-none"
                 placeholder="e.g. 40"
                 value={totalPoints || ''}
                 onChange={(e) => setTotalPoints(parseInt(e.target.value))}
               />
               <p className="text-xs text-gray-400 mt-1">{t.grading.leaveEmpty}</p>
             </div>

             <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 border-gray-300 rounded text-primary focus:ring-primary mt-0.5"
                      checked={privacyConfirmed}
                      onChange={(e) => setPrivacyConfirmed(e.target.checked)}
                    />
                  </div>
                  <div className="text-sm text-yellow-800">
                    <span className="font-bold block mb-0.5">{t.grading.privacyTitle}</span>
                    <span dangerouslySetInnerHTML={{ __html: t.grading.privacyText }}></span>
                  </div>
                </label>
             </div>

             <Button onClick={handleGrade} isLoading={isLoading} disabled={isLoading} className="w-full py-3 text-base">
                {t.grading.startGrading}
             </Button>

             {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200 flex items-center gap-2">
                  <AlertTriangle size={16} /> {error}
                </div>
             )}
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="lg:col-span-7">
           {!result && !isLoading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded bg-gray-50/50">
                 <ShieldCheck size={48} className="mb-4 opacity-20" />
                 <p className="text-base font-medium">{t.grading.emptyState}</p>
                 <p className="text-sm">{t.grading.uploadPrompt}</p>
              </div>
           )}

           {isLoading && (
             <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-6 bg-white rounded border border-gray-200">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{t.grading.processing}</h3>
                  <p className="text-sm text-gray-500">{t.grading.processingDesc}</p>
                </div>
             </div>
           )}

           {result && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Scorecard */}
                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                   <div className="bg-primary p-6 text-white flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold">{t.grading.reportTitle}</h2>
                        <p className="text-primary-light opacity-90 text-sm">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                         <div className="text-4xl font-bold">{result.calculatedGrade}</div>
                         <div className="text-sm opacity-90">{t.grading.gradeIndication}</div>
                      </div>
                   </div>
                   <div className="p-6 grid grid-cols-2 gap-8">
                      <div>
                         <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t.grading.scoreAchieved}</p>
                         <p className="text-2xl font-bold text-gray-900">{result.totalScore} <span className="text-lg text-gray-400 font-normal">/ {result.maxScore}</span></p>
                      </div>
                      <div>
                         <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t.grading.impression}</p>
                         <p className="text-sm text-gray-700 leading-snug">{result.generalFeedback}</p>
                      </div>
                   </div>
                </div>

                <div className="flex justify-end">
                   <Button variant="outline" onClick={downloadReport} className="text-xs">
                      <Download size={14} /> {t.grading.downloadReport}
                   </Button>
                </div>

                {/* Question Breakdown */}
                <div className="space-y-4">
                  {result.questions.map((q, i) => (
                    <div key={i} className="ru-card p-0 overflow-hidden group">
                       <div className={`p-4 border-l-4 flex items-start gap-4 ${
                         q.status === 'correct' ? 'border-green-500 bg-green-50/20' : 
                         q.status === 'incorrect' ? 'border-red-500 bg-red-50/20' : 
                         'border-orange-400 bg-orange-50/20'
                       }`}>
                          <div className="mt-1">
                             {renderStatusIcon(q.status)}
                          </div>
                          
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-gray-900">{q.questionId}</h3>
                                <span className="text-sm font-bold bg-white border border-gray-200 px-2 py-1 rounded shadow-sm">
                                   {q.awardedPoints} / {q.maxPoints} pt
                                </span>
                             </div>
                             
                             {q.studentAnswerSummary && (
                               <div className="mb-3 text-sm text-gray-600 bg-white/50 p-2 rounded border border-gray-100 italic">
                                 "{q.studentAnswerSummary}"
                               </div>
                             )}

                             <div className="grid md:grid-cols-2 gap-4 mt-3">
                                <div className="text-sm">
                                   <strong className="text-gray-700 block text-xs uppercase mb-1">{t.grading.analysisTeacher}</strong>
                                   <p className="text-gray-600">{q.feedback}</p>
                                </div>
                                <div className="text-sm bg-white p-2 rounded border border-gray-100">
                                   <strong className="text-primary block text-xs uppercase mb-1 flex items-center gap-1"><GraduationCap size={12}/> {t.grading.feedbackStudent}</strong>
                                   <p className="text-gray-700 italic">"{q.studentFeedback}"</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>

             </div>
           )}
        </div>
      </div>
    </div>
  );
};
