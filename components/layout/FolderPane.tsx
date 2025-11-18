import React, { useContext } from 'react';
import { useTicketState, useTicketDispatch } from '../../contexts/TicketContext';
import { AuthContext } from '../../contexts/AuthContext';
import { InboxIcon, SendIcon, UserIcon, ArchiveIcon, UsersIcon } from '../common/Icons';
import type { Ticket } from '../../types';

interface FolderItemProps {
  icon: React.ReactNode;
  name: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ icon, name, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-sm text-left transition-colors ${
      isActive 
        ? 'bg-outlook-selected text-outlook-blue font-semibold dark:bg-outlook-darkSelected dark:text-white' 
        : 'hover:bg-outlook-unreadHover dark:hover:bg-outlook-darkHover text-outlook-text dark:text-outlook-darkText'
    }`}
  >
    <div className="flex items-center">
      {icon}
      <span className="ml-3">{name}</span>
    </div>
    {count !== undefined && count > 0 && <span className={isActive ? 'text-outlook-blue dark:text-blue-300' : 'text-outlook-textSecondary dark:text-gray-400'}>{count}</span>}
  </button>
);


const FolderPane: React.FC<{ onOpenAgentManager: () => void }> = ({ onOpenAgentManager }) => {
  const { tickets, activeFolder } = useTicketState();
  const dispatch = useTicketDispatch();
  const { user } = useContext(AuthContext);
  
  const getUnreadCount = (filteredTickets: Ticket[]) => {
      return filteredTickets.filter(t => !t.isRead).length;
  }

  const folders = [
    { name: 'Inbox', icon: <InboxIcon className="w-5 h-5" />, filter: (t: Ticket) => t.status !== 'Closed' },
    { name: 'Assigned to me', icon: <UserIcon className="w-5 h-5" />, filter: (t: Ticket) => t.assignedTo === user?.id && t.status !== 'Closed' },
    { name: 'Unassigned', icon: <SendIcon className="w-5 h-5" />, filter: (t: Ticket) => t.assignedTo === null && t.status !== 'Closed' },
    { name: 'Closed', icon: <ArchiveIcon className="w-5 h-5" />, filter: (t: Ticket) => t.status === 'Closed' },
  ];

  return (
    <div className="w-64 bg-outlook-mediumGray dark:bg-outlook-darkBg p-2 border-r border-outlook-border dark:border-outlook-darkBorder flex-shrink-0 flex flex-col justify-between transition-colors duration-200">
      <div className="space-y-1">
        {folders.map(folder => (
            <FolderItem
              key={folder.name}
              icon={folder.icon}
              name={folder.name}
              count={getUnreadCount(tickets.filter(folder.filter))}
              isActive={activeFolder === folder.name}
              onClick={() => dispatch({ type: 'SET_ACTIVE_FOLDER', payload: folder.name })}
            />
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <FolderItem
            icon={<UsersIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
            name="Manage Agents"
            isActive={false}
            onClick={onOpenAgentManager}
        />
      </div>
    </div>
  );
};

export default FolderPane;