import PptxGenJS from 'pptxgenjs';
import { GeneratedExam, GeneratorConfig, RubricRow } from '../types';

// Helper to strip HTML tags for clean CSV/Plain text export
const stripHtml = (html: string | undefined): string => {
  if (!html) return '';
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// Helper to format rubric for text output
const formatRubric = (rubric: RubricRow[] | string[] | undefined): string => {
  if (!rubric) return '';
  return rubric.map(r => {
    if (typeof r === 'string') return stripHtml(r);
    return `${stripHtml(r.criterion)} (Voldoende: ${stripHtml(r.sufficient)}, Excellent: ${stripHtml(r.excellent)})`;
  }).join(' | ');
};

export const downloadAnsExport = (result: GeneratedExam) => {
  // Ans Import Format (Excel/CSV compatible)
  // Required columns typically: Type, Question, Points, Option 1...Option N, Correct Answer(s)
  
  const headers = [
    "Type", 
    "Question", 
    "Points", 
    "Correct Answer", 
    "Option 1", "Option 2", "Option 3", "Option 4", 
    "Feedback"
  ];

  const rows = result.questions.map(q => {
    let type = "Multiple choice";
    if (q.type === 'open') type = "Open";
    if (q.type === 'multiple_response') type = "Multiple response";

    const opts = q.options || ["", "", "", ""];
    
    // Ans expects 0-based index or exact text for answers usually, but simple text match is safest for generic CSV import
    const answer = Array.isArray(q.correctAnswer) ? q.correctAnswer.join('|') : q.correctAnswer;
    
    // Clean text for CSV (escape quotes AND strip HTML)
    const clean = (txt: string) => `"${(stripHtml(txt) || '').replace(/"/g, '""')}"`;

    return [
      type,
      clean(q.stem ? `[CONTEXT: ${q.stem}] ${q.question}` : q.question),
      q.score || 3,
      clean(answer),
      clean(opts[0]),
      clean(opts[1]),
      clean(opts[2]),
      clean(opts[3]),
      clean(q.explanation)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Ans_Import_${result.metadata.courseCode || 'Toets'}_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadCSV = (result: GeneratedExam) => {
  const headers = ["Title", "Question Type", "Question Text", "Option A", "Option B", "Option C", "Option D", "Correct Answer", "Feedback/Rubric", "Points"];
  const rows = result.questions.map(q => {
     const opts = q.options || ["", "", "", ""];
     const answer = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(';') : q.correctAnswer;
     
     // Handle structured rubric or legacy string array
     const feedback = q.type === 'open' && q.rubric 
        ? formatRubric(q.rubric)
        : stripHtml(q.explanation);
     
     const clean = (txt: string) => `"${(stripHtml(txt) || '').replace(/"/g, '""')}"`;

     return [
       clean(result.metadata.title),
       clean(q.type),
       clean(q.stem ? `[CONTEXT: ${q.stem}] ${q.question}` : q.question),
       clean(opts[0]),
       clean(opts[1]),
       clean(opts[2]),
       clean(opts[3]),
       clean(answer),
       clean(feedback),
       `"${q.score || 3}"`
     ].join(',');
  });
  
  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Toets_Export_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadBrightspaceGrades = (result: GeneratedExam) => {
  // D2L / Brightspace Standard Grade Import Format
  const gradeItemName = result.integrationInfo?.brightspace?.gradeItemName || "ToetsGrade";
  const points = result.integrationInfo?.brightspace?.points || 10;
  
  const headers = [
    "OrgDefinedId",
    "Username",
    `${gradeItemName} Points Grade <Numeric MaxPoints:${points}>`,
    "End-of-Line Indicator"
  ];

  const rows = [
    `#1234567,student1,,#`,
    `#7654321,student2,,#`,
    `#9999999,student3,,#`
  ];

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Brightspace_Grade_Import_${gradeItemName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadWord = (result: GeneratedExam, config: GeneratorConfig, isStudentVersion: boolean) => {
  
  // Four-Eyes Principle Cover Sheet (Only for Teacher Version)
  const coverSheet = !isStudentVersion ? `
    <div style="page-break-after: always; font-family: sans-serif;">
      <h1 style="color: #E3000B; border-bottom: 2px solid #E3000B; padding-bottom: 10px;">Toetsdossier & Kwaliteitsborging</h1>
      
      <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%; background: #f9f9f9;">Cursus</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${result.metadata.courseCode || 'Onbekend'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f9f9f9;">Toetsnaam</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${result.metadata.title}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f9f9f9;">Auteur</td>
          <td style="padding: 10px; border: 1px solid #ddd;">__________________________</td>
        </tr>
      </table>

      <h3 style="margin-top: 40px; color: #333;">Vier-ogen Verklaring (Peer Review)</h3>
      <p style="color: #666; font-size: 0.9em;">Conform het toetskader van de Radboud Universiteit dient elke summatieve toets door een gekwalificeerde collega gescreend te worden.</p>
      
      <div style="border: 2px solid #333; padding: 20px; margin-top: 20px; border-radius: 4px;">
        <p>Hierbij verklaar ik dat ik deze toets heb beoordeeld op:</p>
        <ul style="list-style-type: square; margin-bottom: 20px;">
          <li>Constructive alignment (Toetsmatrijs & Leerdoelen)</li>
          <li>Inhoudelijke correctheid van vragen en antwoordsleutel</li>
          <li>Taalgebruik en formulering (eenduidigheid)</li>
          <li>Cesuur en puntsverdeling</li>
        </ul>

        <table style="width: 100%; border-collapse: collapse;">
           <tr>
             <td style="padding-top: 20px; width: 50%;"><b>Naam Reviewer:</b><br/><br/>_______________________</td>
             <td style="padding-top: 20px; width: 50%;"><b>Handtekening:</b><br/><br/>_______________________</td>
           </tr>
           <tr>
             <td style="padding-top: 20px;"><b>Datum:</b><br/><br/>______ / ______ / 20____</td>
             <td></td>
           </tr>
        </table>
      </div>
    </div>
  ` : '';

  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${result.metadata.title}</title></head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      
      ${coverSheet}

      <h1 style="color: #E3000B;">${result.metadata.title}</h1>
      <p>Gegenereerd door De Toetsenmaker (Radboud Universiteit)</p>
      <p><b>Niveau:</b> ${config.difficulty}</p>
      <p><b>Doelgroep:</b> ${config.targetGroup || '-'}</p>
      ${isStudentVersion ? '<p><i>Studentversie</i></p>' : '<p><i>Docentversie (inclusief antwoorden en puntentelling)</i></p>'}
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
      
      ${result.questions.map((q, i) => `
        <div style="margin-bottom: 25px;">
          <h3 style="font-size: 1.1em; color: #1D1D1B;">Vraag ${i + 1} <span style="font-weight: normal; font-size: 0.8em; color: #666;">(${q.score || 3} punten)</span></h3>
          ${!isStudentVersion ? `<p style="font-size:0.85em; color:#E3000B; margin-top: -10px;">Cognitief niveau: ${q.cognitiveLevel || 'Onbekend'}</p>` : ''}
          
          ${q.stem ? `<div style="background:#f5f7fa; padding:10px; border-left: 3px solid #ccc; margin-bottom:10px; font-style:italic;">${q.stem}</div>` : ''}
          
          <div style="margin-bottom: 10px; font-weight: bold;">${q.question}</div>
          
          ${q.type !== 'open' ? `
          <ul style="list-style-type: none; padding-left: 0;">
            ${q.options?.map((opt, idx) => `
              <li style="margin-bottom: 8px; padding-left: 10px;">
                <span style="display:inline-block; width:20px; font-weight:bold;">${String.fromCharCode(65 + idx)}.</span> ${opt}
              </li>`).join('') || ''}
          </ul>
          ` : '<div style="height: 100px; border: 1px solid #ddd; background: #fafafa; margin-top: 10px;"></div>'}
          
          
          ${!isStudentVersion ? `
          <div style="background-color: #f0fdf4; padding: 15px; border: 1px solid #bbf7d0; border-radius: 4px; margin-top: 15px;">
            <div style="color: #166534; font-size: 0.9em; margin: 0;">
              <b>Correct antwoord:</b> ${Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}<br/><br/>
              <b>Toelichting:</b> ${q.explanation}
              ${q.rubric ? `<br/><br/><b>Beoordelingsmodel (3-punten schaal):</b><br/>
              <table style="width:100%; border-collapse: collapse; font-size: 0.9em; margin-top: 5px;">
                <tr style="background: #e0e0e0;"><th style="text-align:left; padding:4px;">Criterium</th><th style="padding:4px;">Excellent (3pt)</th></tr>
                ${q.rubric.map(r => {
                  if (typeof r === 'string') return `<tr><td colspan="2">${r}</td></tr>`;
                  return `<tr>
                    <td style="border-bottom:1px solid #ddd; padding:4px;">${r.criterion}</td>
                    <td style="border-bottom:1px solid #ddd; padding:4px;">${r.excellent}</td>
                  </tr>`;
              }).join('')}</table>` : ''}
            </div>
          </div>
          ` : ''}
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
      `).join('')}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', content], {
      type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Toets_${isStudentVersion ? 'STUDENT' : 'DOCENT'}_${new Date().toISOString().slice(0,10)}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadPPT = (result: GeneratedExam, config: GeneratorConfig, isStudentVersion: boolean) => {
  const pres = new PptxGenJS();
  
  // Title Slide
  let slide = pres.addSlide();
  slide.background = { color: "FFFFFF" }; 
  // Radboud Red Bar
  slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.2, fill: { color: "E3000B" } });

  slide.addText(result.metadata.title, { x: 1, y: 2, w: '80%', fontSize: 32, color: "000000", bold: true, align: "center", fontFace: "Arial" });
  slide.addText(`Niveau: ${config.difficulty}`, { x: 1, y: 3.5, w: '80%', fontSize: 18, color: "333333", align: "center", fontFace: "Arial" });
  if (isStudentVersion) {
    slide.addText("Studentversie", { x: 1, y: 4.2, w: '80%', fontSize: 14, color: "666666", align: "center", italic: true, fontFace: "Arial" });
  }

  // Questions
  result.questions.forEach((q, i) => {
    let qSlide = pres.addSlide();
    qSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: "E3000B" } });
    
    qSlide.addText(`Vraag ${i + 1} (${q.score || 3} pt)`, { x: 0.5, y: 0.5, w: '90%', fontSize: 14, color: "E3000B", bold: true, fontFace: "Arial" });
    
    let currentY = 1.0;
    
    // We strip HTML for PPT generation as simple pptxgenjs doesn't support full HTML
    if (q.stem) {
      qSlide.addText(stripHtml(q.stem), { x: 0.5, y: currentY, w: '90%', fontSize: 14, color: "666666", italic: true, fontFace: "Arial" });
      currentY += 1.2;
    }

    qSlide.addText(stripHtml(q.question), { x: 0.5, y: currentY, w: '90%', fontSize: 18, color: "000000", bold: true, fontFace: "Arial" });
    currentY += 1.2;

    if (q.options && q.options.length > 0) {
       q.options.forEach((opt, idx) => {
           qSlide.addText(`${String.fromCharCode(65 + idx)}. ${stripHtml(opt)}`, { x: 0.8, y: currentY, w: '85%', fontSize: 14, color: "333333", fontFace: "Arial" });
           currentY += 0.6;
       });
    } else {
       qSlide.addText("[Open Vraag]", { x: 0.8, y: currentY, fontSize: 14, color: "999999", italic: true, fontFace: "Arial" });
    }

    // Answer slide only if NOT student version
    if (!isStudentVersion) {
      let aSlide = pres.addSlide();
      aSlide.background = { color: "FAFAFA" };
      aSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: "E3000B" } });

      aSlide.addText(`Antwoord Vraag ${i + 1}`, { x: 0.5, y: 0.5, fontSize: 24, color: "1D1D1B", bold: true, fontFace: "Arial" });
      
      aSlide.addText("Correct antwoord:", { x: 0.5, y: 1.5, fontSize: 14, color: "666666", bold: true, fontFace: "Arial" });
      const ansText = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer;
      aSlide.addText(stripHtml(ansText), { x: 0.5, y: 2, w: '90%', fontSize: 16, color: "000000", fontFace: "Arial" });

      if (q.rubric) {
        aSlide.addText("Beoordelingsmodel (3pt schaal):", { x: 0.5, y: 3.0, fontSize: 14, color: "666666", bold: true, fontFace: "Arial" });
        let rY = 3.5;
        // Limit rubric items to fit slide
        q.rubric.slice(0, 4).forEach(r => {
           const text = typeof r === 'string' ? r : `${r.criterion}: ${r.excellent} (3pt)`;
           aSlide.addText(`• ${stripHtml(text)}`, { x: 0.5, y: rY, w: '90%', fontSize: 11, color: "333333", fontFace: "Arial" });
           rY += 0.4;
        });
      } else {
        aSlide.addText("Toelichting:", { x: 0.5, y: 3, fontSize: 14, color: "666666", bold: true, fontFace: "Arial" });
        aSlide.addText(stripHtml(q.explanation), { x: 0.5, y: 3.5, w: '90%', fontSize: 14, color: "333333", fontFace: "Arial" });
      }
    }
  });

  pres.writeFile({ fileName: `Toets_${isStudentVersion ? 'STUDENT' : 'DOCENT'}_${new Date().toISOString().slice(0,10)}.pptx` });
};