import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { useAuth, ADMIN_USERNAME } from '../firebase/AuthContext';
import { RobotLogo } from './RobotLogo';

interface AdminLoginViewProps {
  onBackToPublic: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onBackToPublic }) => {
  const {
    loginWithAdminMaster,
    loginError,
    clearLoginError,
  } = useAuth();

  // Master key credentials state
  const [masterUsername, setMasterUsername] = useState(ADMIN_USERNAME);
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Master Key Sign In
  const handleMasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterUsername.trim() || !masterPassword) return;

    setIsSubmitting(true);
    if (loginError) clearLoginError();
    try {
      await loginWithAdminMaster(masterUsername.trim(), masterPassword);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#37352f] flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-[#efefed]">
      {/* Top back navigation */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <button
          onClick={onBackToPublic}
          className="px-3 py-1.5 rounded-md bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#787774]" />
          <span>포트폴리오 메인으로 돌아가기</span>
        </button>

        <span className="text-[11px] font-mono text-[#787774] flex items-center gap-1">
          <span>🔒 관리자 전용 인증</span>
        </span>
      </div>

      {/* Main Notion Card */}
      <div className="w-full max-w-md bg-white border border-[#e3e2de] rounded-2xl shadow-sm overflow-hidden">
        {/* Notion Card Header */}
        <div className="px-6 py-5 border-b border-[#e3e2de] bg-[#fbfbfa] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <RobotLogo size={24} />
            <div>
              <h2 className="text-sm font-sans font-bold text-[#37352f] tracking-tight">
                K.F.C.Code Chaser 관리자 접속
              </h2>
              <p className="text-[11px] font-sans text-[#787774]">
                관리자 전용 인증 포털 (/admin)
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#edf6ec] text-emerald-700 border border-[#d2ebd0] font-semibold">
            Admin Only
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Error Alert */}
          {loginError && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{loginError}</div>
            </div>
          )}

          {/* Master Key Admin Form */}
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-[#f7f6f3] border border-[#e3e2de] text-xs font-sans space-y-1">
              <div className="flex items-center gap-1.5 text-[#37352f] font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>관리자 마스터 인증</span>
              </div>
              <p className="text-[11px] text-[#787774] leading-relaxed">
                포트폴리오 콘텐츠 실시간 수정 및 사용자 접속 로그 관리를 위해 인증을 진행해 주세요.
              </p>
            </div>

            <form onSubmit={handleMasterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f]">
                  관리자 계정 ID
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#787774] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={masterUsername}
                    onChange={(e) => setMasterUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#e3e2de] focus:border-[#2383e2] rounded-lg text-xs font-mono text-[#37352f] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f]">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#787774] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-white border border-[#e3e2de] focus:border-[#2383e2] rounded-lg text-xs font-mono text-[#37352f] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#37352f]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !masterUsername.trim() || !masterPassword}
                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#37352f] hover:bg-[#22211e] text-white font-sans font-semibold text-xs tracking-tight flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>관리자 인증 확인 중...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>관리자 모드로 접속</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3 bg-[#fbfbfa] border-t border-[#e3e2de] text-center flex items-center justify-center gap-1.5 text-[11px] font-sans text-[#787774]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>보안 인증 완료 시 콘텐츠 실시간 편집 권한이 부여됩니다</span>
        </div>
      </div>
    </div>
  );
};
