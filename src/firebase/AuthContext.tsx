import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signInWithCredential, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, googleProvider, testFirestoreConnection } from './config';
import { seedAllPortfolioData } from './firestoreService';

export const ADMIN_EMAIL = 'pompeii928@gmail.com';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signInWithGoogleCredential: (idToken: string) => Promise<boolean>;
  logOut: () => Promise<void>;
  loading: boolean;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  syncDefaultData: () => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  signInWithGoogle: async () => false,
  signInWithGoogleCredential: async () => false,
  logOut: async () => {},
  loading: true,
  authError: null,
  setAuthError: () => {},
  syncDefaultData: async () => {},
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSuccessfulUser = (email: string | null | undefined): boolean => {
    const userEmail = (email || '').toLowerCase().trim();
    if (userEmail === ADMIN_EMAIL.toLowerCase()) {
      setAuthError(null);
      setIsLoginModalOpen(false);
      return true;
    } else {
      setAuthError(
        `로그인된 계정 (${userEmail || '이메일 없음'})은 관리자(${ADMIN_EMAIL})가 아닙니다.\n편집 모드는 ${ADMIN_EMAIL} 계정으로 로그인할 때만 활성화됩니다.`
      );
      return false;
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return handleSuccessfulUser(result.user?.email);
    } catch (err: any) {
      console.error('Google Sign-In popup error:', err);
      let msg = err.message || 'Google 로그인 중 오류가 발생했습니다.';
      if (err?.code === 'auth/popup-blocked') {
        msg = '브라우저 팝업이 차단되었습니다. 팝업을 허용하거나 아래의 구글 원클릭 버튼을 이용해 주세요.';
      } else if (err?.code === 'auth/popup-closed-by-user') {
        msg = '로그인 팝업 창이 닫혔습니다. 다시 시도해 주세요.';
      } else if (err?.code === 'auth/cancelled-popup-request') {
        msg = '이전 로그인 요청이 진행 중입니다.';
      }
      setAuthError(msg);
      return false;
    }
  };

  const signInWithGoogleCredential = async (idToken: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      return handleSuccessfulUser(result.user?.email);
    } catch (err: any) {
      console.error('Google credential sign-in error:', err);
      setAuthError(err.message || 'Google 자격 증명 로그인 중 오류가 발생했습니다.');
      return false;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setAuthError(null);
    } catch (err) {
      console.error('Sign Out failed:', err);
    }
  };

  const syncDefaultData = async () => {
    try {
      await seedAllPortfolioData();
      alert('기본 포트폴리오 데이터가 Firestore에 성공적으로 동기화되었습니다!');
    } catch (err: any) {
      alert(`데이터 동기화 실패: ${err.message}`);
    }
  };

  const isAdmin = !!user && (user.email || '').toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();

  const openLoginModal = () => {
    setAuthError(null);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        signInWithGoogle,
        signInWithGoogleCredential,
        logOut,
        loading,
        authError,
        setAuthError,
        syncDefaultData,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

