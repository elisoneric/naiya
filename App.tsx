import React, { useState, useCallback } from 'react';
import Login from './pages/Login';
import OutlookDashboard from './pages/OutlookDashboard';
import UserDashboard from './pages/UserDashboard';
import { AuthContext } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import type { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <ThemeProvider>
        <ToastProvider>
            <AuthContext.Provider value={{ user, login, logout }}>
            <div className="h-screen w-screen font-sans transition-colors duration-200">
                {!user ? (
                <Login />
                ) : user.userType === 'staff' ? (
                <OutlookDashboard />
                ) : (
                <UserDashboard />
                )}
            </div>
            </AuthContext.Provider>
        </ToastProvider>
    </ThemeProvider>
  );
};

export default App;