import React from 'react';
import { ShieldCheck, LogOut, Lock } from 'lucide-react';
import { useAuth, ADMIN_USERNAME } from '../firebase/AuthContext';
import { useToast } from './Toast';
import { useLanguage } from '../context/ThemeContext';

interface AdminBarProps {
  onViewPublic?: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({ onViewPublic }) => {
  const { adminUser, logout } = useAuth();
  const { showToast } = useToast();
  const { lang, t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    showToast(
      lang === 'en' ? 'Logged out from Admin session.' : '관리자 계정에서 로그아웃되었습니다.',
      'info',
      lang === 'en' ? 'Logout' : '로그아웃'
    );
    if (onViewPublic) onViewPublic();
  };

  return (
    <div className="w-full px-4 sm:px-8 py-2.5 text-xs font-sans bg-[#f7f6f3] border-b border-[#e3e2de] text-[#37352f]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Admin Status Indicator */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#edf6ec] text-[#2c6e3b] border border-[#d2ebd0] font-semibold text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('admin.activeMode', '관리자 모드 활성화됨')}</span>
            <span className="text-[11px] font-mono text-[#437d50]">({adminUser?.username || ADMIN_USERNAME})</span>
          </div>

          <span className="hidden sm:inline text-[#787774] text-xs">
            • {t('admin.desc', '각 항목의 추가/수정/삭제 버튼을 이용해 포트폴리오를 직접 편집할 수 있습니다.')}
          </span>
        </div>

        {/* Right: Controls (Logout) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            id="admin-logout-btn"
            className="px-2.5 py-1 rounded-md bg-white hover:bg-rose-50 border border-[#e3e2de] hover:border-rose-200 text-[#787774] hover:text-rose-600 font-sans font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="End Admin Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('admin.logout', '관리자 로그아웃')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
