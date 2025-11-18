import React, { useState, useRef, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import type { Ticket, TicketMessage, Attachment } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import { useTicketDispatch } from '../../contexts/TicketContext';
import { useToast } from '../../contexts/ToastContext';
import { SendIcon, PaperclipIcon, FileIcon, DownloadIcon } from '../common/Icons';

interface UserChatProps {
    ticket: Ticket;
}

const UserChat: React.FC<UserChatProps> = ({ ticket }) => {
    const { user } = useContext(AuthContext);
    const dispatch = useTicketDispatch();
    const { addToast } = useToast();
    const [input, setInput] = useState('');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [ticket.messages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 2 * 1024 * 1024) {
                addToast(`File ${file.name} too large`, 'error');
                continue;
            }
            
            const reader = new FileReader();
            reader.onload = (evt) => {
                const data = evt.target?.result as string;
                setAttachments(prev => [...prev, {
                    id: Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    type: file.type,
                    data: data
                }]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = () => {
        if ((!input.trim() && attachments.length === 0) || !user) return;
        
        const newMessage: TicketMessage = {
            id: Date.now(),
            ticketId: ticket.id,
            userId: user.id,
            userName: user.name,
            message: input,
            createdAt: new Date().toISOString(),
            attachments: attachments
        };
        
        dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
        setInput('');
        setAttachments([]);
    };

    return (
        <div className="flex flex-col h-full bg-[#E5DDD5] dark:bg-[#121212]">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center justify-between z-10 border-b dark:border-gray-700">
                <div>
                    <h2 className="font-bold text-gray-800 dark:text-white">{ticket.title}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ticket #{ticket.ticketNumber}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ticket.status === 'Open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                    ticket.status === 'Closed' ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                }`}>
                    {ticket.status}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-repeat dark:bg-none relative">
                 {/* Background pattern overlay for light mode, hidden in dark mode */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] dark:hidden"></div>
                
                {ticket.messages.map((msg) => {
                    const isMe = msg.userId === user?.id;
                    // In User Portal: Me (Agent) -> Right, IT -> Left
                    return (
                        <div key={msg.id} className={`flex w-full relative z-10 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 relative shadow-sm flex flex-col ${
                                isMe 
                                    ? 'bg-[#dcf8c6] dark:bg-[#056162] rounded-tr-none' 
                                    : 'bg-white dark:bg-gray-700 rounded-tl-none'
                            }`}>
                                {!isMe && <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">{msg.userName}</p>}
                                
                                {/* Message Text */}
                                {msg.message && <p className="text-sm text-gray-800 dark:text-white whitespace-pre-wrap">{msg.message}</p>}
                                
                                {/* Attachments */}
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                        {msg.attachments.map((att, i) => (
                                            <div key={i} className="bg-black/5 dark:bg-black/20 p-2 rounded-lg">
                                                 {att.type.startsWith('image/') ? (
                                                    <img src={att.data} alt={att.name} className="max-w-full rounded-lg" />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <FileIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                                                        <div className="flex flex-col">
                                                            <span className="text-xs truncate max-w-[120px] dark:text-gray-200">{att.name}</span>
                                                            <a href={att.data} download={att.name} className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                                                                Download <DownloadIcon className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="text-[10px] text-gray-500 dark:text-gray-400 text-right mt-1 flex justify-end items-center gap-1 min-w-[50px]">
                                    {format(new Date(msg.createdAt), 'HH:mm')}
                                    {isMe && <span className="text-blue-500 dark:text-blue-300">✓✓</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f0f0] dark:bg-gray-800 p-2 flex flex-col gap-2 border-t dark:border-gray-700">
                {attachments.length > 0 && (
                    <div className="flex gap-2 px-2 overflow-x-auto">
                        {attachments.map(att => (
                            <div key={att.id} className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg shadow text-xs flex items-center gap-2 dark:text-white">
                                <span className="truncate max-w-[100px]">{att.name}</span>
                                <button onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))} className="text-red-500 font-bold">×</button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <input 
                        type="file" 
                        multiple 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileSelect}
                        accept="image/*,.pdf,.doc,.docx"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <PaperclipIcon className="w-6 h-6" />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message"
                        className="flex-1 py-2 px-4 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 h-10"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() && attachments.length === 0}
                        className="p-2 bg-[#00a884] dark:bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserChat;