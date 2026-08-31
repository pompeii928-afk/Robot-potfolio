import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, testFirestoreConnection } from './config';
import { seedAllPortfolioData, recordUserLogin } from './firestoreService';
import { UserProfile } from '../types';

export const ADMIN_USERNAME = 'daniel321';
export const ADMIN_EMAIL = 'pompeii928@gmail.com';

interface AdminUser {
  username: string;
  email?: string;
  role: 'admin';
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  loginError: string | null;
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<boolean>;
  loginWithAdminMaster: (username: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  syncDefaultData: () => Promise<void>;
  clearLoginError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  isAdmin: false,
  adminUser: null,
  loading: true,
  loginError: null,
  loginWithGoogle: async () => false,
  loginWithEmail: async () => false,
  registerWithEmail: async () => false,
  loginWithAdminMaster: async () => false,
  logout: async () => {},
  syncDefaultData: async () => {},
  clearLoginError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check master admin session token on load
  const verifyMasterSession = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('admin_token');
      if (!storedToken) return false;

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
            return true;
          }
        }
      } catch {
        // Fallback for static hosts
      }

      // Check stored local token format
      if (storedToken.startsWith('local_admin_')) {
        const payload = JSON.parse(atob(storedToken.replace('local_admin_', '')));
        if (payload.username === ADMIN_USERNAME && payload.exp > Date.now()) {
          setIsAdmin(true);
          setAdminUser({ username: ADMIN_USERNAME, role: 'admin' });
          return true;
        }
      }
    } catch (err) {
      console.warn('[Auth] Master session verify error:', err);
    }
    return false;
  }, []);

  // Firebase Auth State Listener
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user && user.email) {
        try {
          const profile = await recordUserLogin({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || '',
            providerId: user.providerData?.[0]?.providerId || 'google.com',
          });
          setUserProfile(profile);

          // Check if admin email or admin role
          const isUserAdmin =
            profile.role === 'admin' ||
            user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
            user.email.toLowerCase().includes('pompeii');

          if (isUserAdmin) {
            setIsAdmin(true);
            setAdminUser({
              username: profile.displayName || user.email.split('@')[0],
              email: user.email,
              role: 'admin',
            });
          }
        } catch (err) {
          console.error('[Auth] Failed to sync user profile:', err);
        }
      } else {
        setUserProfile(null);
        // If not logged in via Firebase, check if master admin session exists
        const hasMasterAdmin = await verifyMasterSession();
        if (!hasMasterAdmin) {
          setIsAdmin(false);
          setAdminUser(null);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [verifyMasterSession]);

  // Google Login (Real Gmail accounts)
  const loginWithGoogle = async (): Promise<boolean> => {
    setLoginError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user && result.user.email) {
        const profile = await recordUserLogin({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || result.user.email.split('@')[0],
          photoURL: result.user.photoURL || '',
          providerId: 'google.com',
        });
        setUserProfile(profile);

        const isUserAdmin =
          profile.role === 'admin' ||
          result.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        if (isUserAdmin) {
          setIsAdmin(true);
          setAdminUser({
            username: profile.displayName,
            email: result.user.email,
            role: 'admin',
          });
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('[Auth] Google sign in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setLoginError('Google 로그인 창이 닫혔습니다.');
      } else if (err.code === 'auth/popup-blocked') {
        setLoginError('브라우저에서 팝업이 차단되었습니다. 팝업을 허용해주세요.');
      } else if (err.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'robot-potfolio.vercel.app';
        setLoginError(
          `현재 도메인(${domain})이 Firebase OAuth 승인 도메인에 등록되지 않았습니다. 상단 '이메일 로그인' 탭을 이용하시거나, 관리자이신 경우 주소창에 /admin 을 입력하여 관리자 전용 마스터 키(daniel321)로 바로 접속하실 수 있습니다.`
        );
      } else {
        setLoginError(err.message || 'Google 계정 로그인에 실패했습니다.');
      }
      return false;
    }
  };

  // Real Email & Password Login
  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setLoginError(null);
    const cleanEmail = email.trim().toLowerCase();
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred.user && cred.user.email) {
        const profile = await recordUserLogin({
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || cleanEmail.split('@')[0],
          photoURL: cred.user.photoURL || '',
          providerId: 'password',
        });
        setUserProfile(profile);

        const isUserAdmin =
          profile.role === 'admin' || cleanEmail === ADMIN_EMAIL.toLowerCase();

        if (isUserAdmin) {
          setIsAdmin(true);
          setAdminUser({
            username: profile.displayName,
            email: cred.user.email,
            role: 'admin',
          });
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('[Auth] Email login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setLoginError('등록되지 않은 이메일이거나 비밀번호가 일치하지 않습니다.');
      } else if (err.code === 'auth/invalid-email') {
        setLoginError('올바른 이메일 주소 형식이 아닙니다.');
      } else {
        setLoginError(err.message || '이메일 로그인 중 오류가 발생했습니다.');
      }
      return false;
    }
  };

  // Real Email & Password Registration
  const registerWithEmail = async (email: string, pass: string, name: string): Promise<boolean> => {
    setLoginError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred.user) {
        if (cleanName) {
          await updateProfile(cred.user, { displayName: cleanName });
        }
        const profile = await recordUserLogin({
          uid: cred.user.uid,
          email: cleanEmail,
          displayName: cleanName || cleanEmail.split('@')[0],
          photoURL: '',
          providerId: 'password',
        });
        setUserProfile(profile);

        const isUserAdmin =
          profile.role === 'admin' || cleanEmail === ADMIN_EMAIL.toLowerCase();

        if (isUserAdmin) {
          setIsAdmin(true);
          setAdminUser({
            username: profile.displayName,
            email: cleanEmail,
            role: 'admin',
          });
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('[Auth] Email register error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setLoginError('이미 가입된 이메일 주소입니다. 로그인해주세요.');
      } else if (err.code === 'auth/weak-password') {
        setLoginError('비밀번호는 최소 6자 이상이어야 합니다.');
      } else if (err.code === 'auth/invalid-email') {
        setLoginError('유효하지 않은 이메일 형식입니다.');
      } else {
        setLoginError(err.message || '회원가입 처리 중 오류가 발생했습니다.');
      }
      return false;
    }
  };

  // Master Admin (daniel321) Login
  const loginWithAdminMaster = async (username: string, pass: string): Promise<boolean> => {
    setLoginError(null);
    const cleanUsername = username.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password: pass }),
      });

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
    } catch {
      // Fallback
    }

    // Static fallback
    if (cleanUsername === ADMIN_USERNAME && pass === 'daniel321.123') {
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
      setLoginError('관리자 아이디 또는 비밀번호가 올바르지 않습니다.');
      return false;
    }
  };

  // Global Logout
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('[Auth] Firebase sign out error:', err);
    }

    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore
    }

    localStorage.removeItem('admin_token');
    setCurrentUser(null);
    setUserProfile(null);
    setIsAdmin(false);
    setAdminUser(null);
    setLoginError(null);
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
        currentUser,
        userProfile,
        isAdmin,
        adminUser,
        loading,
        loginError,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginWithAdminMaster,
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
