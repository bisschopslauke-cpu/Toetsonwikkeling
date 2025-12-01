

import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Subscript, Superscript, Code, RotateCcw, Wand2, Loader2, Sparkles } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onAiAssist?: (text: string, action: string) => Promise<string>;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  onAiAssist,
  placeholder, 
  className = "",
  minHeight = "100px"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const aiMenuRef = useRef<HTMLDivElement>(null);

  // Sync external value to internal div only if drastically different to avoid cursor jumps
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Only update if the editor is not focused, or if the value is empty (reset)
      if (!isFocused || value === '') {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value, isFocused]);

  // Handle click outside AI menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aiMenuRef.current && !aiMenuRef.current.contains(event.target as Node)) {
        setShowAiMenu(false);
      }
    };
    if (showAiMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAiMenu]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput(); // Trigger update
    }
  };

  const handleAiAction = async (action: string) => {
    if (!onAiAssist || !editorRef.current) return;
    
    const currentText = editorRef.current.innerText;
    if (!currentText || currentText.trim().length === 0) return;

    setShowAiMenu(false);
    setIsAiLoading(true);
    
    try {
      const newText = await onAiAssist(currentText, action);
      if (newText) {
        onChange(newText);
        // Force update innerHTML immediately
        editorRef.current.innerHTML = newText;
      }
    } catch (e) {
      console.error("AI Assist failed", e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const ToolbarButton = ({ icon: Icon, cmd, arg, title, onClick, isActive }: any) => (
    <button
      type="button"
      onMouseDown={(e) => {
        if (!onClick) {
          e.preventDefault(); 
          execCommand(cmd, arg);
        }
      }}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary hover:bg-gray-100'}`}
      title={title}
    >
      <Icon size={14} strokeWidth={2.5} />
    </button>
  );

  return (
    <div className={`border rounded bg-white transition-colors relative ${isFocused ? 'border-primary ring-1 ring-primary' : 'border-gray-300'} ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1.5 border-b border-gray-100 bg-gray-50 rounded-t">
        <ToolbarButton icon={Bold} cmd="bold" title="Vetgedrukt" />
        <ToolbarButton icon={Italic} cmd="italic" title="Cursief" />
        <ToolbarButton icon={Underline} cmd="underline" title="Onderstreept" />
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <ToolbarButton icon={Subscript} cmd="subscript" title="Subscript (H₂O)" />
        <ToolbarButton icon={Superscript} cmd="superscript" title="Superscript (x²)" />
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <ToolbarButton icon={List} cmd="insertUnorderedList" title="Opsomming" />
        <ToolbarButton icon={ListOrdered} cmd="insertOrderedList" title="Genummerde lijst" />
        
        {/* Magic Wand Section */}
        {onAiAssist && (
          <>
             <div className="w-px h-4 bg-gray-300 mx-1" />
             <div className="relative" ref={aiMenuRef}>
               <ToolbarButton 
                  icon={isAiLoading ? Loader2 : Wand2} 
                  title="AI Assistent" 
                  onClick={() => setShowAiMenu(!showAiMenu)}
                  isActive={showAiMenu}
                />
                {isAiLoading && <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-ping"></span>}
                
                {showAiMenu && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded shadow-xl border border-gray-200 z-20 py-1 text-left animate-in fade-in zoom-in-95 duration-100">
                     <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1 flex items-center gap-1">
                       <Sparkles size={10} /> AI Bewerking
                     </div>
                     {[
                       { label: 'Korter & Bondiger', action: 'Maak de tekst korter en bondiger, maar behoud de kern.' },
                       { label: 'Formeler / Academisch', action: 'Herschrijf de tekst in een formele, academische toon.' },
                       { label: 'Duidelijker formuleren', action: 'Maak de formulering eenduidiger en minder ambigu.' },
                       { label: 'Grammatica corrigeren', action: 'Corrigeer spelling en grammaticafouten.' }
                     ].map((item, i) => (
                       <button
                         key={i}
                         type="button"
                         className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors block"
                         onClick={() => handleAiAction(item.action)}
                       >
                         {item.label}
                       </button>
                     ))}
                  </div>
                )}
             </div>
          </>
        )}
        
        <div className="flex-1" />
        <button 
          type="button"
          onClick={() => {
             if(window.confirm('Opmaak verwijderen?')) {
               onChange(editorRef.current?.innerText || '');
               if(editorRef.current) editorRef.current.innerHTML = editorRef.current.innerText;
             }
          }}
          className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1 px-2"
        >
          <RotateCcw size={10} /> Clear
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        className={`p-3 focus:outline-none text-sm text-gray-800 leading-relaxed overflow-y-auto ${isAiLoading ? 'opacity-50 pointer-events-none' : ''}`}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
      
      {value === '' && !isFocused && placeholder && (
        <div className="absolute top-[46px] left-3 text-sm text-gray-400 pointer-events-none select-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};