import type { Ticket, User } from '../types';

// DATABASE KEYS
const DB_KEYS = {
    TICKETS: 'db_tickets',
    USERS: 'db_users', // For registered users/staff
    ALLOWED_AGENTS: 'db_allowed_agents' // JSON list of emails
};

// INITIAL SEED DATA (Only runs if DB is empty)
const INITIAL_STAFF: User = {
    id: 101,
    name: 'IT Administrator',
    email: 'admin@livak.esam.com.ng',
    userType: 'staff'
};

const INITIAL_AGENTS_LIST = [
    'john.doe@example.com',
    'jane.smith@example.com'
];

export const storageService = {
    // --- USERS & AUTH ---
    initialize: () => {
        if (!localStorage.getItem(DB_KEYS.ALLOWED_AGENTS)) {
            localStorage.setItem(DB_KEYS.ALLOWED_AGENTS, JSON.stringify(INITIAL_AGENTS_LIST));
        }
        if (!localStorage.getItem(DB_KEYS.TICKETS)) {
            localStorage.setItem(DB_KEYS.TICKETS, JSON.stringify([]));
        }
    },

    getAllowedAgents: (): string[] => {
        const data = localStorage.getItem(DB_KEYS.ALLOWED_AGENTS);
        return data ? JSON.parse(data) : [];
    },

    saveAllowedAgents: (emails: string[]) => {
        // Merge with existing to avoid duplicates
        const current = storageService.getAllowedAgents();
        const newSet = new Set([...current, ...emails]);
        localStorage.setItem(DB_KEYS.ALLOWED_AGENTS, JSON.stringify(Array.from(newSet)));
    },

    removeAllowedAgent: (email: string) => {
        const current = storageService.getAllowedAgents();
        const filtered = current.filter(e => e !== email);
        localStorage.setItem(DB_KEYS.ALLOWED_AGENTS, JSON.stringify(filtered));
    },

    getStaffUser: (): User => {
        return INITIAL_STAFF; // In a real app, this would be a DB query
    },

    // --- TICKETS ---
    getTickets: (): Ticket[] => {
        const data = localStorage.getItem(DB_KEYS.TICKETS);
        return data ? JSON.parse(data) : [];
    },

    saveTicket: (ticket: Ticket) => {
        const tickets = storageService.getTickets();
        const index = tickets.findIndex(t => t.id === ticket.id);
        
        if (index >= 0) {
            tickets[index] = ticket;
        } else {
            tickets.unshift(ticket);
        }
        
        localStorage.setItem(DB_KEYS.TICKETS, JSON.stringify(tickets));
    },

    getStaffList: (): User[] => {
        // In a real app, fetch from DB users table where type = staff
        return [INITIAL_STAFF, { id: 102, name: 'Bob Technician', email: 'bob@test.com', userType: 'staff'}];
    }
};

// Initialize immediately
storageService.initialize();
