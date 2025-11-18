
import type { Ticket, User, TicketDraft, TicketPriority } from '../types';
import { storageService } from './storageService';

const PRIORITY_MAP: Record<string, TicketPriority> = {
  'nimc_client_password': 'High',
  'webmail_password': 'High',
  'vpn': 'High',
  'device_activation': 'High',
  'Onboarding': 'High',
  'other': 'Low'
};

const sendEmail = (to: string, subject: string, body: string) => {
    console.log(`%c[Email Service] Sending to: ${to}`, 'color: #0078d4; font-weight: bold;');
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
};

export const ticketService = {
  getTickets: (user?: User): Promise<Ticket[]> => {
    return new Promise(resolve => {
      let allTickets = storageService.getTickets();
      
      if (user && user.userType === 'agent') {
          allTickets = allTickets.filter(t => t.userId === user.id || t.userEmail.toLowerCase() === user.email.toLowerCase());
      }
      
      // Sort by most recently updated
      const sortedTickets = allTickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      resolve(sortedTickets);
    });
  },
  
  createTicket: (draft: TicketDraft, user: User): Promise<Ticket> => {
      return new Promise(resolve => {
          const newTicket: Ticket = {
              id: Date.now(),
              ticketNumber: `T${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`,
              userId: user.id,
              userName: user.name,
              userEmail: user.email,
              category: draft.category,
              title: draft.title,
              status: 'Open',
              priority: PRIORITY_MAP[draft.category] || 'Low',
              assignedTo: null,
              assignedToName: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isRead: false,
              lock: null,
              messages: [
                  {
                      id: Date.now(),
                      ticketId: 0, 
                      userId: user.id,
                      userName: user.name,
                      message: draft.description,
                      createdAt: new Date().toISOString()
                  }
              ]
          };
          
          newTicket.messages[0].ticketId = newTicket.id;
          
          // SAVE TO DB
          storageService.saveTicket(newTicket);
          
          // Email Notification
          sendEmail('support@livak.esam.com.ng', `New Ticket: ${newTicket.ticketNumber}`, `A new ticket has been created by ${user.name}.\n\nTitle: ${draft.title}\nPriority: ${newTicket.priority}`);
          sendEmail(user.email, `Ticket Received: ${newTicket.ticketNumber}`, `Dear ${user.name},\n\nWe have received your ticket regarding "${draft.title}".\n\nTrack status at your portal.`);

          resolve(newTicket);
      });
  },

  updateTicket: (ticket: Ticket): Promise<Ticket> => {
      return new Promise(resolve => {
          storageService.saveTicket(ticket);
          resolve(ticket);
      });
  },

  getStaff: (): Promise<User[]> => {
      return new Promise(resolve => {
          resolve(storageService.getStaffList());
      });
  },

  // Validate Agent Email against JSON list in DB
  getUserByEmail: (email: string): Promise<User | null> => {
      return new Promise(resolve => {
          const allowedAgents = storageService.getAllowedAgents();
          const cleanEmail = email.toLowerCase().trim();

          if (allowedAgents.map(e => e.toLowerCase()).includes(cleanEmail)) {
              // Dynamically create user object since we only store emails for agents
              const user: User = { 
                  id: Date.now(), // Temporary session ID
                  name: cleanEmail.split('@')[0], 
                  email: cleanEmail, 
                  userType: 'agent' 
              };
              resolve(user);
          } else {
              resolve(null);
          }
      });
  },

  // Admin function
  uploadAgents: (csvContent: string): Promise<void> => {
      return new Promise(resolve => {
          const emails = csvContent
              .split(/[\n,]+/) // Split by newline or comma
              .map(e => e.trim())
              .filter(e => e.includes('@')); // Basic validation
          
          storageService.saveAllowedAgents(emails);
          resolve();
      });
  }
};
