
import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { User } from '../types';

const ITLogin: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('alice@example.com');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: 101,
        name: 'Alice',
        email: email,
        userType: 'staff',
      };
      login(mockUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center h-full bg-outlook-gray">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <div>
          <h2 className="text-2xl font-bold text-center text-outlook-darkBlue">IT Staff Portal</h2>
          <p className="mt-2 text-center text-sm text-outlook-textSecondary">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-outlook-blue focus:border-outlook-blue focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-outlook-blue hover:bg-outlook-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-outlook-darkBlue disabled:bg-gray-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ITLogin;
