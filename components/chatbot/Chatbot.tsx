import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../../services/geminiService';
import { CloseIcon, SendIcon, UserIcon, ChatBotIcon } from '../common/Icons';

interface ChatbotProps {
  onClose: () => void;
}

type Message = {
  role: 'user' | 'model';
  text: string;
};

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(input);

    const modelMessage: Message = { role: 'model', text: responseText };
    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in-up overflow-hidden border dark:border-gray-700">
      <header className="flex items-center justify-between p-3 bg-outlook-blue dark:bg-outlook-darkBlue text-white rounded-t-lg">
        <div className="flex items-center">
            <ChatBotIcon className="w-6 h-6 mr-2" />
            <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-outlook-darkBlue dark:hover:bg-gray-700">
            <CloseIcon className="w-5 h-5" />
        </button>
      </header>
      
      <div className="flex-1 p-4 overflow-y-auto bg-outlook-gray dark:bg-gray-900">
        <div className="space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'model' && <div className="p-2 bg-outlook-blue rounded-full text-white flex-shrink-0"><ChatBotIcon className="w-5 h-5"/></div>}
                    <div className={`px-4 py-2 rounded-lg max-w-xs ${
                        msg.role === 'user' 
                            ? 'bg-outlook-selected dark:bg-outlook-darkSelected text-outlook-text dark:text-white' 
                            : 'bg-white dark:bg-gray-700 text-outlook-textSecondary dark:text-gray-200'
                    }`}>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                    </div>
                     {msg.role === 'user' && <div className="p-2 bg-gray-300 dark:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300 flex-shrink-0"><UserIcon className="w-5 h-5"/></div>}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-outlook-blue rounded-full text-white"><ChatBotIcon className="w-5 h-5"/></div>
                    <div className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-outlook-textSecondary dark:text-gray-200">
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-medium"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-slow"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-3 border-t border-outlook-border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="w-full pr-12 pl-4 py-2 border border-outlook-border dark:border-gray-600 rounded-full bg-outlook-gray dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-outlook-blue dark:placeholder-gray-400"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-outlook-blue text-white rounded-full hover:bg-outlook-darkBlue disabled:bg-gray-400"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;