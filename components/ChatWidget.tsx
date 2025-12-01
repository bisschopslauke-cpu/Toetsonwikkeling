import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { GeneratorConfig, ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';

interface ChatWidgetProps {
  config: GeneratorConfig;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hallo! Ik ben uw didactische assistent. Kan ik helpen met het formuleren van leerdoelen of vragen?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    const newHistory = [...messages, userMsg];
    
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendChatMessage(newHistory, config);
      setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Excuus, er ging iets mis.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-transform hover:scale-105 flex items-center justify-center z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-label="Open Chat Assistant"
      >
        <MessageSquare size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-primary text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <div>
            <h3 className="font-bold text-sm">Didactische Coach</h3>
            <p className="text-[10px] opacity-90">Powered by Gemini 3.0 Pro</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Minimize2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0 border
              ${msg.role === 'user' ? 'bg-gray-200 border-gray-300 text-gray-600' : 'bg-white border-gray-200 text-primary'}
            `}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
            </div>
            
            <div className={`
              max-w-[80%] p-3 rounded-lg text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2.5">
             <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-primary flex items-center justify-center shrink-0">
               <Bot size={18} />
             </div>
             <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm">
               <div className="flex gap-1">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="relative flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Stel uw vraag over didactiek of inhoud..."
            className="w-full max-h-32 min-h-[44px] p-2.5 pr-10 rounded border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:border-primary focus:bg-white resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-1.5 text-primary hover:bg-primary/10 rounded-full disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          De AI kan fouten maken. Controleer belangrijke informatie.
        </p>
      </div>
    </div>
  );
};