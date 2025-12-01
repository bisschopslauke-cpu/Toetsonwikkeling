

import { GoogleGenAI, Type } from "@google/genai";
import { GeneratorConfig, QuestionType, Difficulty, GeneratedExam, Question, ChatMessage, RegenerationMode, UploadedFile, GradingResult } from '../types';
import { getSystemInstruction } from '../constants';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key missing.");
  }
  return new GoogleGenAI({ apiKey });
};

// Shared prompt builder
const buildParts = (config: GeneratorConfig, isSingleQuestion = false): any[] => {
  const isDutch = config.language === 'nl';
  
  let prompt = isSingleQuestion 
    ? (isDutch 
        ? `Genereer één (1) vervangende toetsvraag op ${config.difficulty} niveau. ` 
        : `Generate one (1) replacement exam question at ${config.difficulty} level. `)
    : (isDutch 
        ? `Genereer een toets met ${config.numQuestions} vragen.\n` 
        : `Generate an exam with ${config.numQuestions} questions.\n`);
  
  prompt += isDutch 
    ? `Niveau: ${config.difficulty}.\n`
    : `Level: ${config.difficulty}.\n`;
  
  prompt += isDutch 
    ? `Onderwijseenheid/Cursuscode: ${config.courseCode || 'Onbekend'}.\n`
    : `Course Code: ${config.courseCode || 'Unknown'}.\n`;
    
  prompt += isDutch 
    ? `Doelgroep: ${config.targetGroup || 'Studenten'}.\n`
    : `Target Group: ${config.targetGroup || 'Students'}.\n`;

  prompt += isDutch 
    ? `Toetsweging: ${config.weighting || 'Niet gespecificeerd'}.\n`
    : `Weighting: ${config.weighting || 'Not specified'}.\n`;

  prompt += `Type: ${config.questionType}.\n`;
  
  if (config.learningObjectives && config.learningObjectives.trim() !== '') {
    prompt += isDutch 
      ? `\nBELANGRIJK - LEERDOELEN: De vragen moeten specifiek toetsen of de student de volgende leerdoelen beheerst (Constructive Alignment):\n"${config.learningObjectives}"\n\n`
      : `\nIMPORTANT - LEARNING OBJECTIVES: Questions must specifically test if the student masters the following objectives (Constructive Alignment):\n"${config.learningObjectives}"\n\n`;
  } else {
    prompt += isDutch 
      ? `\nIdentificeer zelf relevante leerdoelen uit de tekst voor constructive alignment.\n`
      : `\nIdentify relevant learning objectives from the text yourself for constructive alignment.\n`;
  }

  prompt += isDutch 
    ? `Gebruik de brontekst of de geüploade bestanden hieronder als basis.\n\n`
    : `Use the source text or uploaded files below as a basis.\n\n`;

  const parts: any[] = [];
  
  // Handle multiple files
  if (config.files && config.files.length > 0) {
    config.files.forEach(file => {
      parts.push({
        inlineData: {
          data: file.base64,
          mimeType: file.mimeType
        }
      });
    });
    prompt += isDutch 
      ? `Baseer de vragen op de inhoud van de ${config.files.length} bijgevoegde bestand(en).`
      : `Base the questions on the content of the ${config.files.length} attached file(s).`;
  } 
  
  // Always include text if present, or if no files
  if (config.sourceText) {
    prompt += isDutch 
      ? `\n\nBrontekst:\n"${config.sourceText}"\n`
      : `\n\nSource Text:\n"${config.sourceText}"\n`;
  }

  // Source Scope Logic
  if (config.sourceScope && config.sourceScope.trim() !== '') {
    prompt += isDutch 
      ? `\n\nCONTEXT RESTRICTIE: De gebruiker heeft aangegeven dat ALLEEN de volgende secties uit het bronmateriaal relevant zijn: "${config.sourceScope}".\nINSTRUCTIE: Negeer informatie uit andere hoofdstukken of secties. Als het antwoord niet in de opgegeven secties te vinden is, genereer de vraag dan niet.`
      : `\n\nCONTEXT RESTRICTION: The user has indicated that ONLY the following sections from the source material are relevant: "${config.sourceScope}".\nINSTRUCTION: Ignore information from other chapters or sections. If the answer cannot be found in the specified sections, do not generate the question.`;
  }

  // Explicit language instruction again in prompt to be safe
  prompt += `\n\nOUTPUT LANGUAGE: ${config.language === 'nl' ? 'DUTCH' : 'ENGLISH'}. Ensure the JSON content is in this language.`;

  parts.push({ text: prompt });
  return parts;
};

// Complex response schema matching the new types
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    metadata: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        courseCode: { type: Type.STRING },
        targetGroup: { type: Type.STRING },
        bloomLevelDistribution: { type: Type.STRING },
        weighting: { type: Type.STRING }
      }
    },
    integrationInfo: {
      type: Type.OBJECT,
      properties: {
        brightspace: {
          type: Type.OBJECT,
          properties: {
            gradeItemName: { type: Type.STRING },
            points: { type: Type.NUMBER },
            passingScore: { type: Type.NUMBER },
            weight: { type: Type.NUMBER },
            advice: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        osiris: {
          type: Type.OBJECT,
          properties: {
            courseCode: { type: Type.STRING },
            gradingScale: { type: Type.STRING },
            passingRule: { type: Type.STRING },
            compensation: { type: Type.STRING }
          }
        }
      }
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["single_choice", "multiple_response", "open"] },
          learningObjective: { type: Type.STRING },
          stem: { type: Type.STRING },
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING }, // Allow string, client handles split if needed, or use JSON string
          explanation: { type: Type.STRING },
          cognitiveLevel: { type: Type.STRING, enum: ["Reproductie", "Inzicht", "Toepassen", "Reproduction", "Insight", "Application"] },
          score: { type: Type.INTEGER, description: "Points for this question, typically 3" },
          rubric: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                criterion: { type: Type.STRING },
                insufficient: { type: Type.STRING },
                sufficient: { type: Type.STRING },
                good: { type: Type.STRING },
                excellent: { type: Type.STRING }
              },
              required: ["criterion", "insufficient", "sufficient", "good", "excellent"]
            }
          }
        },
        required: ["type", "question", "correctAnswer", "explanation", "learningObjective", "cognitiveLevel", "rubric"]
      }
    }
  }
};

export const generateQuestions = async (config: GeneratorConfig): Promise<GeneratedExam> => {
  const ai = getClient();
  const modelId = 'gemini-3-pro-preview'; 

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: 'user',
        parts: buildParts(config)
      },
      config: {
        systemInstruction: getSystemInstruction(config.language),
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI.");

    const json = JSON.parse(text);
    return json as GeneratedExam;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const regenerateOneQuestion = async (
  config: GeneratorConfig, 
  mode: RegenerationMode = 'random',
  originalQuestion?: Question
): Promise<Question> => {
  const ai = getClient();
  const modelId = 'gemini-3-pro-preview'; 

  // Build base parts including file context
  const parts = buildParts(config, true);

  // If specific mode and original question exist, append specific instruction
  if (originalQuestion) {
    const qJson = JSON.stringify(originalQuestion);
    let instruction = "";
    
    if (config.language === 'nl') {
        switch (mode) {
          case 'harder':
            instruction = `Hier is de huidige vraag: ${qJson}. \nOPDRACHT: Genereer een VARIANT op deze vraag die MOEILIJKER is. Verhoog het cognitieve niveau (bijv. van Reproductie naar Inzicht/Toepassen) of maak de opties minder evident.`;
            break;
          case 'easier':
            instruction = `Hier is de huidige vraag: ${qJson}. \nOPDRACHT: Genereer een VARIANT op deze vraag die MAKKELIJKER/TOEGANKELIJKER is. Verlaag het cognitieve niveau of vereenvoudig de vraagstelling.`;
            break;
          case 'distractors':
            instruction = `Hier is de huidige vraag: ${qJson}. \nOPDRACHT: Behoud de vraagstam en het goede antwoord, maar genereer NIEUWE, betere afleiders (foute antwoorden) die inspelen op veelgemaakte denkfouten.`;
            break;
          case 'shorter':
            instruction = `Hier is de huidige vraag: ${qJson}. \nOPDRACHT: Herschrijf de stam en de vraagstelling zodat deze veel BEKNOPTER, directer en leesbaarder is, zonder de essentie te verliezen.`;
            break;
          case 'random':
          default:
            instruction = `Genereer een compleet nieuwe vraag over een ander aspect van de stof.`;
            break;
        }
    } else {
        switch (mode) {
          case 'harder':
            instruction = `Here is the current question: ${qJson}. \nTASK: Generate a VARIANT that is HARDER. Increase cognitive level or make options less obvious.`;
            break;
          case 'easier':
            instruction = `Here is the current question: ${qJson}. \nTASK: Generate a VARIANT that is EASIER/MORE ACCESSIBLE. Lower cognitive level or simplify wording.`;
            break;
          case 'distractors':
            instruction = `Here is the current question: ${qJson}. \nTASK: Keep stem and correct answer, but generate NEW, better distractors based on common misconceptions.`;
            break;
          case 'shorter':
            instruction = `Here is the current question: ${qJson}. \nTASK: Rewrite stem and question to be CONCISE and direct, without losing essence.`;
            break;
          case 'random':
          default:
            instruction = `Generate a completely new question about a different aspect of the material.`;
            break;
        }
    }
    
    parts.push({ text: instruction });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: getSystemInstruction(config.language),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             // Simplified schema just for one question wrapper to match return type expectation
             questions: responseSchema.properties.questions
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI.");

    const json = JSON.parse(text);
    
    if (json.questions && json.questions.length > 0) {
      return json.questions[0];
    }
    throw new Error("No valid question generated.");

  } catch (error) {
    console.error("Gemini Regenerate Error:", error);
    throw error;
  }
};

export const refineText = async (text: string, instruction: string): Promise<string> => {
  const ai = getClient();
  const modelId = 'gemini-3-pro-preview';

  const prompt = `
    Role: Academic editor.
    Task: Rewrite the text below according to instruction.
    
    ORIGINAL TEXT:
    "${text}"
    
    INSTRUCTION: 
    ${instruction}
    
    OUTPUT:
    Return ONLY the rewritten text. Keep HTML tags if relevant.
  `;

  try {
     const response = await ai.models.generateContent({
      model: modelId,
      contents: { role: 'user', parts: [{ text: prompt }] },
      config: { responseMimeType: 'text/plain' }
    });
    return response.text?.trim() || text;
  } catch (e) {
    console.error("Refine error", e);
    throw e;
  }
};

// --- Grading Assistant ---

const getGradingInstruction = (language: string) => `
Act as: Experienced university examiner.
Task: Grade student work based on teacher's answer key.
LANGUAGE: ${language === 'nl' ? 'DUTCH' : 'ENGLISH'}

PROCESS:
1. Analyze Teacher File (The Standard).
2. Analyze Student File (The Performance).
3. Map answers.
4. Award points (Strict but fair).
5. Calculate grade.

OUTPUT:
JSON format. Provide constructive feedback.
`;

const gradingResponseSchema = {
  type: Type.OBJECT,
  properties: {
    totalScore: { type: Type.NUMBER },
    maxScore: { type: Type.NUMBER },
    calculatedGrade: { type: Type.NUMBER },
    generalFeedback: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          questionId: { type: Type.STRING },
          studentAnswerSummary: { type: Type.STRING },
          awardedPoints: { type: Type.NUMBER },
          maxPoints: { type: Type.NUMBER },
          feedback: { type: Type.STRING, description: "Internal reasoning" },
          studentFeedback: { type: Type.STRING, description: "Feedback for student" },
          status: { type: Type.STRING, enum: ["correct", "partial", "incorrect"] }
        },
        required: ["questionId", "awardedPoints", "maxPoints", "feedback", "status"]
      }
    }
  },
  required: ["totalScore", "maxScore", "calculatedGrade", "questions"]
};

export const gradeStudentWork = async (
  teacherFile: UploadedFile,
  studentFile: UploadedFile,
  configPoints?: number
): Promise<GradingResult> => {
  const ai = getClient();
  const modelId = 'gemini-3-pro-preview'; 

  // Detect language based on context (defaulting to NL if not passed, but we should try to pass config in future updates. 
  // For now assuming the grading assistant is language agnostic or follows the content language. 
  // To keep it simple, we'll auto-detect or default to NL, but ideally GradingAssistant passes language preference.)
  // Let's assume NL for legacy compat, but prompt instructs to follow content.
  
  const parts: any[] = [];
  
  parts.push({ text: "DOCUMENT 1: ANSWER KEY:" });
  parts.push({
    inlineData: { data: teacherFile.base64, mimeType: teacherFile.mimeType }
  });

  parts.push({ text: "DOCUMENT 2: STUDENT WORK:" });
  parts.push({
    inlineData: { data: studentFile.base64, mimeType: studentFile.mimeType }
  });

  let prompt = `Compare Doc 2 with Doc 1. Grade each question. Calculate grade 1-10.`;
  
  if (configPoints) {
    prompt += `\nTotal points available: ${configPoints}. Scale if necessary.`;
  }

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        // Defaulting to NL instruction as GradingPage doesn't pass config yet, 
        // but the prompt allows mixed language processing.
        systemInstruction: getGradingInstruction('nl'), 
        responseMimeType: "application/json",
        responseSchema: gradingResponseSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI.");

    return JSON.parse(text) as GradingResult;

  } catch (error) {
    console.error("Grading Error:", error);
    throw error;
  }
};

// --- Chat Functionality ---

export const sendChatMessage = async (
  messages: ChatMessage[], 
  contextConfig: GeneratorConfig
): Promise<string> => {
  const ai = getClient();
  const modelId = 'gemini-3-pro-preview';
  const isDutch = contextConfig.language === 'nl';

  const chatSystemInstruction = isDutch 
    ? `Je bent een didactische coach en toetsexpert aan de Radboud Universiteit.
       Huidige context: Cursus ${contextConfig.courseCode}, Niveau ${contextConfig.difficulty}.
       Spreek Nederlands.`
    : `You are a didactic coach and exam expert at Radboud University.
       Current context: Course ${contextConfig.courseCode}, Level ${contextConfig.difficulty}.
       Speak English.`;

  const history = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  try {
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: chatSystemInstruction,
      },
      history: history.slice(0, -1) 
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage({ message: lastMessage.text });
    
    return result.text || "Error generating response.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Connection error.";
  }
};