import React, { useState } from 'react';
import { ShieldCheck, LogOut, Lock, Users, Sparkles, Eye, UserCheck, Mail } from 'lucide-react';
import { useAuth, ADMIN_USERNAME } from '../firebase/AuthContext';
import { useToast } from './Toast';
import { useLanguage } from '../context/ThemeContext';

interface AdminBarProps {
  onViewPublic?: () => void;
  onOpenUsersView?: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({ onViewPublic, onOpenUsersView }) => {
  const { adminUser, currentUser, userProfile, logout } = useAuth();
  const { showToast } = useToast();
  const { lang, t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    showToast(
      lang === 'en' ? 'Logged out from session.' : '계정에서 로그아웃되었습니다.',
      'info',
      lang === 'en' ? 'Logout' : '로그아웃'
    );
    if (onViewPublic) onViewPublic();
  };

  const displayName =
    currentUser?.displayName || userProfile?.displayName || adminUser?.username || ADMIN_USERNAME;
  const displayEmail = currentUser?.email || userProfile?.email || adminUser?.email;

  return (
    <div className="w-full px-4 sm:px-8 py-2.5 text-xs font-sans bg-[#f7f6f3] border-b border-[#e3e2de] text-[#37352f]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Admin Status Indicator */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#edf6ec] text-[#2c6e3b] border border-[#d2ebd0] font-semibold text-xs shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('admin.activeMode', '관리자 모드 활성화됨')}</span>
            <span className="text-[11px] font-mono text-[#437d50]">({displayName})</span>
          </div>

          {displayEmail && (
            <span className="text-[11px] font-mono text-[#787774] flex items-center gap-1">
              <Mail className="w-3 h-3 text-[#9b9a97]" />
              <span>{displayEmail}</span>
            </span>
          )}

          <span className="hidden md:inline text-[#787774] text-xs">
            • {t('admin.desc', '포트폴리오 내용 실시간 편집 및 사용자 접속 기록 조회가 가능합니다.')}
          </span>
        </div>

        {/* Right: Controls (Users Log View + Public View + Logout) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* User Logins & Audit Trail Button */}
          {onOpenUsersView && (
            <button
              onClick={onOpenUsersView}
              id="admin-open-users-btn"
              className="px-3 py-1.5 rounded-md bg-white hover:bg-[#edf6ec] border border-[#e3e2de] hover:border-[#d2ebd0] text-[#37352f] hover:text-emerald-800 font-sans font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="View all registered users and real-time login logs"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>👥 로그인 사용자 & 접속 기록</span>
            </button>
          )}

          {onViewPublic && (
            <button
              onClick={onViewPublic}
              className="px-2.5 py-1.5 rounded-md bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#787774] hover:text-[#37352f] font-sans font-medium text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>방문자 모드로 전환</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            id="admin-logout-btn"
            className="px-2.5 py-1.5 rounded-md bg-white hover:bg-rose-50 border border-[#e3e2de] hover:border-rose-200 text-[#787774] hover:text-rose-600 font-sans font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="End Admin Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('admin.logout', '로그아웃')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
