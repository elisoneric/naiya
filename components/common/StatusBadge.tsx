import React from 'react';
import type { TicketStatus } from '../../types';

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusColors: Record<TicketStatus, string> = {
  'Open': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  'Awaiting User': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold leading-5 rounded-full whitespace-nowrap ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;