import React, { useState } from 'react';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  X,
  User,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';
import { RobotLogo } from './RobotLogo';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({ isOpen, onClose }) => {
  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginError,
    clearLoginError,
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<'google' | 'email'>('google');
  const [emailMode, setEmailMode] = useState<'signin' | 'signup'>('signin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    if (loginError) clearLoginError();
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setIsSubmitting(true);
    if (loginError) clearLoginError();
    try {
      let ok = false;
      if (emailMode === 'signup') {
        ok = await registerWithEmail(email.trim(), password, displayName.trim());
      } else {
        ok = await loginWithEmail(email.trim(), password);
      }
      if (ok) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="user-login-modal-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          clearLoginError();
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md bg-white border border-[#e3e2de] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e3e2de] bg-[#fbfbfa] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <RobotLogo size={22} />
            <div>
              <h2 className="text-sm font-sans font-bold text-[#37352f] tracking-tight">
                로그인 / 회원가입
              </h2>
              <p className="text-[11px] font-sans text-[#787774]">
                K.F.C.Code Chaser 포트폴리오
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              clearLoginError();
              onClose();
            }}
            className="p-1 rounded-md text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Method Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#f7f6f3] border-b border-[#e3e2de] gap-1 text-xs font-sans">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('google');
              if (loginError) clearLoginError();
            }}
            className={`py-1.5 px-3 rounded-md font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'google'
                ? 'bg-white text-[#37352f] font-semibold shadow-2xs border border-[#e3e2de]'
                : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <span className="font-bold text-red-600">G</span>
            <span>Google 로그인</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              if (loginError) clearLoginError();
            }}
            className={`py-1.5 px-3 rounded-md font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'email'
                ? 'bg-white text-[#37352f] font-semibold shadow-2xs border border-[#e3e2de]'
                : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>이메일 로그인</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {loginError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{loginError}</div>
            </div>
          )}

          {/* GOOGLE LOGIN */}
          {authMethod === 'google' && (
            <div className="space-y-4">
              <p className="text-xs text-[#787774] text-center leading-relaxed">
                Google 계정으로 빠르고 안전하게 로그인할 수 있습니다.
              </p>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#f7f6f3] border border-[#e3e2de] hover:border-[#cfceca] text-[#37352f] font-sans font-semibold text-xs tracking-tight flex items-center justify-center gap-2.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#2383e2]" />
                    <span>Google 로그인 진행 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                      />
                    </svg>
                    <span>Google 계정으로 계속하기</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* EMAIL LOGIN / SIGNUP */}
          {authMethod === 'email' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#e3e2de] pb-2">
                <span className="text-xs font-sans font-semibold text-[#37352f]">
                  {emailMode === 'signin' ? '이메일 로그인' : '새 계정 회원가입'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmailMode(emailMode === 'signin' ? 'signup' : 'signin');
                    if (loginError) clearLoginError();
                  }}
                  className="text-xs text-[#2383e2] hover:underline font-sans cursor-pointer"
                >
                  {emailMode === 'signin' ? '회원가입하기' : '로그인으로 이동'}
                </button>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {emailMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="block text-xs font-sans font-medium text-[#37352f]">
                      이름 또는 닉네임
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="이름 입력"
                      className="w-full px-3 py-1.5 bg-white border border-[#e3e2de] focus:border-[#2383e2] rounded-lg text-xs font-sans text-[#37352f] outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-sans font-medium text-[#37352f]">
                    이메일 주소
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#787774] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#e3e2de] focus:border-[#2383e2] rounded-lg text-xs font-sans text-[#37352f] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-sans font-medium text-[#37352f]">
                    비밀번호
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-[#787774] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호 (6자 이상)"
                      className="w-full pl-8 pr-8 py-1.5 bg-white border border-[#e3e2de] focus:border-[#2383e2] rounded-lg text-xs font-sans text-[#37352f] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#37352f]"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !password}
                  className="w-full mt-2 py-2 px-4 rounded-lg bg-[#2383e2] hover:bg-[#1a6cb8] text-white font-sans font-semibold text-xs tracking-tight flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>처리 중...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>{emailMode === 'signin' ? '로그인' : '회원가입 완료'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
