

import React, { useState } from 'react';
import { Mail, Shield, HelpCircle, CheckCircle2, Layout, FileText, Database, Brain, Activity, AlertTriangle, Cpu, BookOpen, Download, ChevronDown, ChevronUp, Upload, Settings, Wand2, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  const isDutch = language === 'nl';

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{isDutch ? 'Over de Toetsenmaker' : 'About the Exam Maker'}</h1>
        <p className="text-xl text-gray-600 font-light">{isDutch ? 'Innovatie in academische toetsconstructie' : 'Innovation in academic test construction'}</p>
        <div className="w-24 h-1.5 bg-primary mx-auto mt-6"></div>
      </div>

      {/* Vision Section */}
      <div className="ru-card p-8 mb-10 border-l-4 border-primary">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{isDutch ? 'Van Tijdsdruk naar Kwaliteit' : 'From Time Pressure to Quality'}</h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
          <p>
            {isDutch 
             ? "Het ontwikkelen van kwalitatief hoogwaardige toetsvragen is een van de meest tijdrovende taken van een docent. Vaak gaat veel tijd zitten in het formuleren van plausibele afleiders, het controleren van taalfouten en het formatteren voor verschillende systemen."
             : "Developing high-quality exam questions is one of the most time-consuming tasks for a teacher. Often, much time is spent formulating plausible distractors, checking for language errors, and formatting for different systems."}
          </p>
          <p>
            {isDutch
             ? "De Radboud Toetsenmaker is ontwikkeld om dit proces om te draaien. Door gebruik te maken van geavanceerde Artificial Intelligence, neemt de tool het 'grunt work' uit handen. Dit is niet alleen een efficiencyslag, maar vooral een didactisch leerinstrument."
             : "The Radboud Exam Maker is designed to reverse this process. By utilizing advanced Artificial Intelligence, the tool takes care of the 'grunt work'. This is not only an efficiency gain but primarily a didactic learning instrument."}
          </p>
          <div className="bg-primary/5 p-4 rounded-r border-l-2 border-primary mt-4">
            <p className="italic font-medium text-gray-800 m-0">
              {isDutch 
               ? "\"Het doel is niet automatisering, maar augmentatie. De tool fungeert als een kritische sparringpartner die suggesties doet voor misconcepties, feedback en rubrics.\""
               : "\"The goal is not automation, but augmentation. The tool acts as a critical sparring partner suggesting misconceptions, feedback, and rubrics.\""}
            </p>
          </div>
        </div>
      </div>

      {/* Features & Integrations Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        
        {/* Features */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-primary" size={24} /> {isDutch ? 'Functionaliteiten' : 'Features'}
          </h3>
          <div className="ru-card p-6 h-full">
            <ul className="space-y-3">
              {[
                isDutch ? "Directe export naar ANS (CSV) en Brightspace" : "Direct export to ANS (CSV) and Brightspace",
                isDutch ? "Automatische generatie van Rubrics voor open vragen" : "Automatic generation of Rubrics for open questions",
                isDutch ? "Ondersteuning voor het Vier-ogen principe" : "Support for the Four-eyes principle",
                isDutch ? "Koppeling aan Bloom's Taxonomie" : "Alignment with Bloom's Taxonomy",
                isDutch ? "Cesuur-advies op basis van gokkansberekening" : "Cut-off score advice based on guessing probability",
                isDutch ? "Student- vs. Docentversies genereren" : "Generate Student vs. Teacher versions",
                isDutch ? "Beveiligd en AVG-proof" : "Secure and GDPR-proof"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green-600 mt-1 shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Integration */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="text-primary" size={24} /> {isDutch ? 'Systeemintegratie' : 'System Integration'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <IntegrationCard 
              title="ANS Delft" 
              subtitle={isDutch ? "Summatieve Toetsing" : "Summative Assessment"} 
              icon={<Layout size={20} />} 
            />
            <IntegrationCard 
              title="Brightspace" 
              subtitle="LMS & Quiz" 
              icon={<Brain size={20} />} 
            />
            <IntegrationCard 
              title="Osiris" 
              subtitle={isDutch ? "Cijferregistratie" : "Grade Registration"} 
              icon={<Database size={20} />} 
            />
            <IntegrationCard 
              title="PDF Dossier" 
              subtitle={isDutch ? "Accreditatie" : "Accreditation"} 
              icon={<FileText size={20} />} 
            />
          </div>
        </div>
      </div>

      {/* The Makers Section */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{isDutch ? 'De Makers' : 'The Makers'}</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <ProfileCard 
            imageSrc="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&auto=format&fit=crop"
            name="dr. Lauke Bisschops"
            role={isDutch ? "Initiatiefnemer" : "Initiator"}
            description={isDutch 
              ? "Specialist ouderengeneeskunde en expeditiearts. Gedreven door een passie voor medisch onderwijs en innovatie in de zorgpraktijk."
              : "Geriatric specialist and expedition doctor. Driven by a passion for medical education and innovation in healthcare practice."}
          />
          <ProfileCard 
            imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop"
            name="dr. Mattheis van Leeuwen"
            role={isDutch ? "Didactiek & Gedrag" : "Didactics & Behavior"}
            description={isDutch 
              ? "Gedragswetenschapper en docent psychologie. Expert in learning analytics en de psychologie achter toetsing en motivatie."
              : "Behavioral scientist and psychology lecturer. Expert in learning analytics and the psychology behind testing and motivation."}
          />
          <ProfileCard 
            imageSrc="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop"
            name="dr. Jonathan van Leeuwen"
            role="AI & Technologie"
            description={isDutch 
              ? "Neuropsycholoog en AI/Machine Learning Expert. Verantwoordelijk voor de technische architectuur en de implementatie van LLM's."
              : "Neuropsychologist and AI/Machine Learning Expert. Responsible for technical architecture and LLM implementation."}
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components for AboutPage
const IntegrationCard: React.FC<{title: string, subtitle: string, icon: React.ReactNode}> = ({ title, subtitle, icon }) => (
  <div className="bg-white border border-gray-200 p-4 rounded shadow-sm flex items-center gap-3 hover:border-primary/50 transition-colors">
    <div className="bg-gray-100 p-2 rounded text-gray-600">
      {icon}
    </div>
    <div>
      <div className="font-bold text-gray-900">{title}</div>
      <div className="text-xs text-gray-500 uppercase font-semibold">{subtitle}</div>
    </div>
  </div>
);

const ProfileCard: React.FC<{imageSrc: string, name: string, role: string, description: string}> = ({ imageSrc, name, role, description }) => (
  <div className="ru-card p-6 flex flex-col items-center text-center h-full hover:shadow-lg transition-shadow duration-300">
    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-md ring-4 ring-gray-50 group">
       <img 
         src={imageSrc} 
         alt={name} 
         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
       />
    </div>
    <h3 className="text-lg font-bold text-gray-900">{name}</h3>
    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4 mt-1">
      {role}
    </span>
    <p className="text-sm text-gray-600 leading-relaxed">
      {description}
    </p>
  </div>
);

const ManualAccordion: React.FC = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      title: t.manual.step1_title,
      desc: t.manual.step1_desc,
      tip: t.manual.step1_tip,
      icon: <Upload size={20} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      title: t.manual.step2_title,
      desc: t.manual.step2_desc,
      tip: t.manual.step2_tip,
      icon: <Settings size={20} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 3,
      title: t.manual.step3_title,
      desc: t.manual.step3_desc,
      tip: t.manual.step3_tip,
      icon: <Wand2 size={20} />,
      color: 'text-primary',
      bgColor: 'bg-red-50'
    },
    {
      id: 4,
      title: t.manual.step4_title,
      desc: t.manual.step4_desc,
      tip: t.manual.step4_tip,
      icon: <Search size={20} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 5,
      title: t.manual.step5_title,
      desc: t.manual.step5_desc,
      tip: t.manual.step5_tip,
      icon: <Download size={20} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-4 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t.manual.title}</h2>
        <p className="text-gray-500">{t.manual.subtitle}</p>
      </div>

      <div className="grid gap-3 max-w-3xl mx-auto">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <div 
              key={step.id} 
              className={`border rounded-lg transition-all duration-300 overflow-hidden ${isActive ? 'bg-white border-gray-300 shadow-md ring-1 ring-gray-100' : 'bg-gray-50 border-gray-200 hover:bg-white'}`}
            >
              <button 
                onClick={() => setActiveStep(step.id)}
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${isActive ? 'bg-primary text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                    {step.id}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{step.title}</h3>
                  </div>
                </div>
                {isActive ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-300" />}
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                 <div className="p-4 pt-0 pl-[4.5rem] pr-8 pb-6">
                    <p className="text-gray-700 mb-4 leading-relaxed flex gap-3 items-start">
                       <span className={`mt-0.5 shrink-0 ${step.color}`}>{step.icon}</span>
                       {step.desc}
                    </p>
                    {step.tip && (
                      <div className={`text-sm p-3 rounded-r border-l-4 border-yellow-400 bg-yellow-50 text-yellow-900 italic`}>
                        <strong>Tip:</strong> {step.tip}
                      </div>
                    )}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const { language } = useLanguage();
  const isDutch = language === 'nl';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Interactive Manual Section */}
      <ManualAccordion />

      <div className="border-t border-gray-200 my-10"></div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{isDutch ? 'Veelgestelde Vragen' : 'Frequently Asked Questions'}</h1>
        <div className="w-16 h-1 bg-primary mx-auto mt-6"></div>
      </div>
      
      <div className="space-y-12">
        
        {/* Section 1: Usage */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
            <Cpu size={22} className="text-primary" /> {isDutch ? 'Werking & Gebruik' : 'Operation & Usage'}
          </h2>
          <div className="space-y-4">
             <FaqItem 
              question={isDutch ? "Hoe werkt de Toetsenmaker precies?" : "How exactly does the Exam Maker work?"}
              answer={isDutch 
                ? "U uploadt lesmateriaal (PDF/Word) of plakt tekst. Het systeem analyseert de inhoud en gebruikt een gespecialiseerd AI-model (Gemini) om vragen te genereren die voldoen aan de door u opgegeven leerdoelen en Bloom-niveau's."
                : "You upload course material (PDF/Word) or paste text. The system analyzes the content and uses a specialized AI model (Gemini) to generate questions that meet your specified learning objectives and Bloom levels."}
            />
             <FaqItem 
              question={isDutch ? "Welke bestanden kan ik uploaden?" : "Which files can I upload?"}
              answer={isDutch 
                ? "De tool ondersteunt PDF, Microsoft Word (.docx), PowerPoint (.pptx) en tekstbestanden (.txt). Zorg dat de tekst in PDF's selecteerbaar is (geen gescande afbeeldingen)."
                : "The tool supports PDF, Microsoft Word (.docx), PowerPoint (.pptx), and text files (.txt). Ensure text in PDFs is selectable (no scanned images)."}
            />
            <FaqItem 
              question={isDutch ? "Kan ik de vragen achteraf nog aanpassen?" : "Can I edit the questions afterwards?"}
              answer={isDutch 
                ? "Ja. Elke vraag heeft een 'Edit' knop. U kunt de vraagstam, de opties, het antwoord en de toelichting volledig handmatig wijzigen. U kunt de AI ook vragen een specifieke vraag te herschrijven (bijv. 'maak moeilijker')."
                : "Yes. Each question has an 'Edit' button. You can manually modify the stem, options, answer, and explanation. You can also ask the AI to rewrite a specific question (e.g., 'make harder')."}
            />
          </div>
        </div>

        {/* Section 2: Privacy */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
            <Shield size={22} className="text-primary" /> {isDutch ? 'Privacy & Veiligheid' : 'Privacy & Security'}
          </h2>
          <div className="space-y-4">
            <FaqItem 
              question={isDutch ? "Wat gebeurt er met mijn geüploade bestanden?" : "What happens to my uploaded files?"}
              answer={isDutch 
                ? "Niets. Bestanden worden 'in-memory' verwerkt en direct na analyse verwijderd. Er vindt geen permanente opslag plaats op onze servers."
                : "Nothing. Files are processed in-memory and deleted immediately after analysis. No permanent storage takes place on our servers."}
            />
            <FaqItem 
              question={isDutch ? "Mag ik documenten met studentgegevens uploaden?" : "Can I upload documents with student data?"}
              answer={isDutch 
                ? "Nee. Deze tool is uitsluitend bedoeld voor lesmateriaal en antwoordmodellen. Upload nooit bestanden met persoonsgegevens van studenten."
                : "No. This tool is exclusively for educational material and answer keys. Never upload files containing student personal data."}
              warning
            />
          </div>
        </div>

        {/* Section 3: Didactics */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
            <BookOpen size={22} className="text-primary" /> {isDutch ? 'Didactiek & Kwaliteit' : 'Didactics & Quality'}
          </h2>
          <div className="space-y-4">
             <FaqItem 
              question={isDutch ? "Zijn de vragen foutloos?" : "Are the questions error-free?"}
              answer={isDutch 
                ? "Niet gegarandeerd. AI is een hulpmiddel, geen vervanging voor de expert. De tool fungeert als 'sparringpartner'. U dient als docent altijd de inhoudelijke juistheid te verifiëren (het vier-ogen principe)."
                : "Not guaranteed. AI is a tool, not a replacement for the expert. The tool acts as a 'sparring partner'. As a teacher, you must always verify the content accuracy (the four-eyes principle)."}
            />
            <FaqItem 
              question={isDutch ? "Hoe bepaalt de tool het cognitieve niveau (Bloom)?" : "How does the tool determine the cognitive level (Bloom)?"}
              answer={isDutch 
                ? "Op basis van de gebruikte werkwoorden en de complexiteit van de vraagstelling. 'Noem op' wordt geclassificeerd als Reproductie, terwijl 'Analyseer' of 'Bereken' als Inzicht of Toepassing wordt gezien."
                : "Based on the verbs used and the complexity of the question phrasing. 'List' is classified as Reproduction, while 'Analyze' or 'Calculate' is seen as Insight or Application."}
            />
          </div>
        </div>

        {/* Section 4: Technical */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
            <Download size={22} className="text-primary" /> {isDutch ? 'Export & Techniek' : 'Export & Tech'}
          </h2>
          <div className="space-y-4">
             <FaqItem 
              question={isDutch ? "Hoe importeer ik vragen in Brightspace of Ans?" : "How do I import questions into Brightspace or Ans?"}
              answer={isDutch 
                ? "Gebruik de exportknoppen onderaan de resultatenpagina. Voor Ans is er een specifieke CSV-indeling beschikbaar die direct geïmporteerd kan worden."
                : "Use the export buttons at the bottom of the results page. For Ans, a specific CSV format is available that can be imported directly."}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

const FaqItem: React.FC<{question: string, answer: string, warning?: boolean}> = ({ question, answer, warning }) => (
  <div className={`ru-card p-6 ${warning ? 'border-l-4 border-orange-500 bg-orange-50/30' : ''}`}>
    <h3 className={`text-base font-bold text-gray-900 mb-2 flex items-start gap-2 ${warning ? 'text-orange-900' : ''}`}>
      {warning ? <AlertTriangle size={18} className="mt-1 text-orange-600 shrink-0"/> : <HelpCircle size={18} className="mt-1 text-primary shrink-0"/>}
      {question}
    </h3>
    <p className="text-gray-700 text-sm leading-relaxed pl-7">
      {answer}
    </p>
  </div>
);

export const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const isDutch = language === 'nl';

  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-center">
       <div className="ru-card p-10 shadow-sm">
          <Mail size={48} className="mx-auto text-gray-400 mb-6" />
          <h1 className="text-2xl font-bold mb-4 text-gray-900">{isDutch ? 'Contact Onderwijsondersteuning' : 'Contact Educational Support'}</h1>
          <p className="text-gray-600 mb-8">
            {isDutch 
             ? "Heeft u inhoudelijke vragen over toetsconstructie of technische vragen over deze tool?"
             : "Do you have questions about test construction or technical questions about this tool?"}
          </p>
          <a href="mailto:toetsing@ru.nl" className="inline-block bg-primary text-white px-8 py-3 rounded font-bold hover:bg-primary-hover transition-colors">
            {isDutch ? 'Neem contact op' : 'Contact us'}
          </a>
       </div>
    </div>
  );
};