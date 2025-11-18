import React from 'react';
import { format } from 'date-fns';
import type { TicketMessage, User } from '../../types';
import { UserIcon, PersonIcon, FileIcon, DownloadIcon } from '../common/Icons';

interface MessageThreadProps {
  messages: TicketMessage[];
  currentUser?: User | null;
}

const MessageThread: React.FC<MessageThreadProps> = ({ messages, currentUser }) => {
  return (
    <div className="space-y-4 pb-4">
      {messages.map((msg, index) => {
        const isMe = currentUser ? msg.userId === currentUser.id : msg.userId >= 100; 

        return (
          <div key={index} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isMe ? 'bg-outlook-blue text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-200'}`}>
                     {isMe ? <UserIcon className="w-5 h-5" /> : <PersonIcon className="w-5 h-5" />}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2 shadow-sm rounded-lg text-sm relative ${
                        isMe 
                            ? 'bg-outlook-selected dark:bg-outlook-darkSelected text-gray-800 dark:text-white rounded-tr-none' 
                            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white rounded-tl-none'
                    }`}>
                        <div className={`text-xs font-bold mb-1 ${isMe ? 'text-outlook-darkBlue dark:text-blue-300 text-right' : 'text-gray-500 dark:text-gray-300'}`}>
                            {msg.userName}
                        </div>
                        
                        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: (msg.message || '').replace(/\n/g, '<br />') }} />

                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {msg.attachments.map((att, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                        {att.type.startsWith('image/') ? (
                                            <img src={att.data} alt={att.name} className="max-w-[200px] max-h-[200px] rounded" />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FileIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-xs font-medium truncate max-w-[150px] dark:text-gray-200">{att.name}</span>
                                                    <a href={att.data} download={att.name} className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                                        Download <DownloadIcon className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <time className="text-[10px] text-gray-400 mt-1 px-1">
                        {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                    </time>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageThread;