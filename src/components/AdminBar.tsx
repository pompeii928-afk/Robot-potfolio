import React from 'react';
import { ShieldCheck, LogOut, RefreshCw, Eye } from 'lucide-react';
import { useAuth, ADMIN_USERNAME } from '../firebase/AuthContext';
import { useToast } from './Toast';
import { useTheme, useLanguage } from '../context/ThemeContext';

interface AdminBarProps {
  onViewPublic?: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({ onViewPublic }) => {
  const { adminUser, logout, syncDefaultData } = useAuth();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const { lang, t } = useLanguage();

  const handleSyncData = async () => {
    try {
      await syncDefaultData();
      showToast(
        lang === 'en'
          ? 'Default portfolio data successfully synced to Firestore!'
          : '기본 포트폴리오 데이터가 Firestore에 성공적으로 동기화되었습니다!',
        'success',
        lang === 'en' ? 'Sync Completed' : '동기화 완료'
      );
    } catch (err: any) {
      showToast(`데이터 동기화 실패: ${err.message}`, 'error', '동기화 오류');
    }
  };

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
    <div
      className={`w-full px-3 sm:px-6 py-2.5 text-xs font-mono border-b shadow-md transition-colors ${
        theme === 'light'
          ? 'bg-slate-900 border-slate-700 text-slate-200 shadow-md'
          : 'bg-[#040914] border-cyan-500/30 text-slate-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Left: Admin Status Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">{t('admin.activeMode')}</span>
            <span className="text-[11px] text-emerald-200/80">({adminUser?.username || ADMIN_USERNAME})</span>
          </div>

          <span className="hidden lg:inline text-slate-400 text-[11px]">
            • {t('admin.desc')}
          </span>
        </div>

        {/* Right: Controls (View Public, Sync, Logout) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Switch to Public View */}
          {onViewPublic && (
            <button
              onClick={onViewPublic}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              title="Switch to Public View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('admin.viewPublic')}</span>
            </button>
          )}

          {/* Sync Default Data */}
          <button
            onClick={handleSyncData}
            id="sync-default-data-btn"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            title="Reset to Default Data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t('admin.syncDefault')}</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            id="admin-logout-btn"
            className="px-3 py-1 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.15)] transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold"
            title="End Admin Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('admin.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
