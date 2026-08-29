import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth, ADMIN_USERNAME } from '../firebase/AuthContext';
import { RobotLogo } from './RobotLogo';

interface AdminLoginViewProps {
  onBackToPublic: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onBackToPublic }) => {
  const { login, loginError, clearLoginError } = useAuth();

  const [username, setUsername] = useState('daniel321');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setIsSubmitting(true);
    try {
      const success = await login(username.trim(), password);
      if (success) {
        // App will automatically re-render into admin mode
      }
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
          <span>🔒 관리자 인증</span>
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
                K.F.C.Code Chaser 관리자 로그인
              </h2>
              <p className="text-[11px] font-mono text-[#787774]">
                콘텐츠 수정 및 데이터 관리 권한 인증
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f1f1ef] text-[#787774] border border-[#e3e2de]">
            /admin
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Preset Helper Card */}
          <div className="p-3.5 rounded-lg bg-[#f7f6f3] border border-[#e3e2de] text-xs font-sans space-y-1">
            <div className="flex items-center gap-1.5 text-[#37352f] font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>관리자 계정 안내</span>
            </div>
            <div className="text-[11px] text-[#787774] flex items-center justify-between pt-1">
              <span>아이디: <strong className="text-[#37352f] font-mono">{ADMIN_USERNAME}</strong></span>
              <span className="text-[#9b9a97]">비밀번호 입력 필요</span>
            </div>
          </div>

          {/* Error Alert */}
          {loginError && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{loginError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-semibold text-[#37352f]">
                관리자 ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787774]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (loginError) clearLoginError();
                  }}
                  placeholder="아이디를 입력하세요 (예: daniel321)"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#e3e2de] focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] rounded-lg text-xs font-mono text-[#37352f] placeholder-[#9b9a97] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-semibold text-[#37352f]">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787774]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) clearLoginError();
                  }}
                  placeholder="비밀번호를 입력하세요 (예: daniel321.123)"
                  className="w-full pl-9 pr-10 py-2 bg-white border border-[#e3e2de] focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] rounded-lg text-xs font-mono text-[#37352f] placeholder-[#9b9a97] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#787774] hover:text-[#37352f] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !username.trim() || !password}
              className="w-full mt-3 py-2.5 px-4 rounded-lg bg-[#2383e2] hover:bg-[#1a6cb8] active:bg-[#155a9c] text-white font-sans font-semibold text-xs tracking-tight flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>인증 확인 중...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>관리자 모드 접속</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3 bg-[#fbfbfa] border-t border-[#e3e2de] text-center">
          <p className="text-[11px] font-mono text-[#787774]">
            ID: <span className="font-semibold text-[#37352f]">daniel321</span> &bull; PW: <span className="font-semibold text-[#37352f]">daniel321.123</span>
          </p>
        </div>
      </div>
    </div>
  );
};
