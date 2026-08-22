import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2, KeyRound, Terminal, AlertCircle } from 'lucide-react';
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
        // Will automatically switch view because isAdmin becomes true
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040814] bg-blueprint-grid text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-cyan-500 selection:text-black overflow-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-950/30 via-slate-950/80 to-[#02050c]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Public Site Button */}
      <div className="relative z-10 w-full max-w-md mb-6 flex justify-between items-center">
        <button
          onClick={onBackToPublic}
          className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>공개 포트폴리오로 돌아가기</span>
        </button>

        <span className="text-[11px] font-mono text-cyan-400/70 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5" />
          <span>PORTAL_V2.0</span>
        </span>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#070e1e]/90 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">
        {/* Terminal Header Bar */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-[#050a16] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-pulse" />
            <span className="font-mono text-xs font-bold text-cyan-300 tracking-wider">
              ADMIN CONTROL ACCESS
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">/admin</span>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.3)] mb-1">
              <RobotLogo size={42} />
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-white tracking-wide">
              관리자 시스템 인증
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              K.F.C.Code Chaser 포트폴리오 관리자 계정으로 로그인해 주세요.
            </p>
          </div>

          {/* Preset Helper Card */}
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/25 text-xs font-mono space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>지정된 관리자 계정</span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center justify-between">
              <span>관리자 ID: <strong className="text-white font-mono">{ADMIN_USERNAME}</strong></span>
              <span className="text-cyan-400 text-[10px]">보안 해시 암호화</span>
            </div>
          </div>

          {/* Error Alert */}
          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-mono flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{loginError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-slate-300">
                관리자 ID (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-cyan-400/80" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (loginError) clearLoginError();
                  }}
                  placeholder="아이디를 입력하세요"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-cyan-500/30 focus:border-cyan-400 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-slate-300">
                비밀번호 (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 text-cyan-400/80" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) clearLoginError();
                  }}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-10 pr-11 py-2.5 bg-black/60 border border-cyan-500/30 focus:border-cyan-400 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !username.trim() || !password}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>서버 인증 검증 중...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-black" />
                  <span>관리자 로그인</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3.5 bg-[#040814] border-t border-cyan-500/15 text-center">
          <p className="text-[11px] font-mono text-slate-500">
            인증 처리는 서버 측에서 bcrypt 해시 검증 및 암호화 JWT 세션으로 안전하게 보호됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};
