import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { testFirestoreConnection } from './config';
import { seedAllPortfolioData } from './firestoreService';

export const ADMIN_USERNAME = 'daniel321';

interface AdminUser {
  username: string;
  role: 'admin';
}

interface AuthContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  loginError: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  syncDefaultData: () => Promise<void>;
  clearLoginError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  adminUser: null,
  loading: true,
  loginError: null,
  login: async () => false,
  logout: async () => {},
  syncDefaultData: async () => {},
  clearLoginError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Verify server-side session token on load with static Vercel fallback
  const verifySession = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('admin_token');
      if (!storedToken) {
        setIsAdmin(false);
        setAdminUser(null);
        setLoading(false);
        return;
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      headers['Authorization'] = `Bearer ${storedToken}`;

      try {
        const res = await fetch('/api/admin/verify', {
          method: 'GET',
          headers,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setIsAdmin(true);
            setAdminUser(data.user);
            setLoading(false);
            return;
          } else {
            // Server explicitly said not authenticated
            localStorage.removeItem('admin_token');
            setIsAdmin(false);
            setAdminUser(null);
            setLoading(false);
            return;
          }
        }
      } catch (networkErr) {
        // Fallback for static hosts or offline
      }

      // Check stored token validity fallback
      try {
        if (storedToken.startsWith('local_admin_')) {
          const payload = JSON.parse(atob(storedToken.replace('local_admin_', '')));
          if (payload.username === ADMIN_USERNAME && payload.exp > Date.now()) {
            setIsAdmin(true);
            setAdminUser({ username: ADMIN_USERNAME, role: 'admin' });
            setLoading(false);
            return;
          }
        }
      } catch {
        // Invalid token format
      }

      // If token is invalid or expired, clear it
      localStorage.removeItem('admin_token');
      setIsAdmin(false);
      setAdminUser(null);
    } catch (err) {
      console.warn('[Auth] Session check fallback:', err);
      setIsAdmin(false);
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    testFirestoreConnection();
    verifySession();
  }, [verifySession]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoginError(null);
    const cleanUsername = username.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password }),
      });

      // If server API route is available and returned a response
      if (res.status !== 404) {
        const data = await res.json();

        if (!res.ok || !data.success) {
          const errMsg = data.error || '아이디 또는 비밀번호가 올바르지 않습니다.';
          setLoginError(errMsg);
          return false;
        }

        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }

        setIsAdmin(true);
        setAdminUser(data.user || { username: ADMIN_USERNAME, role: 'admin' });
        setLoginError(null);
        return true;
      }
    } catch (err: any) {
      console.warn('[Auth] Server API unavailable, using fallback verification:', err);
    }

    // Static Hosting Fallback (e.g. Vercel static deployment)
    if (cleanUsername === ADMIN_USERNAME && password === 'daniel321.123') {
      const tokenPayload = {
        username: ADMIN_USERNAME,
        role: 'admin',
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      const localToken = `local_admin_${btoa(JSON.stringify(tokenPayload))}`;
      localStorage.setItem('admin_token', localToken);

      setIsAdmin(true);
      setAdminUser({ username: ADMIN_USERNAME, role: 'admin' });
      setLoginError(null);
      return true;
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.warn('[Auth] Logout API call error:', err);
    } finally {
      localStorage.removeItem('admin_token');
      setIsAdmin(false);
      setAdminUser(null);
      setLoginError(null);
    }
  };

  const syncDefaultData = async () => {
    try {
      await seedAllPortfolioData();
    } catch (err: any) {
      console.error('Data sync failed:', err);
      throw err;
    }
  };

  const clearLoginError = () => setLoginError(null);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        adminUser,
        loading,
        loginError,
        login,
        logout,
        syncDefaultData,
        clearLoginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
