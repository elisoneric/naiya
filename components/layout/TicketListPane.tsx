import React from 'react';
import TicketItem from '../tickets/TicketItem';
import type { Ticket } from '../../types';

interface TicketListPaneProps {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

const TicketListPane: React.FC<TicketListPaneProps> = ({ tickets, loading, error }) => {
  if (loading) {
    return <div className="p-4 text-center text-outlook-textSecondary dark:text-gray-400 bg-outlook-lightGray dark:bg-outlook-darkPaper h-full">Loading tickets...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600 bg-outlook-lightGray dark:bg-outlook-darkPaper h-full">{error}</div>;
  }

  return (
    <div className="w-full bg-outlook-lightGray dark:bg-outlook-darkPaper flex flex-col min-w-0 h-full transition-colors duration-200">
        <div className="p-3 border-b border-outlook-border dark:border-outlook-darkBorder flex-shrink-0">
             <h2 className="text-lg font-semibold text-outlook-text dark:text-outlook-darkText">Tickets</h2>
        </div>
      <div className="overflow-y-auto flex-1">
        {tickets.length === 0 ? (
          <div className="p-4 text-center text-outlook-textSecondary dark:text-gray-400">No tickets found.</div>
        ) : (
          <ul>
            {tickets.map(ticket => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TicketListPane;