import React from 'react';
import { useTicketState, useTicketDispatch } from '../../contexts/TicketContext';
import type { Ticket } from '../../types';
import PriorityIndicator from '../common/PriorityIndicator';
import { formatDistanceToNow } from 'date-fns';
import { LockIcon } from '../common/Icons';

interface TicketItemProps {
  ticket: Ticket;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket }) => {
  const { selectedTicket } = useTicketState();
  const dispatch = useTicketDispatch();
  const isSelected = selectedTicket?.id === ticket.id;
  const isLockedByOther = ticket.lock && ticket.lock.userId !== 101; // Assuming current user id is 101

  const handleClick = () => {
    dispatch({ type: 'SELECT_TICKET', payload: ticket });
  };

  // Dynamic classes based on selection and read status, incorporating dark mode
  const baseClasses = "border-b border-outlook-border dark:border-outlook-darkBorder cursor-pointer transition-colors duration-150";
  let bgClass = "";
  
  if (isSelected) {
      bgClass = "bg-outlook-selected dark:bg-outlook-darkSelected";
  } else if (ticket.isRead) {
      bgClass = "bg-white dark:bg-outlook-darkPaper hover:bg-gray-50 dark:hover:bg-outlook-darkHover";
  } else {
      bgClass = "bg-outlook-unread dark:bg-gray-800 hover:bg-outlook-unreadHover dark:hover:bg-gray-700";
  }

  return (
    <li onClick={handleClick} className={`${baseClasses} ${bgClass}`}>
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className={`flex-1 min-w-0 ${!ticket.isRead ? 'font-bold' : 'font-normal'}`}>
            <p className="text-sm text-outlook-text dark:text-outlook-darkText truncate">{ticket.userName}</p>
            <p className="text-md text-outlook-text dark:text-gray-300 truncate">{ticket.title}</p>
            <p className="text-sm text-outlook-textSecondary dark:text-gray-400 truncate">{ticket.messages[ticket.messages.length - 1]?.message}</p>
          </div>
          <div className="ml-2 flex-shrink-0 text-right">
             <div className="flex items-center justify-end space-x-2">
                {isLockedByOther && <LockIcon className="w-4 h-4 text-outlook-textSecondary dark:text-gray-400" title={`Locked by ${ticket.lock?.userName}`}/>}
                <time className={`text-xs ${!ticket.isRead ? 'text-outlook-blue dark:text-blue-400' : 'text-outlook-textSecondary dark:text-gray-500'}`}>
                    {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                </time>
             </div>
             <div className="mt-1">
                <PriorityIndicator priority={ticket.priority} />
             </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default TicketItem;