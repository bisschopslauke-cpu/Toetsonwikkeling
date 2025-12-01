

export type Language = 'nl' | 'en';

export enum QuestionType {
  OPEN = 'Open Vragen',
  SINGLE_CHOICE = 'Eén-uit-meer (Single Choice)',
  MULTIPLE_RESPONSE = 'Meerkeuze (Multiple Response)',
  MIXED = 'Mix (Radboud Standaard)'
}

export enum Difficulty {
  HBO = 'HBO',
  WO_BA = 'WO Bachelor',
  WO_MA = 'WO Master'
}

export type RegenerationMode = 'random' | 'harder' | 'easier' | 'distractors' | 'shorter';

export interface RubricRow {
  criterion: string;
  insufficient: string;
  sufficient: string;
  good: string;
  excellent: string;
}

export interface Question {
  id: string;
  type: 'single_choice' | 'multiple_response' | 'open';
  learningObjective: string; // Constructive alignment
  stem: string; 
  question: string; 
  options?: string[];
  correctAnswer: string | string[]; 
  explanation: string; 
  rubric?: RubricRow[]; // Now structured
  cognitiveLevel: 'Reproductie' | 'Inzicht' | 'Toepassen' | 'Reproduction' | 'Insight' | 'Application';
  score?: number; // Defaults to 3
}

export interface ExamMetadata {
  title: string;
  courseCode: string;
  targetGroup: string;
  bloomLevelDistribution: string;
  weighting: string;
}

export interface IntegrationInfo {
  brightspace: {
    gradeItemName: string;
    points: number;
    passingScore: number;
    weight: number;
    advice: string[];
  };
  osiris: {
    courseCode: string;
    gradingScale: string;
    passingRule: string;
    compensation: string;
  };
}

export interface GeneratedExam {
  metadata: ExamMetadata;
  questions: Question[];
  integrationInfo: IntegrationInfo;
}

export interface UploadedFile {
  name: string;
  base64: string;
  mimeType: string;
  size: number;
}

export interface GeneratorConfig {
  language: Language; // NEW
  sourceText: string;
  learningObjectives?: string;
  sourceScope?: string; // NEW: Focusgebied/Hoofdstukken
  courseCode?: string;
  targetGroup?: string; // NEW: Doelgroep (e.g., Bachelor Jaar 1)
  weighting?: string;   // NEW: Weging (e.g., 20% van eindcijfer)
  files: UploadedFile[];
  numQuestions: number;
  difficulty: Difficulty;
  questionType: QuestionType;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// --- GRADING ASSISTANT TYPES ---

export interface GradedQuestion {
  questionId: string;
  studentAnswerSummary: string;
  awardedPoints: number;
  maxPoints: number;
  feedback: string; // Internal reasoning / explanation for teacher
  studentFeedback: string; // Constructive feedback directly for the student
  status: 'correct' | 'partial' | 'incorrect';
}

export interface GradingResult {
  totalScore: number;
  maxScore: number;
  calculatedGrade: number;
  generalFeedback: string;
  questions: GradedQuestion[];
}