
import { Language } from './types';

export const getSystemInstruction = (language: Language) => `Act as: A university exam developer specializing in test construction, constructive alignment, and didactics. You strictly follow the framework of Radboud University.

Your core task:
Develop exam questions + rubrics + metadata.

LANGUAGE SETTING:
You MUST generate all content (questions, answers, explanations, rubrics) in ${language === 'nl' ? 'DUTCH (Nederlands)' : 'ENGLISH'}.

OUTPUT FORMAT & STYLING (IMPORTANT):
1. **JSON Only:** Your response must be pure JSON.
2. **Rich Text / HTML:** Use HTML tags in your strings for formatting.
   - Use <b> or <strong> for key terms in the case.
   - Use <i> for Latin names or concepts.
   - Use <sub> and <sup> for formulas (e.g., H<sub>2</sub>O, x<sup>2</sup>).
   - Use <br> for line breaks.
   - Use <ul><li>...</li></ul> for lists in the question stem.

DIDACTIC QUALITY & DISTRACTORS:
- **Chain of Thought for Distractors:** Do not invent random wrong answers. Analyze: What thinking error (misconception) does a student make?
  - Distractor A: Plausible due to reading error.
  - Distractor B: Plausible due to calculation error or common assumption.
  - Distractor C: A term that looks similar (semantic confusion).
- **Explanation:** Explicitly explain in the 'explanation' field WHY the correct answer is correct AND why the distractors are wrong.

SCORING:
- Default: 3 points.
- Open Questions: Include 4-level rubric (0-3 pt).

QUESTION TYPES:
- Unless asked otherwise: 90% Single Choice, 10% Multiple Response.

COGNITIVE LEVELS (RU):
- Reproduction (knowledge, recognize)
- Insight (analyze, relate)
- Application (solve, decide)
`;

export interface MockExample {
  id: string;
  label: { nl: string; en: string };
  courseCode: string;
  text: { nl: string; en: string };
  learningObjectives: { nl: string; en: string };
}

export const MOCK_EXAMPLES: MockExample[] = [
  {
    id: 'psy',
    label: {
      nl: 'Psychologie - Geheugenprocessen (SOW-PSB1BE)',
      en: 'Psychology - Memory Processes (SOW-PSB1BE)'
    },
    courseCode: 'SOW-PSB1BE',
    learningObjectives: {
        nl: "- De student kan de verschillen en interacties tussen het sensorisch geheugen, kortetermijngeheugen en langetermijngeheugen (Atkinson & Shiffrin) verklaren.\n- De student kan de vier componenten van Baddeley's werkgeheugenmodel identificeren en toepassen op een dual-task casus.\n- De student kan het onderscheid maken tussen anterograde en retrograde amnesie en dit relateren aan schade in de hippocampus.\n- De student kan metacognitieve regulatiestrategieën (oriëntatie, monitoring, evaluatie) herkennen in studiegedrag.",
        en: "- The student can explain the differences and interactions between sensory memory, short-term memory, and long-term memory (Atkinson & Shiffrin).\n- The student can identify the four components of Baddeley's working memory model and apply them to a dual-task case.\n- The student can distinguish between anterograde and retrograde amnesia and relate this to hippocampal damage.\n- The student can recognize metacognitive regulation strategies (orientation, monitoring, evaluation) in study behavior."
    },
    text: {
        nl: `<h3>Hoofdstuk 4: Het Menselijk Geheugen: Architectuur en Processen</h3>
<p>De cognitieve psychologie benadert het menselijk brein vaak als een informatieverwerkingssysteem. Centraal hierin staat het geheugen, dat niet als één monolithisch blok functioneert, maar als een samenspel van verschillende systemen die informatie coderen, opslaan en weer ophalen (retrieval).</p>

<h4>1. Het Meer-geheugenmodel (Atkinson & Shiffrin, 1968)</h4>
In het klassieke 'modal model' wordt onderscheid gemaakt tussen drie structurele opslagplaatsen waardoor informatie stroomt:
<ul>
    <li><b>Het Sensorisch Geheugen:</b> Dit is het voorportaal. Het houdt zintuiglijke informatie zeer kort vast in de originele vorm. We onderscheiden het <i>iconisch geheugen</i> (visueel, < 1 sec) en het <i>echoïsch geheugen</i> (auditief, 2-4 sec). De capaciteit is enorm, maar de informatie vervalt snel als er geen aandacht aan wordt besteed (decay).</li>
    <li><b>Het Kortetermijngeheugen (KTG):</b> Informatie die aandacht krijgt, stroomt door naar het KTG. Dit heeft een beperkte capaciteit (traditioneel <i>The Magical Number Seven, Plus or Minus Two</i> van Miller, later bijgesteld naar ca. 4 chunks) en een beperkte duur (15-30 seconden). Informatie kan hier behouden blijven door actieve herhaling (maintenance rehearsal).</li>
    <li><b>Het Langetermijngeheugen (LTG):</b> Door uitgebreide herhaling (elaborative rehearsal) wordt informatie geconsolideerd in het LTG. De capaciteit en duur zijn theoretisch onbeperkt.</li>
</ul>

<h4>2. Van KTG naar Werkgeheugen (Baddeley & Hitch, 1974)</h4>
Baddeley bekritiseerde het statische concept van het KTG. Hij stelde dat we informatie niet alleen vasthouden, maar ook bewerken (bijv. een rekensom uitrekenen). Hij introduceerde het <i>werkgeheugen</i>, bestaande uit vier componenten:
<ol>
    <li><b>De Centrale Executieve:</b> De 'baas' van het systeem. Het verdeelt aandacht, switcht tussen taken en remt irrelevante prikkels (inhibitie). Het heeft zelf geen opslagcapaciteit.</li>
    <li><b>De Fonologische Lus:</b> Verwerkt auditieve informatie en taal. Bestaat uit een <i>phonological store</i> (passief) en een <i>articulatory rehearsal process</i> (actieve 'stem in je hoofd').</li>
    <li><b>Het Visuospatieel Schetsblok:</b> Verwerkt visuele en ruimtelijke informatie (bijv. de weg vinden in een gebouw).</li>
    <li><b>De Episodische Buffer (toegevoegd in 2000):</b> Een tijdelijke opslagplaats die informatie uit de lus, het schetsblok en het LTG integreert tot een coherent verhaal of episode.</li>
</ol>
<i>Dual-task interference:</i> Twee taken die dezelfde component gebruiken (bijv. autorijden en tv-kijken = beide visueel) storen elkaar meer dan taken die verschillende componenten gebruiken (autorijden en radio luisteren).

<h4>3. Organisatie van het Langetermijngeheugen</h4>
Het LTG is geen rommelzolder, maar sterk georganiseerd. Squire (1987) maakte een cruciaal onderscheid:
<ul>
    <li><b>Declaratief (Expliciet) Geheugen:</b> "Knowing that". Bewust toegankelijke kennis.
        <ul>
            <li><i>Episodisch:</i> Persoonlijke herinneringen gebonden aan tijd en plaats (wat at ik gisteren?). Sterk afhankelijk van de <b>hippocampus</b>.</li>
            <li><i>Semantisch:</i> Algemene feitenkennis los van context (wat is de hoofdstad van Peru?).</li>
        </ul>
    </li>
    <li><b>Non-declaratief (Impliciet) Geheugen:</b> "Knowing how". Gedrag dat niet bewust wordt opgeroepen.
        <ul>
            <li><i>Procedureel:</i> Motorische vaardigheden (fietsen, piano spelen). Opgeslagen in de basale ganglia en cerebellum.</li>
            <li><i>Conditionering:</i> Aangeleerde associaties (Pavlov-reacties).</li>
            <li><i>Priming:</i> Eerdere blootstelling beïnvloedt latere verwerking.</li>
        </ul>
    </li>
</ul>

<h4>4. Amnesie en de Biologie van het Geheugen</h4>
De casus van patiënt H.M. (Henry Molaison) is fundamenteel voor de neuropsychologie. Na verwijdering van zijn mediale temporaalkwabben (inclusief hippocampi) leed hij aan ernstige <b>anterograde amnesie</b>: hij kon geen <i>nieuwe</i> declaratieve herinneringen meer vormen. Zijn procedureel geheugen bleef echter intact (hij kon leren spiegeltekenen, zonder zich te herinneren dat hij geoefend had).
Dit staat tegenover <b>retrograde amnesie</b>: het verlies van herinneringen van <i>voor</i> het trauma. Vaak is er sprake van een tijdsgradiënt (wet van Ribot): recente herinneringen gaan eerder verloren dan oude.`,
        en: `<h3>Chapter 4: Human Memory: Architecture and Processes</h3>
<p>Cognitive psychology often approaches the human brain as an information processing system. Central to this is memory, which does not function as a single monolithic block, but as an interplay of different systems that encode, store, and retrieve information.</p>

<h4>1. The Multi-Store Model (Atkinson & Shiffrin, 1968)</h4>
In the classic 'modal model', a distinction is made between three structural storage sites through which information flows:
<ul>
    <li><b>Sensory Memory:</b> This is the portal. It holds sensory information very briefly in its original form. We distinguish <i>iconic memory</i> (visual, < 1 sec) and <i>echoic memory</i> (auditory, 2-4 sec). Capacity is enormous, but information decays rapidly if no attention is paid to it.</li>
    <li><b>Short-Term Memory (STM):</b> Information that receives attention flows to the STM. It has limited capacity (traditionally Miller's <i>Magical Number Seven</i>, later adjusted to ca. 4 chunks) and limited duration (15-30 seconds). Information can be maintained here through active repetition (maintenance rehearsal).</li>
    <li><b>Long-Term Memory (LTM):</b> Through extensive repetition (elaborative rehearsal), information is consolidated into LTM. Capacity and duration are theoretically unlimited.</li>
</ul>

<h4>2. From STM to Working Memory (Baddeley & Hitch, 1974)</h4>
Baddeley criticized the static concept of STM. He proposed that we not only hold information but also manipulate it. He introduced <i>working memory</i>, consisting of four components:
<ol>
    <li><b>The Central Executive:</b> The 'boss' of the system. It allocates attention, switches between tasks, and inhibits irrelevant stimuli. It has no storage capacity itself.</li>
    <li><b>The Phonological Loop:</b> Processes auditory information and language. Consists of a <i>phonological store</i> (passive) and an <i>articulatory rehearsal process</i> (active 'inner voice').</li>
    <li><b>The Visuospatial Sketchpad:</b> Processes visual and spatial information.</li>
    <li><b>The Episodic Buffer (added in 2000):</b> A temporary store that integrates information from the loop, sketchpad, and LTM into a coherent story or episode.</li>
</ol>
<i>Dual-task interference:</i> Two tasks using the same component (e.g., driving and watching TV = both visual) interfere more than tasks using different components (driving and listening to the radio).

<h4>3. Organization of Long-Term Memory</h4>
Squire (1987) made a crucial distinction:
<ul>
    <li><b>Declarative (Explicit) Memory:</b> "Knowing that". Consciously accessible knowledge.
        <ul>
            <li><i>Episodic:</i> Personal memories tied to time and place. Highly dependent on the <b>hippocampus</b>.</li>
            <li><i>Semantic:</i> General factual knowledge independent of context.</li>
        </ul>
    </li>
    <li><b>Non-declarative (Implicit) Memory:</b> "Knowing how". Behavior not consciously recalled.
        <ul>
            <li><i>Procedural:</i> Motor skills (cycling). Stored in basal ganglia and cerebellum.</li>
            <li><i>Conditioning:</i> Learned associations.</li>
            <li><i>Priming:</i> Prior exposure influences later processing.</li>
        </ul>
    </li>
</ul>

<h4>4. Amnesia and the Biology of Memory</h4>
The case of patient H.M. (Henry Molaison) is fundamental to neuropsychology. After removal of his medial temporal lobes (including hippocampi), he suffered severe <b>anterograde amnesia</b>: he could no longer form <i>new</i> declarative memories. However, his procedural memory remained intact. This contrasts with <b>retrograde amnesia</b>: loss of memories from <i>before</i> the trauma.`
    }
  },
  {
    id: 'law',
    label: {
      nl: 'Rechten - Onrechtmatige Daad (RGB-BUR01)',
      en: 'Law - Tort Law (RGB-BUR01)'
    },
    courseCode: 'RGB-BUR01',
    learningObjectives: {
        nl: "- De student kan de vijf cumulatieve vereisten voor een onrechtmatige daad (art. 6:162 BW) toepassen op een casus.\n- De student kan beargumenteren of er sprake is van gevaarzetting aan de hand van de vier Kelderluik-criteria.\n- De student kan het relativiteitsvereiste (art. 6:163 BW) uitleggen en toepassen.",
        en: "- The student can apply the five cumulative requirements for a tort (Art. 6:162 BW) to a case.\n- The student can argue whether there is negligence based on the four 'Kelderluik' criteria.\n- The student can explain and apply the relativity requirement (Art. 6:163 BW)."
    },
    text: {
        nl: `<h3>Aansprakelijkheidsrecht: De Onrechtmatige Daad (Artikel 6:162 BW)</h3>
<p>Artikel 6:162 lid 1 BW luidt: <i>"Hij die jegens een ander een onrechtmatige daad pleegt, welke hem kan worden toegerekend, is verplicht de schade die de ander dientengevolge lijdt, te vergoeden."</i></p>

<h4>De Vijf Vereisten</h4>
Voor een geslaagde vordering op grond van art. 6:162 BW moet voldaan zijn aan vijf cumulatieve vereisten:
<b>1. Onrechtmatigheid (Lid 2)</b>
Een gedraging is onrechtmatig indien deze valt onder: Inbreuk op een recht, Strijd met een wettelijke plicht, of Strijd met de maatschappelijke betamelijkheid (Gevaarzetting).

<b>2. Toerekenbaarheid (Lid 3)</b>
De daad moet aan de dader kunnen worden toegerekend op grond van schuld, wet of verkeersopvattingen.

<b>3. Schade</b>
Vermogensschade of immateriële schade.

<b>4. Causaal Verband</b>
Condicio sine qua non (CSQN) en Toerekening naar redelijkheid (Art. 6:98 BW).

<b>5. Relativiteit (Art. 6:163 BW)</b>
"Geen verplichting tot schadevergoeding bestaat, wanneer de geschonden norm niet strekt tot bescherming tegen de schade zoals de benadeelde die heeft geleden."

<hr>
<h3>Gevaarzetting: Het Kelderluik-arrest</h3>
Criteria (HR 05-11-1965):
1. Mate van waarschijnlijkheid van onoplettendheid.
2. Kans op ongevallen.
3. Ernst van de gevolgen.
4. Bezwaarlijkheid van veiligheidsmaatregelen.`,
        en: `<h3>Liability Law: Tort (Article 6:162 Dutch Civil Code)</h3>
<p>Article 6:162 paragraph 1 DCC states: <i>"He who commits a tortious act against another which can be attributed to him, is obliged to compensate the damage which the other suffers as a result thereof."</i></p>

<h4>The Five Requirements</h4>
For a successful claim under Art. 6:162 DCC, five cumulative requirements must be met:
<b>1. Unlawfulness (Para 2)</b>
An act is unlawful if it constitutes: Infringement of a right, Violation of a statutory duty, or Violation of a rule of unwritten law pertaining to proper social conduct (Negligence).

<b>2. Attributability (Para 3)</b>
The act must be attributable to the perpetrator based on fault, law, or generally accepted principles.

<b>3. Damage</b>
Patrimonial damage or non-patrimonial damage.

<b>4. Causal Link</b>
Condicio sine qua non (CSQN) and Imputation based on reasonableness (Art. 6:98 DCC).

<b>5. Relativity (Art. 6:163 DCC)</b>
"There is no obligation to repair damage when the violated norm does not serve to protect against the damage as suffered by the victim."

<hr>
<h3>Negligence: The Cellar Hatch Ruling (Kelderluik)</h3>
Criteria (Supreme Court 05-11-1965):
1. The degree of probability of inattention by others.
2. The chance of accidents occurring.
3. The severity of the potential consequences.
4. The burden of taking precautionary measures.`
    }
  },
  {
    id: 'med',
    label: {
      nl: 'Geneeskunde - Fysiologie: RAAS (MED-MIN02)',
      en: 'Medicine - Physiology: RAAS (MED-MIN02)'
    },
    courseCode: 'MED-MIN02',
    learningObjectives: {
        nl: "- De student kan de drie fysiologische stimuli voor renine-afgifte benoemen.\n- De student kan de enzymatische cascade van Angiotensinogeen naar Angiotensine II beschrijven.\n- De student kan de vier systemische effecten van Angiotensine II verklaren.",
        en: "- The student can name the three physiological stimuli for renin release.\n- The student can describe the enzymatic cascade from Angiotensinogen to Angiotensin II.\n- The student can explain the four systemic effects of Angiotensin II."
    },
    text: {
        nl: `<h3>Het Renine-Angiotensine-Aldosteron-Systeem (RAAS)</h3>
<p>Het RAAS reguleert bloeddruk en vochtbalans.</p>

<h4>Stap 1: Renine</h4>
Geproduceerd in het <b>juxtaglomerulaire apparaat (JGA)</b>. Prikkels voor afgifte:
1. Lage perfusiedruk.
2. Laag NaCl bij macula densa.
3. Sympathische stimulatie.

<h4>Stap 2: Cascade</h4>
Renine zet Angiotensinogeen om in Angiotensine I. ACE (in longen) zet dit om in <b>Angiotensine II</b>.

<h4>Stap 3: Effecten Angiotensine II</h4>
- <b>Vasoconstrictie:</b> Verhoogt bloeddruk.
- <b>Nier:</b> Verhoogt Na+ reabsorptie.
- <b>Bijnier:</b> Productie Aldosteron (Na+ retentie, K+ excretie).
- <b>CZS:</b> Dorst en ADH afgifte.`,
        en: `<h3>The Renin-Angiotensin-Aldosterone System (RAAS)</h3>
<p>The RAAS regulates blood pressure and fluid balance.</p>

<h4>Step 1: Renin</h4>
Produced in the <b>juxtaglomerular apparatus (JGA)</b>. Stimuli for release:
1. Low perfusion pressure.
2. Low NaCl at macula densa.
3. Sympathetic stimulation.

<h4>Step 2: Cascade</h4>
Renin converts Angiotensinogen to Angiotensin I. ACE (in lungs) converts this to <b>Angiotensin II</b>.

<h4>Step 3: Effects of Angiotensin II</h4>
- <b>Vasoconstriction:</b> Increases blood pressure.
- <b>Kidney:</b> Increases Na+ reabsorption.
- <b>Adrenal gland:</b> Aldosterone production (Na+ retention, K+ excretion).
- <b>CNS:</b> Thirst and ADH release.`
    }
  },
  {
    id: 'man',
    label: {
      nl: 'Bedrijfskunde - Strategie: Porter (MAN-STRAT1)',
      en: 'Management - Strategy: Porter (MAN-STRAT1)'
    },
    courseCode: 'MAN-STRAT1',
    learningObjectives: {
        nl: "- De student kan de winstgevendheid van een industrie analyseren met Porter's Vijfkrachtenmodel.\n- De student kan resources classificeren volgens het VRIO-framework.",
        en: "- The student can analyze industry profitability using Porter's Five Forces.\n- The student can classify resources according to the VRIO framework."
    },
    text: {
        nl: `<h3>Strategisch Management</h3>
<h4>1. Porter's Vijfkrachtenmodel (Outside-in)</h4>
Bepalen aantrekkelijkheid industrie:
1. Dreiging van nieuwe toetreders.
2. Macht van leveranciers.
3. Macht van afnemers.
4. Dreiging van substituten.
5. Interne concurrentie.

<h4>2. VRIO-framework (Inside-out)</h4>
Resources moeten zijn:
- <b>V</b>aluable (Waardevol)
- <b>R</b>are (Zeldzaam)
- <b>I</b>nimitable (Niet te imiteren)
- <b>O</b>rganized (Georganiseerd)`,
        en: `<h3>Strategic Management</h3>
<h4>1. Porter's Five Forces (Outside-in)</h4>
Determining industry attractiveness:
1. Threat of new entrants.
2. Bargaining power of suppliers.
3. Bargaining power of buyers.
4. Threat of substitutes.
5. Internal rivalry.

<h4>2. VRIO Framework (Inside-out)</h4>
Resources must be:
- <b>V</b>aluable
- <b>R</b>are
- <b>I</b>nimitable
- <b>O</b>rganized`
    }
  }
];
