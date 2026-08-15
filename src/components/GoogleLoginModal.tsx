import React, { useEffect, useRef, useState } from 'react';
import { X, Lock, ExternalLink, AlertTriangle, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { useAuth, ADMIN_EMAIL } from '../firebase/AuthContext';
import firebaseConfig from '../../firebase-applet-config.json';

export const GoogleLoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    signInWithGoogle,
    signInWithGoogleCredential,
    authError,
    setAuthError,
    user,
    isAdmin,
  } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const gsiContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Google Identity Services (GSI) button if available
  useEffect(() => {
    if (!isLoginModalOpen) return;

    const initGsi = () => {
      const googleObj = (window as any).google;
      if (googleObj?.accounts?.id) {
        try {
          googleObj.accounts.id.initialize({
            client_id: firebaseConfig.oAuthClientId,
            callback: async (response: any) => {
              if (response?.credential) {
                setIsLoading(true);
                try {
                  await signInWithGoogleCredential(response.credential);
                } finally {
                  setIsLoading(false);
                }
              }
            },
            auto_select: false,
          });

          if (gsiContainerRef.current) {
            gsiContainerRef.current.innerHTML = '';
            googleObj.accounts.id.renderButton(gsiContainerRef.current, {
              type: 'standard',
              theme: 'filled_blue',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 320,
            });
          }
        } catch (e) {
          console.warn('GSI init notice:', e);
        }
      }
    };

    // Retry if script loading asynchronously
    initGsi();
    const timer = setTimeout(initGsi, 500);
    return () => clearTimeout(timer);
  }, [isLoginModalOpen, signInWithGoogleCredential]);

  if (!isLoginModalOpen) return null;

  const handlePopupSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div
      onClick={closeLoginModal}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
    >
      <div
        className="relative w-full max-w-md bg-[#081224] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-[#060c18]">
          <div className="flex items-center gap-2 text-cyan-300 font-display font-bold text-base">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>관리자 Google 로그인</span>
          </div>
          <button
            onClick={closeLoginModal}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Target Email Info */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono">
            <div className="text-slate-400 mb-1">지정된 관리자 계정:</div>
            <div className="text-cyan-300 font-bold flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{ADMIN_EMAIL}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              포트폴리오의 각 카테고리(소개, 여정, 수상, 스킬, 프로젝트)를 편집하려면 위 Google 계정으로 로그인해야 합니다.
            </div>
          </div>

          {/* Current login state if logged in as another account */}
          {user && !isAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>권한이 없는 계정으로 로그인됨</span>
              </div>
              <p className="text-[11px] text-slate-300">
                현재 로그인된 계정: <span className="text-white font-bold">{user.email}</span>
              </p>
              <p className="text-[11px] text-amber-300">
                {ADMIN_EMAIL} 계정으로 다시 로그인해 주세요.
              </p>
            </div>
          )}

          {/* Error Message */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-mono whitespace-pre-line leading-relaxed">
              {authError}
            </div>
          )}

          {/* Action 1: Google Popup Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handlePopupSignIn}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
                  <span>Google 인증 진행 중...</span>
                </>
              ) : (
                <>
                  {/* Google G Logo SVG */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="font-semibold">Google 계정으로 로그인</span>
                </>
              )}
            </button>

            {/* Rendered Google Identity Services Button if ready */}
            <div className="flex justify-center" ref={gsiContainerRef} />
          </div>

          {/* Iframe Helper Notice & New Tab button */}
          <div className="pt-3 border-t border-cyan-500/20 text-center space-y-2">
            <div className="text-[11px] text-slate-400 font-mono">
              미리보기 창에서 Google 팝업이 차단되거나 응답이 없다면 새 탭에서 열어 로그인하세요.
            </div>
            <button
              onClick={handleOpenNewTab}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>새 창에서 전체 화면으로 열기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
