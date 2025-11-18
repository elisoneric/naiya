import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useTicketDispatch, useTicketState } from '../../contexts/TicketContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SearchIcon, PersonIcon, SignOutIcon, ChatBotIcon, SunIcon, MoonIcon } from '../common/Icons';

interface OutlookHeaderProps {
    onToggleChatbot: () => void;
}

const OutlookHeader: React.FC<OutlookHeaderProps> = ({ onToggleChatbot }) => {
  const { user, logout } = useContext(AuthContext);
  const dispatch = useTicketDispatch();
  const { searchTerm } = useTicketState();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-4 h-12 bg-outlook-blue dark:bg-outlook-darkBlue text-white flex-shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">NAI'YA & SAMUIKY Support Ticket</h1>
        <button 
            onClick={onToggleChatbot}
            className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-xs font-medium border border-white/20"
            title="Open AI Assistant"
        >
            <ChatBotIcon className="h-4 w-4" />
            <span>AI Assistant</span>
        </button>
      </div>
      <div className="flex-1 max-w-lg mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <SearchIcon className="h-4 w-4 text-outlook-textSecondary dark:text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => dispatch({ type: 'SEARCH_TICKETS', payload: e.target.value })}
            placeholder="Search tickets..."
            className="w-full bg-white dark:bg-outlook-darkHover dark:text-white dark:placeholder-gray-400 text-gray-900 rounded-sm py-1 pl-9 pr-3 h-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-outlook-blue focus:ring-white placeholder-gray-500 transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-white/10" title="Toggle Theme">
             {theme === 'light' ? <MoonIcon className="h-5 w-5 text-white" /> : <SunIcon className="h-5 w-5 text-white" />}
        </button>
        <div className="flex items-center">
            <div className="p-1.5 bg-white rounded-full">
                <PersonIcon className="h-5 w-5 text-outlook-blue" />
            </div>
          <span className="ml-2 text-sm font-medium">{user?.name}</span>
        </div>
        <button onClick={logout} className="p-2 rounded-full hover:bg-outlook-darkBlue dark:hover:bg-gray-700" aria-label="Sign out">
            <SignOutIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </header>
  );
};

export default OutlookHeader;