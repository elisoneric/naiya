import React, { useContext } from 'react';
import type { Ticket } from '../../types';
import MessageThread from '../tickets/MessageThread';
import QuickActions from '../tickets/QuickActions';
import StatusBadge from '../common/StatusBadge';
import { LockIcon } from '../common/Icons';
import { AuthContext } from '../../contexts/AuthContext';

interface ReadingPaneProps {
  ticket: Ticket | null;
}

const ReadingPane: React.FC<ReadingPaneProps> = ({ ticket }) => {
  const { user } = useContext(AuthContext);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full bg-outlook-lightGray dark:bg-outlook-darkPaper transition-colors duration-200">
        <div className="text-center text-outlook-textSecondary dark:text-gray-400">
          <h2 className="text-xl">Select a ticket to read</h2>
          <p>Nothing is selected.</p>
        </div>
      </div>
    );
  }

  const isLockedByOther = ticket.lock && ticket.lock.userId !== user?.id;

  return (
    <div className="flex flex-col h-full bg-outlook-lightGray dark:bg-outlook-darkPaper transition-colors duration-200">
      <div className="p-4 border-b border-outlook-border dark:border-outlook-darkBorder flex-shrink-0">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-outlook-text dark:text-white">{ticket.title}</h2>
            <StatusBadge status={ticket.status} />
        </div>
        <div className="flex items-center mt-2 text-sm text-outlook-textSecondary dark:text-gray-400">
            <span>From: {ticket.userName} ({ticket.userEmail})</span>
            <span className="mx-2">|</span>
            <span>#{ticket.ticketNumber}</span>
        </div>
         {isLockedByOther && (
            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md flex items-center text-sm dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700">
                <LockIcon className="w-4 h-4 mr-2" />
                This ticket is currently being viewed by {ticket.lock?.userName}. You are in read-only mode.
            </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageThread messages={ticket.messages} currentUser={user} />
      </div>
      <div className="p-4 border-t border-outlook-border dark:border-outlook-darkBorder flex-shrink-0 bg-outlook-mediumGray dark:bg-outlook-darkBg">
        <QuickActions ticket={ticket} />
      </div>
    </div>
  );
};

export default ReadingPane;