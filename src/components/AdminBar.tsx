import React from 'react';
import { ShieldCheck, ShieldAlert, LogIn, LogOut, RefreshCw, Lock } from 'lucide-react';
import { useAuth, ADMIN_EMAIL } from '../firebase/AuthContext';

export const AdminBar: React.FC = () => {
  const { user, isAdmin, openLoginModal, logOut, syncDefaultData } = useAuth();

  return (
    <div className="w-full bg-[#040914] border-b border-cyan-500/20 px-3 sm:px-6 py-2 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Left Status */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            {isAdmin ? (
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-500/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold">관리자 편집 모드 ({ADMIN_EMAIL})</span>
              </span>
            ) : user ? (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-1.5 text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/40 hover:bg-amber-900/60 cursor-pointer transition-colors"
                title="클릭하여 관리자 계정으로 전환"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>권한 없음 ({user.email}) - 관리자 전용</span>
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-1.5 text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700/80 hover:text-cyan-300 hover:border-cyan-500/40 cursor-pointer transition-colors"
                title="클릭하여 Google 로그인"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400/80" />
                <span>방문자 읽기 모드</span>
              </button>
            )}
          </div>
          <span className="hidden lg:inline text-slate-400 text-[11px]">
            {isAdmin
              ? '각 카테고리(소개, 여정, 수상, 스킬, 프로젝트)의 추가/수정/삭제 가능'
              : `편집 모드는 ${ADMIN_EMAIL} 구글 계정으로 로그인 시 켜집니다.`}
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Sync Default Data to Firebase button (Admin only) */}
          {isAdmin && (
            <button
              onClick={syncDefaultData}
              id="sync-default-data-btn"
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
              title="Firestore에 기본 포트폴리오 데이터 전체 동기화"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">기본 데이터 동기화</span>
            </button>
          )}

          {/* Google Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-300 hidden sm:inline text-[11px]">{user.email || user.displayName}</span>
              <button
                onClick={logOut}
                id="logout-btn"
                className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              id="google-login-btn"
              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all flex items-center gap-1.5 font-bold cursor-pointer"
              title={`구글 계정(${ADMIN_EMAIL})으로 로그인하여 편집 모드 활성화`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google 로그인 (관리자 편집)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

