
import React, { useEffect, useContext, useMemo, useState } from 'react';
import { TicketProvider, useTicketDispatch, useTicketState } from '../contexts/TicketContext';
import { AuthContext } from '../contexts/AuthContext';
import { ticketService } from '../services/ticketService';
import { useRealTime } from '../hooks/useRealTime';
import OutlookHeader from '../components/layout/OutlookHeader';
import FolderPane from '../components/layout/FolderPane';
import TicketListPane from '../components/layout/TicketListPane';
import ReadingPane from '../components/layout/ReadingPane';
import Chatbot from '../components/chatbot/Chatbot';
import AgentManager from '../components/admin/AgentManager';
import type { Ticket } from '../types';

const DashboardContent: React.FC = () => {
    const dispatch = useTicketDispatch();
    const { tickets, activeFolder, loading, error, selectedTicket, searchTerm } = useTicketState();
    const { user } = useContext(AuthContext);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [isAgentManagerOpen, setIsAgentManagerOpen] = useState(false);
    useRealTime();

    useEffect(() => {
        dispatch({ type: 'FETCH_TICKETS_START' });
        ticketService.getTickets()
            .then(data => dispatch({ type: 'FETCH_TICKETS_SUCCESS', payload: data }))
            .catch(err => dispatch({ type: 'FETCH_TICKETS_ERROR', payload: 'Failed to fetch tickets' }));
    }, [dispatch]);

    const filteredTickets = useMemo(() => {
        let filtered: Ticket[] = [];
        switch (activeFolder) {
            case 'Inbox':
                filtered = tickets.filter(t => t.status !== 'Closed');
                break;
            case 'Assigned to me':
                filtered = tickets.filter(t => t.assignedTo === user?.id && t.status !== 'Closed');
                break;
            case 'Unassigned':
                filtered = tickets.filter(t => t.assignedTo === null && t.status !== 'Closed');
                break;
            case 'Closed':
                filtered = tickets.filter(t => t.status === 'Closed');
                break;
            default:
                filtered = tickets;
        }

        // Apply Search Logic
        if (searchTerm && searchTerm.trim()) {
            const lowerTerm = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(lowerTerm) || 
                t.ticketNumber.toLowerCase().includes(lowerTerm) ||
                t.userName.toLowerCase().includes(lowerTerm) ||
                (t.messages && t.messages.length > 0 && t.messages[0].message.toLowerCase().includes(lowerTerm))
            );
        }

        return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [tickets, activeFolder, user, searchTerm]);
    
    return (
        <div className="flex flex-col h-screen w-screen bg-outlook-lightGray overflow-hidden">
            <OutlookHeader onToggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)} />
            <div className="flex flex-1 min-h-0">
                <FolderPane onOpenAgentManager={() => setIsAgentManagerOpen(true)} />
                <div className="flex flex-1 min-w-0 border-r border-outlook-border">
                    <TicketListPane tickets={filteredTickets} loading={loading} error={error} />
                </div>
                <div className="flex-shrink-0 w-full lg:w-1/2 xl:w-3/5 2xl:w-2/3 min-w-0">
                    <ReadingPane ticket={selectedTicket} />
                </div>
            </div>

            {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
            
            {/* Agent Manager Modal Window */}
            {isAgentManagerOpen && <AgentManager onClose={() => setIsAgentManagerOpen(false)} />}
        </div>
    );
};


const OutlookDashboard: React.FC = () => {
    return (
        <TicketProvider>
            <DashboardContent />
        </TicketProvider>
    );
};

export default OutlookDashboard;
