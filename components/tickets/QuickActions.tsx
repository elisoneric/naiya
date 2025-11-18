
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useTicketDispatch } from '../../contexts/TicketContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import type { Ticket, User, Attachment } from '../../types';
import { ticketService } from '../../services/ticketService';
import { SendIcon, PaperclipIcon } from '../common/Icons';

interface QuickActionsProps {
  ticket: Ticket;
}

const HEADERS = [
    { value: '', label: 'No Greeting' },
    { value: 'Good day,', label: 'Good day' },
    { value: 'Hello,', label: 'Hello' },
    { value: 'Dear User,', label: 'Dear User' },
    { value: 'Hi there,', label: 'Hi there' },
];

const FOOTERS = [
    { value: '', label: 'No Sign-off' },
    { value: 'Thank you.', label: 'Thank you' },
    { value: 'Regards,\nIT Support Team', label: 'Regards, IT Support' },
    { value: 'Best regards,', label: 'Best regards' },
    { value: 'Please let us know if you have further questions.', label: 'Further questions?' },
];

const QuickActions: React.FC<QuickActionsProps> = ({ ticket }) => {
  const [reply, setReply] = useState('');
  const [header, setHeader] = useState('');
  const [footer, setFooter] = useState('');
  const [staffList, setStaffList] = useState<User[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const dispatch = useTicketDispatch();
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();

  const isLockedByOther = ticket.lock && ticket.lock.userId !== user?.id;

  useEffect(() => {
    ticketService.getStaff().then(setStaffList);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 2 * 1024 * 1024) { // 2MB Limit
            addToast(`File ${file.name} is too large (Max 2MB)`, 'error');
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
    addToast('File attached successfully', 'info');
  };

  const handleSendReply = () => {
    if ((!reply.trim() && attachments.length === 0) || !user) return;
    
    // Combine Header, Body, Footer
    const fullMessage = [header, reply, footer].filter(Boolean).join('\n\n');

    const newMessage = {
      id: Date.now(),
      ticketId: ticket.id,
      userId: user.id,
      userName: user.name,
      message: fullMessage,
      createdAt: new Date().toISOString(),
      attachments: attachments
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
    setReply('');
    setHeader('');
    setFooter('');
    setAttachments([]);
    addToast('Reply sent', 'success');
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Ticket['status'];
    const updatedTicket = { ...ticket, status: newStatus, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
    addToast(`Status updated to ${newStatus}`, 'success');
  };
  
  const handleAssignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assignedToId = e.target.value ? parseInt(e.target.value) : null;
    const assignedStaff = staffList.find(s => s.id === assignedToId);
    const updatedTicket = { 
        ...ticket, 
        assignedTo: assignedToId,
        assignedToName: assignedStaff?.name || null,
        updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
    addToast(assignedToId ? `Assigned to ${assignedStaff?.name}` : 'Unassigned ticket', 'info');
  };

  return (
    <div className="space-y-4">
      <div className="border border-outlook-border rounded-md bg-white dark:bg-outlook-darkPaper dark:border-gray-600 transition-colors">
        {/* Quick Template Selectors */}
        <div className="flex items-center gap-2 p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-md">
            <select 
                value={header} 
                onChange={(e) => setHeader(e.target.value)}
                disabled={isLockedByOther}
                className="text-xs border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-1 focus:ring-outlook-blue focus:outline-none"
            >
                {HEADERS.map(h => <option key={h.label} value={h.value}>{h.label}</option>)}
            </select>
            <span className="text-xs text-gray-400">+</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 italic font-medium">Message Body</span>
            <span className="text-xs text-gray-400">+</span>
            <select 
                value={footer} 
                onChange={(e) => setFooter(e.target.value)}
                disabled={isLockedByOther}
                className="text-xs border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-1 focus:ring-outlook-blue focus:outline-none"
            >
                {FOOTERS.map(f => <option key={f.label} value={f.value}>{f.label}</option>)}
            </select>
        </div>

        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder={isLockedByOther ? "Ticket is locked by another user" : "Type your reply here..."}
          rows={4}
          disabled={isLockedByOther}
          className="w-full p-3 text-sm focus:outline-none bg-white dark:bg-outlook-darkPaper text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 resize-none"
        />
        
        {/* Attachment Preview */}
        {attachments.length > 0 && (
            <div className="px-3 pb-2 flex gap-2 flex-wrap bg-white dark:bg-outlook-darkPaper">
                {attachments.map(att => (
                    <div key={att.id} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs flex items-center gap-2 dark:text-gray-200">
                        <span className="truncate max-w-[100px]">{att.name}</span>
                        <button onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))} className="text-red-500 font-bold">×</button>
                    </div>
                ))}
            </div>
        )}

        <div className="flex items-center justify-between p-2 border-t border-outlook-border dark:border-gray-600 bg-outlook-mediumGray dark:bg-gray-800 rounded-b-md">
            <div className="flex items-center space-x-2">
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
                    disabled={isLockedByOther} 
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    title="Attach File"
                 >
                    <PaperclipIcon className="w-5 h-5 text-outlook-textSecondary dark:text-gray-400" />
                </button>
            </div>
            <button 
                onClick={handleSendReply} 
                disabled={(!reply.trim() && attachments.length === 0) || isLockedByOther} 
                className="flex items-center px-4 py-1.5 text-sm font-semibold text-white bg-outlook-blue rounded-sm hover:bg-outlook-darkBlue disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                <SendIcon className="w-4 h-4 mr-2" />
                Send
            </button>
        </div>
      </div>
       <div className="flex items-center justify-between space-x-4">
        <div className="flex-1">
          <label htmlFor="status" className="block text-xs font-medium text-outlook-textSecondary dark:text-gray-400">Status</label>
          <select id="status" value={ticket.status} onChange={handleStatusChange} disabled={isLockedByOther} className="mt-1 block w-full pl-3 pr-10 py-1.5 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-outlook-border dark:border-gray-600 focus:outline-none focus:ring-outlook-blue focus:border-outlook-blue sm:text-sm rounded-md disabled:bg-gray-100 dark:disabled:bg-gray-800 transition-colors">
            <option>Open</option>
            <option>In Progress</option>
            <option>Awaiting User</option>
            <option>Closed</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="assignee" className="block text-xs font-medium text-outlook-textSecondary dark:text-gray-400">Assignee</label>
          <select id="assignee" value={ticket.assignedTo || ''} onChange={handleAssignmentChange} disabled={isLockedByOther} className="mt-1 block w-full pl-3 pr-10 py-1.5 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-outlook-border dark:border-gray-600 focus:outline-none focus:ring-outlook-blue focus:border-outlook-blue sm:text-sm rounded-md disabled:bg-gray-100 dark:disabled:bg-gray-800 transition-colors">
            <option value="">Unassigned</option>
            {staffList.map(staff => (
              <option key={staff.id} value={staff.id}>{staff.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
