import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  ShieldCheck,
  Search,
  RefreshCw,
  LogIn,
  Laptop,
  Download,
  Mail,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, LoginLog } from '../types';
import {
  subscribeAllUsers,
  subscribeLoginLogs,
  deleteLoginLog,
  clearAllLoginLogs,
  deleteUserProfile,
} from '../firebase/firestoreService';
import { useLanguage } from '../context/ThemeContext';
import { useToast } from './Toast';

interface AdminUsersViewProps {
  onClose?: () => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ onClose }) => {
  const { lang, t } = useLanguage();
  const { showToast } = useToast();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('logs'); // Default to logs for quick management
  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState<'ALL' | 'google.com' | 'password'>('ALL');
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Subscribe to real-time users collection
    const unsubUsers = subscribeAllUsers(
      (userList) => {
        setUsers(userList);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to load users:', err);
        setLoading(false);
      }
    );

    // Subscribe to real-time login audit logs
    const unsubLogs = subscribeLoginLogs(
      (logList) => {
        setLogs(logList);
      },
      (err) => {
        console.error('Failed to load login logs:', err);
      }
    );

    return () => {
      unsubUsers();
      unsubLogs();
    };
  }, []);

  // Format date helper
  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getRelativeTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const diffMs = Date.now() - d.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);

      if (diffMin < 1) return lang === 'ko' ? '방금 전' : 'Just now';
      if (diffMin < 60) return lang === 'ko' ? `${diffMin}분 전` : `${diffMin}m ago`;
      if (diffHr < 24) return lang === 'ko' ? `${diffHr}시간 전` : `${diffHr}h ago`;
      return lang === 'ko' ? `${diffDay}일 전` : `${diffDay}d ago`;
    } catch {
      return '';
    }
  };

  // Delete Single Login Log
  const handleDeleteLog = async (logId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteLoginLog(logId);
      showToast('접속 기록이 삭제되었습니다.', 'success');
    } catch (err) {
      console.error(err);
      showToast('접속 기록 삭제 중 오류가 발생했습니다.', 'error');
    }
  };

  // Clear All Login Logs
  const handleClearAllLogs = async () => {
    setIsDeleting(true);
    try {
      const count = await clearAllLoginLogs();
      setConfirmClearAll(false);
      showToast(`총 ${count}개의 접속 기록이 모두 삭제되었습니다.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('전체 기록 삭제 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete Single User
  const handleDeleteUser = async (uid: string, email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`정말로 사용자 [${email}] 기록을 삭제하시겠습니까?`)) {
      return;
    }
    try {
      await deleteUserProfile(uid);
      showToast('사용자 기록이 삭제되었습니다.', 'success');
    } catch (err) {
      console.error(err);
      showToast('사용자 삭제 중 오류가 발생했습니다.', 'error');
    }
  };

  // Metrics
  const totalUsersCount = users.length;
  const googleUsersCount = users.filter((u) => u.providerId === 'google.com').length;
  const totalLoginsCount = logs.length;
  const recent24hLogins = logs.filter((l) => {
    const diff = Date.now() - new Date(l.timestamp).getTime();
    return diff <= 24 * 60 * 60 * 1000;
  }).length;

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchProvider = providerFilter === 'ALL' || u.providerId === providerFilter;
    return matchSearch && matchProvider;
  });

  // Filtered Logs
  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.displayName && l.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchProvider = providerFilter === 'ALL' || l.providerId === providerFilter;
    return matchSearch && matchProvider;
  });

  // Export CSV
  const handleExportCSV = () => {
    if (activeTab === 'users') {
      const headers = ['UID,Email,DisplayName,Provider,Role,LoginCount,LastLoginAt,CreatedAt'];
      const rows = users.map(
        (u) =>
          `"${u.uid}","${u.email}","${u.displayName || ''}","${u.providerId}","${u.role}",${u.loginCount},"${u.lastLoginAt}","${u.createdAt}"`
      );
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `kfc_users_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('사용자 목록이 CSV로 다운로드되었습니다.', 'success');
    } else {
      const headers = ['LogID,UID,Email,DisplayName,Provider,Timestamp,Platform,UserAgent'];
      const rows = logs.map(
        (l) =>
          `"${l.id}","${l.uid}","${l.email}","${l.displayName || ''}","${l.providerId}","${l.timestamp}","${l.platform || ''}","${(l.userAgent || '').replace(/"/g, '""')}"`
      );
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `kfc_login_logs_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('로그인 접속 기록이 CSV로 다운로드되었습니다.', 'success');
    }
  };

  return (
    <div className="w-full bg-[#fbfbfa] border border-[#e3e2de] rounded-xl shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 sm:px-6 py-4 bg-white border-b border-[#e3e2de] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#edf6ec] border border-[#d2ebd0] flex items-center justify-center text-emerald-700 shadow-2xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-sans font-bold text-[#37352f] flex items-center gap-2">
              <span>{t('admin.usersTitle', '로그인 사용자 및 접속 기록')}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#edf6ec] text-emerald-700 border border-[#d2ebd0]">
                Firestore Realtime Live
              </span>
            </h2>
            <p className="text-xs font-sans text-[#787774]">
              {t('admin.usersDesc', '실시간 접속자 이력 조회 및 로그 데이터 삭제/관리가 가능합니다.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'logs' && logs.length > 0 && (
            <button
              onClick={() => setConfirmClearAll(true)}
              className="px-3 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-sans font-medium text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Clear All Logs"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>전체 기록 삭제</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-md bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] text-xs font-sans font-medium text-[#37352f] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#787774]" />
            <span className="hidden sm:inline">CSV 다운로드</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-white hover:bg-[#efefed] border border-[#e3e2de] text-xs font-sans font-medium text-[#787774] hover:text-[#37352f] transition-colors cursor-pointer"
            >
              닫기
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing All Logs */}
      {confirmClearAll && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e3e2de] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-sans font-bold text-sm text-[#37352f]">전체 접속 기록 삭제</h3>
            </div>
            <p className="text-xs font-sans text-[#787774] leading-relaxed">
              지금까지 누적된 총 <strong>{logs.length}개</strong>의 모든 로그인 접속 로그를 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e3e2de]">
              <button
                onClick={() => setConfirmClearAll(false)}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded-lg border border-[#e3e2de] bg-[#f7f6f3] text-xs font-sans text-[#37352f] hover:bg-[#efefed] cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleClearAllLogs}
                disabled={isDeleting}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-sans font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? '삭제 중...' : '모두 삭제하기'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f7f6f3] border-b border-[#e3e2de]">
        {/* Card 1: Total Users */}
        <div className="p-3.5 bg-white rounded-lg border border-[#e3e2de] shadow-2xs">
          <div className="flex items-center justify-between text-[#787774] text-xs font-sans mb-1">
            <span>총 등록 회원</span>
            <Users className="w-3.5 h-3.5 text-[#2383e2]" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#37352f]">
            {totalUsersCount}
            <span className="text-xs font-sans font-normal text-[#787774] ml-1">명</span>
          </div>
        </div>

        {/* Card 2: Google Gmail Users */}
        <div className="p-3.5 bg-white rounded-lg border border-[#e3e2de] shadow-2xs">
          <div className="flex items-center justify-between text-[#787774] text-xs font-sans mb-1">
            <span>Google 계정</span>
            <span className="text-[10px] font-mono px-1 rounded bg-[#fee2e2] text-red-600 font-bold">G</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#37352f]">
            {googleUsersCount}
            <span className="text-xs font-sans font-normal text-[#787774] ml-1">명</span>
          </div>
        </div>

        {/* Card 3: Total Login Sessions */}
        <div className="p-3.5 bg-white rounded-lg border border-[#e3e2de] shadow-2xs">
          <div className="flex items-center justify-between text-[#787774] text-xs font-sans mb-1">
            <span>누적 로그인 횟수</span>
            <LogIn className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#37352f]">
            {totalLoginsCount}
            <span className="text-xs font-sans font-normal text-[#787774] ml-1">회</span>
          </div>
        </div>

        {/* Card 4: 24h Active Logins */}
        <div className="p-3.5 bg-white rounded-lg border border-[#e3e2de] shadow-2xs">
          <div className="flex items-center justify-between text-[#787774] text-xs font-sans mb-1">
            <span>24시간 내 접속</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-700">
            {recent24hLogins}
            <span className="text-xs font-sans font-normal text-[#787774] ml-1">회</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filters Bar */}
      <div className="p-4 bg-white border-b border-[#e3e2de] flex flex-wrap items-center justify-between gap-3">
        {/* Left Tabs */}
        <div className="flex items-center gap-1 bg-[#f7f6f3] p-1 rounded-lg border border-[#e3e2de]">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-white text-[#37352f] font-semibold shadow-2xs border border-[#e3e2de]'
                : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>로그인 접속 이력 ({logs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-white text-[#37352f] font-semibold shadow-2xs border border-[#e3e2de]'
                : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#2383e2]" />
            <span>가입 사용자 목록 ({users.length})</span>
          </button>
        </div>

        {/* Right Search & Provider Filter */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
          {/* Provider Filter */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-md bg-[#f7f6f3] border border-[#e3e2de] text-xs font-sans text-[#37352f] outline-none cursor-pointer"
          >
            <option value="ALL">전체 로그인 수단</option>
            <option value="google.com">Google (Gmail)</option>
            <option value="password">이메일/비밀번호</option>
          </select>

          {/* Search Box */}
          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#787774] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이메일 또는 이름 검색..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#e3e2de] focus:border-[#2383e2] rounded-md text-xs font-sans text-[#37352f] placeholder-[#9b9a97] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="py-16 text-center text-[#787774] flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#2383e2]" />
            <span className="text-xs font-sans">사용자 및 접속 기록을 불러오는 중입니다...</span>
          </div>
        ) : activeTab === 'users' ? (
          /* USERS TABLE */
          filteredUsers.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-lg border border-[#e3e2de] p-8">
              <Users className="w-8 h-8 text-[#9b9a97] mx-auto mb-2 opacity-60" />
              <p className="text-xs font-sans font-medium text-[#37352f]">
                {searchTerm ? '검색 조건과 일치하는 사용자가 없습니다.' : '아직 등록된 로그인 사용자가 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#e3e2de] shadow-2xs overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-[#f7f6f3] border-b border-[#e3e2de] text-[#787774] font-semibold">
                    <th className="py-3 px-4">사용자</th>
                    <th className="py-3 px-4">실제 이메일</th>
                    <th className="py-3 px-4">로그인 수단</th>
                    <th className="py-3 px-4">권한</th>
                    <th className="py-3 px-4 text-center">로그인 횟수</th>
                    <th className="py-3 px-4">최근 접속 시간</th>
                    <th className="py-3 px-4">최초 가입일</th>
                    <th className="py-3 px-4 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e2de]">
                  {filteredUsers.map((user) => {
                    const isGoogle = user.providerId === 'google.com';
                    const isAdmin = user.role === 'admin' || user.email === 'pompeii928@gmail.com';

                    return (
                      <tr key={user.uid} className="hover:bg-[#fbfbfa] transition-colors">
                        {/* User Avatar + Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="w-7 h-7 rounded-full object-cover border border-[#e3e2de]"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-[#f7f6f3] border border-[#e3e2de] flex items-center justify-center font-bold text-[#37352f] text-xs">
                                {(user.displayName || user.email || 'U')[0].toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-[#37352f] flex items-center gap-1.5">
                                <span>{user.displayName || '이름 없음'}</span>
                                {isAdmin && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#edf6ec] text-emerald-700 font-bold border border-[#d2ebd0]">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] font-mono text-[#9b9a97]">{user.uid.substring(0, 12)}...</div>
                            </div>
                          </div>
                        </td>

                        {/* Real Email */}
                        <td className="py-3 px-4">
                          <div className="font-mono text-[#37352f] font-medium flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#787774]" />
                            <span>{user.email}</span>
                          </div>
                        </td>

                        {/* Provider */}
                        <td className="py-3 px-4">
                          {isGoogle ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#fee2e2] text-red-700 border border-red-200">
                              <span className="font-bold">G</span> Google
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#f0f4f8] text-[#1c3d5a] border border-[#d3e2ef]">
                              <Mail className="w-3 h-3" /> Email
                            </span>
                          )}
                        </td>

                        {/* Role */}
                        <td className="py-3 px-4">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#edf6ec] text-emerald-800 border border-[#d2ebd0]">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 관리자
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-[#787774] bg-[#f7f6f3] border border-[#e3e2de]">
                              일반 방문자
                            </span>
                          )}
                        </td>

                        {/* Login Count */}
                        <td className="py-3 px-4 text-center">
                          <span className="font-mono font-bold text-[#37352f] px-2 py-0.5 rounded bg-[#f7f6f3] border border-[#e3e2de]">
                            {user.loginCount || 1}회
                          </span>
                        </td>

                        {/* Last Login At */}
                        <td className="py-3 px-4">
                          <div className="text-[#37352f] font-mono">{formatDate(user.lastLoginAt)}</div>
                          <div className="text-[10px] text-emerald-600 font-medium">{getRelativeTime(user.lastLoginAt)}</div>
                        </td>

                        {/* Created At */}
                        <td className="py-3 px-4 text-[#787774] font-mono">
                          {formatDate(user.createdAt)}
                        </td>

                        {/* Delete User Action */}
                        <td className="py-3 px-4 text-center">
                          {!isAdmin && (
                            <button
                              onClick={(e) => handleDeleteUser(user.uid, user.email, e)}
                              className="p-1 rounded-md text-[#787774] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="사용자 기록 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* LOGIN AUDIT LOGS TIMELINE */
          filteredLogs.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-lg border border-[#e3e2de] p-8">
              <Clock className="w-8 h-8 text-[#9b9a97] mx-auto mb-2 opacity-60" />
              <p className="text-xs font-sans font-medium text-[#37352f]">
                {searchTerm ? '검색 조건과 일치하는 접속 기록이 없습니다.' : '기록된 로그인 접속 이력이 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#e3e2de] shadow-2xs overflow-hidden divide-y divide-[#e3e2de]">
              {filteredLogs.map((log) => {
                const isGoogle = log.providerId === 'google.com';
                return (
                  <div
                    key={log.id}
                    className="p-4 hover:bg-[#fbfbfa] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      {log.photoURL ? (
                        <img
                          src={log.photoURL}
                          alt={log.displayName}
                          className="w-8 h-8 rounded-full object-cover border border-[#e3e2de] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#f7f6f3] border border-[#e3e2de] flex items-center justify-center font-bold text-[#37352f] text-xs shrink-0">
                          {(log.displayName || log.email || 'L')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-[#37352f]">{log.displayName || '이름 없음'}</span>
                          <span className="font-mono text-xs text-[#787774]">({log.email})</span>
                          {isGoogle ? (
                            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#fee2e2] text-red-700 border border-red-200">
                              Google
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#f0f4f8] text-[#1c3d5a] border border-[#d3e2ef]">
                              Email
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#787774] flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 font-mono">
                            <Laptop className="w-3 h-3 text-[#9b9a97]" />
                            <span>{log.platform || 'Web Client'}</span>
                          </span>
                          <span className="text-[#e3e2de]">•</span>
                          <span className="truncate max-w-xs text-[10px] font-mono text-[#9b9a97]" title={log.userAgent}>
                            {log.userAgent || 'Standard Browser'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-mono font-semibold text-[#37352f] flex items-center gap-1 sm:justify-end">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">
                          {getRelativeTime(log.timestamp)}
                        </div>
                      </div>

                      {/* Delete Log Button */}
                      <button
                        onClick={(e) => handleDeleteLog(log.id, e)}
                        className="p-1.5 rounded-md text-[#787774] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        title="이 접속 기록 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};
