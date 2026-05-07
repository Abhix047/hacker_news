import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, loginUser, registerUser } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user from stored token on app mount
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('hn_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await getMe();
      setUser(data.user);
      setBookmarks(data.user.bookmarks.map((b) => (typeof b === 'object' ? b._id : b)));
    } catch {
      localStorage.removeItem('hn_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem('hn_token', data.token);
    setUser(data.user);
    setBookmarks([]);
    await loadUser();
    return data;
  };

  const register = async (username, email, password) => {
    const { data } = await registerUser({ username, email, password });
    localStorage.setItem('hn_token', data.token);
    setUser(data.user);
    setBookmarks([]);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('hn_token');
    setUser(null);
    setBookmarks([]);
  };

  const updateBookmarks = (newBookmarks) => {
    setBookmarks(newBookmarks.map((b) => (typeof b === 'object' ? b._id : b)));
  };

  const isBookmarked = (storyId) => bookmarks.includes(storyId);

  return (
    <AuthContext.Provider value={{ user, loading, bookmarks, login, register, logout, updateBookmarks, isBookmarked }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
