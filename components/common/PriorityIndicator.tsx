
import React from 'react';
import type { TicketPriority } from '../../types';

interface PriorityIndicatorProps {
  priority: TicketPriority;
}

const priorityColors: Record<TicketPriority, string> = {
  'Low': 'bg-green-500',
  'Medium': 'bg-yellow-500',
  'High': 'bg-red-500',
  'Urgent': 'bg-red-700',
};

const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ priority }) => {
  const color = priorityColors[priority] || 'bg-gray-400';
  return <span className={`inline-block w-3 h-3 rounded-full ${color}`} title={`Priority: ${priority}`}></span>;
};

export default PriorityIndicator;
