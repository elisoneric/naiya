
import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import type { Ticket, TicketMessage } from '../types';
import { ticketService } from '../services/ticketService';

interface TicketState {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  loading: boolean;
  error: string | null;
  activeFolder: string;
  searchTerm: string;
}

type Action =
  | { type: 'FETCH_TICKETS_START' }
  | { type: 'FETCH_TICKETS_SUCCESS'; payload: Ticket[] }
  | { type: 'FETCH_TICKETS_ERROR'; payload: string }
  | { type: 'SELECT_TICKET'; payload: Ticket | null }
  | { type: 'UPDATE_TICKET'; payload: Ticket }
  | { type: 'ADD_MESSAGE'; payload: TicketMessage }
  | { type: 'SET_ACTIVE_FOLDER'; payload: string }
  | { type: 'LOCK_TICKET'; payload: { ticketId: number; lock: Ticket['lock'] } }
  | { type: 'UNLOCK_TICKET'; payload: { ticketId: number } }
  | { type: 'SEARCH_TICKETS'; payload: string };

const initialState: TicketState = {
  tickets: [],
  selectedTicket: null,
  loading: true,
  error: null,
  activeFolder: 'Inbox',
  searchTerm: '',
};

const ticketReducer = (state: TicketState, action: Action): TicketState => {
  switch (action.type) {
    case 'FETCH_TICKETS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_TICKETS_SUCCESS':
      return { ...state, loading: false, tickets: action.payload };
    case 'FETCH_TICKETS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_ACTIVE_FOLDER':
      return { ...state, activeFolder: action.payload, selectedTicket: null };
    case 'SEARCH_TICKETS':
        return { ...state, searchTerm: action.payload };
    case 'SELECT_TICKET':
      if (action.payload && !action.payload.isRead) {
          // Optimistic update for read status
          const readTicket = { ...action.payload, isRead: true };
          ticketService.updateTicket(readTicket); 
          return { 
            ...state, 
            selectedTicket: readTicket,
            tickets: state.tickets.map(t => t.id === action.payload?.id ? readTicket : t),
          };
      }
      return { ...state, selectedTicket: action.payload };

    case 'UPDATE_TICKET': {
        // Persist update
        ticketService.updateTicket(action.payload);
        const updatedTickets = state.tickets.map(ticket =>
            ticket.id === action.payload.id ? action.payload : ticket
        );
        return {
            ...state,
            tickets: updatedTickets,
            selectedTicket: state.selectedTicket?.id === action.payload.id ? action.payload : state.selectedTicket
        };
    }
    case 'ADD_MESSAGE': {
      const ticketId = action.payload.ticketId;
      let updatedTicket: Ticket | undefined;
      
      const newTickets = state.tickets.map(ticket => {
        if (ticket.id === ticketId) {
          updatedTicket = { ...ticket, messages: [...ticket.messages, action.payload], updatedAt: new Date().toISOString(), isRead: false };
          return updatedTicket;
        }
        return ticket;
      });
      
      if (updatedTicket) ticketService.updateTicket(updatedTicket);

      return { 
          ...state, 
          tickets: newTickets,
          selectedTicket: state.selectedTicket?.id === ticketId ? updatedTicket || null : state.selectedTicket,
      };
    }
    case 'LOCK_TICKET':
    case 'UNLOCK_TICKET': {
      const { ticketId } = action.payload;
      const lock = action.type === 'LOCK_TICKET' ? action.payload.lock : null;
      const updatedTickets = state.tickets.map(t => t.id === ticketId ? { ...t, lock } : t);
      return {
        ...state,
        tickets: updatedTickets,
        selectedTicket: state.selectedTicket?.id === ticketId ? { ...state.selectedTicket, lock } : state.selectedTicket,
      };
    }
    default:
      return state;
  }
};

const TicketStateContext = createContext<TicketState | undefined>(undefined);
const TicketDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  return (
    <TicketStateContext.Provider value={state}>
      <TicketDispatchContext.Provider value={dispatch}>
        {children}
      </TicketDispatchContext.Provider>
    </TicketStateContext.Provider>
  );
};

export const useTicketState = () => {
  const context = useContext(TicketStateContext);
  if (context === undefined) {
    throw new Error('useTicketState must be used within a TicketProvider');
  }
  return context;
};

export const useTicketDispatch = () => {
  const context = useContext(TicketDispatchContext);
  if (context === undefined) {
    throw new Error('useTicketDispatch must be used within a TicketProvider');
  }
  return context;
};
