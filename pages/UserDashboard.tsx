import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { TicketProvider, useTicketDispatch, useTicketState } from '../contexts/TicketContext';
import { ticketService } from '../services/ticketService';
import type { Ticket } from '../types';
import CreateTicketModal from '../components/user/CreateTicketModal';
import UserChat from '../components/user/UserChat';
import { SignOutIcon, ChatBotIcon, SunIcon, MoonIcon } from '../components/common/Icons';
import Chatbot from '../components/chatbot/Chatbot';
import StatusBadge from '../components/common/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

const UserDashboardContent: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const { tickets, selectedTicket, loading } = useTicketState();
    const dispatch = useTicketDispatch();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const fetchTickets = () => {
        if (user) {
            dispatch({ type: 'FETCH_TICKETS_START' });
            ticketService.getTickets(user)
                .then(data => dispatch({ type: 'FETCH_TICKETS_SUCCESS', payload: data }))
                .catch(err => dispatch({ type: 'FETCH_TICKETS_ERROR', payload: 'Failed to fetch tickets' }));
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [user, dispatch]);

    const handleSelectTicket = (ticket: Ticket) => {
        dispatch({ type: 'SELECT_TICKET', payload: ticket });
    };

    return (
        <div className="h-screen w-full bg-gray-50 dark:bg-black flex flex-col transition-colors duration-200">
            {/* Navbar */}
            <nav className="bg-white dark:bg-outlook-darkPaper shadow-sm px-6 py-3 flex justify-between items-center z-20 border-b dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-outlook-blue rounded-lg flex items-center justify-center text-white font-bold">N</div>
                        <span className="font-semibold text-gray-800 dark:text-white text-lg">NAI'YA & SAMUIKY Support Ticket</span>
                    </div>
                    <button 
                        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 text-outlook-blue dark:text-blue-300 rounded-full transition-colors text-sm font-medium"
                    >
                        <ChatBotIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">AI Assistant</span>
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300">
                         {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                    </button>
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <button 
                        onClick={logout} 
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
                        title="Sign Out"
                    >
                        <SignOutIcon className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-4 gap-4">
                {/* Ticket List */}
                <div className={`${selectedTicket ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 lg:w-1/4 flex-col bg-white dark:bg-outlook-darkPaper rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors`}>
                    <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="font-bold text-gray-800 dark:text-white">My Tickets</h2>
                        <span className="bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium">{tickets.length}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">Loading...</div>
                        ) : tickets.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                No tickets yet.<br/>Create one to get started!
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {tickets.map(ticket => (
                                    <div 
                                        key={ticket.id}
                                        onClick={() => handleSelectTicket(ticket)}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-outlook-darkHover cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-blue-50 dark:bg-outlook-darkSelected border-l-4 border-outlook-blue' : 'border-l-4 border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 line-clamp-1">{ticket.title}</p>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">#{ticket.ticketNumber}</span>
                                            <StatusBadge status={ticket.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-50 dark:border-gray-700">
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-full bg-outlook-blue text-white py-2.5 rounded-lg font-medium hover:bg-outlook-darkBlue transition-colors shadow-sm"
                        >
                            + Create New Ticket
                        </button>
                    </div>
                </div>

                {/* Ticket Detail / Chat */}
                <div className={`${selectedTicket ? 'flex' : 'hidden md:flex'} w-full md:w-2/3 lg:w-3/4 bg-white dark:bg-outlook-darkPaper rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex-col relative transition-colors`}>
                    {selectedTicket ? (
                        <>
                            {/* Mobile Back Button */}
                            <div className="md:hidden absolute top-4 left-4 z-20">
                                <button onClick={() => dispatch({ type: 'SELECT_TICKET', payload: null })} className="p-2 bg-white dark:bg-gray-700 rounded-full shadow text-gray-600 dark:text-white">
                                    ← Back
                                </button>
                            </div>
                            <UserChat ticket={selectedTicket} />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 transition-colors">
                                <span className="text-3xl">🎫</span>
                            </div>
                            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Select a ticket to view</p>
                            <p className="text-sm mt-1">or create a new one to get support</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <CreateTicketModal 
                    onClose={() => setIsCreateModalOpen(false)} 
                    onTicketCreated={fetchTickets}
                />
            )}
            
            {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
        </div>
    );
};

const UserDashboard: React.FC = () => {
    return (
        <TicketProvider>
            <UserDashboardContent />
        </TicketProvider>
    );
};

export default UserDashboard;