import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ticketService } from '../services/ticketService';
import type { User } from '../types';
import AgentUploader from '../components/admin/AgentUploader';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '../components/common/Icons';

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'user' | 'staff'>('user');
  const [loading, setLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  
  // Staff Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [staffError, setStaffError] = useState('');
  
  // User Login State
  const [email, setEmail] = useState('');
  const [userError, setUserError] = useState('');
  
  const handleStaffLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setStaffError('');
      // Minimal delay for UI feedback
      setTimeout(() => {
          if (username === 'itstaff' && password === 'password') {
               const mockStaff: User = {
                  id: 101,
                  name: 'IT Administrator',
                  email: 'admin@livak.esam.com.ng',
                  userType: 'staff',
              };
              login(mockStaff);
          } else {
              setStaffError('Invalid credentials. Default: itstaff / password');
          }
          setLoading(false);
      }, 200);
  };

  const handleUserLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setUserError('');
      ticketService.getUserByEmail(email).then(user => {
          if (user) {
              login(user);
          } else {
              setUserError('Email not found in agent database. Please ask IT to add your email.');
          }
          setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-black flex items-center justify-center p-4 transition-colors duration-200">
      <button 
        onClick={toggleTheme} 
        className="absolute top-6 right-6 p-2 rounded-full bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-600"
        title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
      </button>

      <div className="bg-gray-800 dark:bg-outlook-darkPaper w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-700 dark:border-gray-600">
        <div className="bg-gray-800 dark:bg-outlook-darkPaper border-b border-gray-700 dark:border-gray-600 flex">
            <button
                className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'user' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('user')}
            >
                User Portal
            </button>
            <button
                className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'staff' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('staff')}
            >
                IT Staff
            </button>
        </div>

        <div className="p-8">
            <div className="text-center mb-8">
                 <h2 className="text-2xl font-bold text-white dark:text-outlook-darkText">
                     NAI'YA & SAMUIKY Support Ticket
                 </h2>
                 <p className="text-gray-400 text-sm mt-2">
                     {activeTab === 'user' 
                        ? 'Agent Login' 
                        : 'Secure login for IT Administrators'}
                 </p>
            </div>

            {activeTab === 'user' ? (
                <form onSubmit={handleUserLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white placeholder-gray-400 dark:bg-gray-800 dark:border-gray-500"
                            placeholder="agent@example.com"
                        />
                        {userError && <p className="text-red-400 text-xs mt-2">{userError}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying DB...' : 'Login'}
                    </button>
                    <div className="mt-4 p-3 bg-gray-700 dark:bg-gray-800 rounded text-xs text-gray-300">
                        <p className="font-bold">Dev Note:</p>
                        <p>Allowed emails are stored in local storage. Default allowed: <code>john.doe@example.com</code></p>
                    </div>
                </form>
            ) : (
                 <form onSubmit={handleStaffLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white placeholder-gray-400 dark:bg-gray-800 dark:border-gray-500"
                            placeholder="itstaff"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white placeholder-gray-400 dark:bg-gray-800 dark:border-gray-500"
                            placeholder="••••••••"
                        />
                    </div>
                    {staffError && <p className="text-red-400 text-xs">{staffError}</p>}
                    
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Login'}
                        </button>
                    </div>
                     <button
                        type="button"
                        onClick={() => setShowUploader(true)}
                        className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-white underline"
                    >
                        Update Agent Email Database (CSV)
                    </button>
                </form>
            )}
        </div>
      </div>
      {showUploader && <AgentUploader onClose={() => setShowUploader(false)} />}
    </div>
  );
};

export default Login;