
export type UserType = 'agent' | 'staff';
export type TicketStatus = 'Open' | 'In Progress' | 'Closed' | 'Awaiting User';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface User {
  id: number;
  name: string;
  email: string;
  userType: UserType;
}

export interface Attachment {
    id: string;
    name: string;
    type: string;
    data: string; // Base64 string
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  userId: number;
  userName: string;
  message: string;
  createdAt: string;
  attachments?: Attachment[];
}

export interface TicketLock {
    userId: number;
    userName: string;
    expiresAt: number;
}

export interface Ticket {
  id: number;
  ticketNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  category: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo: number | null;
  assignedToName: string | null;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  lock: TicketLock | null;
  isRead: boolean;
}

export interface TicketDraft {
  title: string;
  category: string;
  description: string;
}
