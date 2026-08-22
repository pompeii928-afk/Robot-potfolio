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

  // Verify server-side session token on load
  const verifySession = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('admin_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }

      const res = await fetch('/api/admin/verify', {
        method: 'GET',
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAdmin(true);
          setAdminUser(data.user);
          return;
        }
      }
      // If not authenticated
      setIsAdmin(false);
      setAdminUser(null);
    } catch (err) {
      console.warn('[Auth] Session check fallback:', err);
      // Check localStorage fallback if offline
      const storedToken = localStorage.getItem('admin_token');
      if (storedToken) {
        setIsAdmin(true);
        setAdminUser({ username: ADMIN_USERNAME, role: 'admin' });
      } else {
        setIsAdmin(false);
        setAdminUser(null);
      }
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
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errMsg = data.error || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.';
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
    } catch (err: any) {
      console.error('[Auth] Login error:', err);
      setLoginError('서버와의 통신에 실패했습니다. 네트워크 상태를 확인해 주세요.');
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
