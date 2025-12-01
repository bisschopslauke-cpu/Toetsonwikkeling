import React from 'react';
import { Question, ExamMetadata } from '../types';

interface MatrixRow {
  Reproduction: number[];
  Insight: number[];
  Application: number[];
  total: number;
}

export const ExamMatrix: React.FC<{ questions: Question[], metadata: ExamMetadata }> = ({ questions, metadata }) => {
  
  const initialAccumulator: Record<string, MatrixRow> = {};

  const grouped = questions.reduce((acc, q, idx) => {
    const lo = q.learningObjective || 'Algemeen';
    const qNum = idx + 1;

    if (!acc[lo]) acc[lo] = { Reproduction: [], Insight: [], Application: [], total: 0 };
    
    if (q.cognitiveLevel === 'Reproductie' || q.cognitiveLevel === 'Reproduction') acc[lo].Reproduction.push(qNum);
    else if (q.cognitiveLevel === 'Inzicht' || q.cognitiveLevel === 'Insight') acc[lo].Insight.push(qNum);
    else if (q.cognitiveLevel === 'Toepassen' || q.cognitiveLevel === 'Application') acc[lo].Application.push(qNum);
    
    acc[lo].total++;
    return acc;
  }, initialAccumulator);

  const renderIndices = (indices: number[]) => {
    if (indices.length === 0) return <span className="text-gray-300">-</span>;
    return (
      <div className="flex flex-wrap justify-center gap-1">
        {indices.map(i => (
          <span key={i} className="bg-gray-100 text-gray-700 border border-gray-300 px-1.5 py-0.5 rounded text-xs font-semibold">
            V{i}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="ru-card p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Toetsmatrijs (Constructive Alignment)</h3>
      <p className="text-sm text-gray-500 mb-6 italic">{metadata.bloomLevelDistribution}</p>
      
      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3 border-b border-gray-200 border-r">Leerdoel</th>
              <th className="px-4 py-3 text-center border-b border-gray-200 w-1/5">Reproductie</th>
              <th className="px-4 py-3 text-center border-b border-gray-200 w-1/5">Inzicht</th>
              <th className="px-4 py-3 text-center border-b border-gray-200 w-1/5">Toepassen</th>
              <th className="px-4 py-3 text-right border-b border-gray-200 border-l bg-gray-50">Totaal</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([lo, data]: [string, MatrixRow], idx) => (
              <tr key={idx} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 text-xs border-r border-gray-200" title={lo}>
                  {lo}
                </td>
                <td className="px-4 py-3 text-center border-r border-gray-100">
                  {renderIndices(data.Reproduction)}
                </td>
                <td className="px-4 py-3 text-center border-r border-gray-100">
                  {renderIndices(data.Insight)}
                </td>
                <td className="px-4 py-3 text-center border-r border-gray-100">
                   {renderIndices(data.Application)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-gray-800 border-l border-gray-200 bg-gray-50/50">
                  {data.total}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 font-bold border-t-2 border-gray-300">
            <tr>
              <td className="px-4 py-3 border-r border-gray-300">TOTAAL</td>
              <td className="px-4 py-3 text-center">{questions.filter(q => q.cognitiveLevel === 'Reproductie' || q.cognitiveLevel === 'Reproduction').length}</td>
              <td className="px-4 py-3 text-center">{questions.filter(q => q.cognitiveLevel === 'Inzicht' || q.cognitiveLevel === 'Insight').length}</td>
              <td className="px-4 py-3 text-center">{questions.filter(q => q.cognitiveLevel === 'Toepassen' || q.cognitiveLevel === 'Application').length}</td>
              <td className="px-4 py-3 text-right border-l border-gray-300 text-primary">{questions.length}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};