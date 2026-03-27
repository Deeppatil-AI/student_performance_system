import { createContext, useContext, useState, useEffect } from 'react';
import api from './index';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // Use dashboard or a dedicated /api/me endpoint to check session
      const response = await api.get('/dashboard');
      setUser(response.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    // We can call /logout on backend if needed, or just clear local state
    // For Flask-Login, we should call /logout to clear session cookie
    try {
      await api.get('/logout'); // Assuming /logout exists and works with sessions
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
