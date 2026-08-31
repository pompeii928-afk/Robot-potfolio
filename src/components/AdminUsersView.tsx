import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Clock,
  Search,
  RefreshCw,
  Laptop,
  Download,
  Trash2,
  AlertTriangle,
  Loader2,
  Building,
  MessageSquare,
  LogOut,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { VisitorCheckin, LoginLog } from '../types';
import {
  subscribeVisitorCheckins,
  deleteVisitorCheckin,
  clearAllVisitorCheckins,
  recordVisitorCheckout,
  subscribeLoginLogs,
  deleteLoginLog,
  clearAllLoginLogs,
} from '../firebase/firestoreService';
import { useLanguage } from '../context/ThemeContext';
import { useToast } from './Toast';

interface AdminUsersViewProps {
  onClose?: () => void;
}

const FILTER_CATEGORIES = [
  { value: 'ALL', key: 'admin.filterAllRel', fallback: '전체 방문 구분' },
  { value: 'rel.wro', fallback: 'WRO / 로봇대회 관계자' },
  { value: 'rel.peer', fallback: '로봇공학 / 개발 동료' },
  { value: 'rel.school', fallback: '학교 / 연구소 / 동아리' },
  { value: 'rel.recruiter', fallback: 'IT / 기업 / 채용 담당자' },
  { value: 'rel.friend', fallback: '친구 / 지인 / 응원' },
  { value: 'rel.general', fallback: '일반 방문자' },
];

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ onClose }) => {
  const { lang, t } = useLanguage();
  const { showToast } = useToast();

  const [checkins, setCheckins] = useState<VisitorCheckin[]>([]);
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'checkins' | 'logs'>('checkins');
  const [searchTerm, setSearchTerm] = useState('');
  const [relationFilter, setRelationFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'checked_out'>('ALL');
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [checkingOutIds, setCheckingOutIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoading(true);
    // Subscribe to real-time visitor checkins
    const unsubCheckins = subscribeVisitorCheckins(
      (items) => {
        setCheckins(items);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to load visitor checkins:', err);
        setLoading(false);
      }
    );

    // Subscribe to real-time admin login audit logs
    const unsubLogs = subscribeLoginLogs(
      (logList) => {
        setLogs(logList);
      },
      (err) => {
        console.error('Failed to load login logs:', err);
      }
    );

    return () => {
      unsubCheckins();
      unsubLogs();
    };
  }, []);

  // Format date helper
  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      const locale = lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : 'en-US';
      return d.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
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

  const calculateDuration = (startTimeIso?: string, endTimeIso?: string) => {
    if (!startTimeIso) return '-';
    try {
      const start = new Date(startTimeIso).getTime();
      const end = endTimeIso ? new Date(endTimeIso).getTime() : Date.now();
      const diffMs = Math.max(0, end - start);
      const diffMin = Math.floor(diffMs / 60000);
      const diffHr = Math.floor(diffMin / 60);
      const remMin = diffMin % 60;

      if (diffMin < 1) return lang === 'ko' ? '1분 미만' : '< 1m';
      if (diffHr < 1) return lang === 'ko' ? `${diffMin}분` : `${diffMin}m`;
      return lang === 'ko' ? `${diffHr}시간 ${remMin}분` : `${diffHr}h ${remMin}m`;
    } catch {
      return '-';
    }
  };

  // Delete Single Visitor Checkin
  const handleDeleteCheckin = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteVisitorCheckin(id);
      showToast(`[${name}] 삭제되었습니다.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('삭제 중 오류가 발생했습니다.', 'error');
    }
  };

  // Trigger Checkout for a visitor
  const handleAdminCheckout = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckingOutIds((prev) => ({ ...prev, [id]: true }));
    try {
      await recordVisitorCheckout(id);
      showToast(
        `[${name}] ${t('checkin.statusCheckedOut', '체크아웃 완료')}`,
        'success'
      );
    } catch (err) {
      console.error(err);
      showToast('체크아웃 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setCheckingOutIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Clear All Checkins
  const handleClearAllCheckins = async () => {
    setIsDeleting(true);
    try {
      const count = await clearAllVisitorCheckins();
      setConfirmClearAll(false);
      showToast(`총 ${count}개의 기록이 삭제되었습니다.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('기록 삭제 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete Single Login Log
  const handleDeleteLog = async (logId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteLoginLog(logId);
      showToast('로그가 삭제되었습니다.', 'success');
    } catch (err) {
      console.error(err);
      showToast('로그 삭제 중 오류가 발생했습니다.', 'error');
    }
  };

  // Clear All Login Logs
  const handleClearAllLogs = async () => {
    setIsDeleting(true);
    try {
      const count = await clearAllLoginLogs();
      setConfirmClearAll(false);
      showToast(`총 ${count}개의 로그가 삭제되었습니다.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('로그 삭제 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Metrics
  const totalCheckinsCount = checkins.length;
  const activeVisitorsCount = checkins.filter((c) => (c.status || 'active') === 'active').length;
  const checkedOutVisitorsCount = checkins.filter((c) => c.status === 'checked_out').length;
  const recent24hCheckins = checkins.filter((c) => {
    const diff = Date.now() - new Date(c.timestamp).getTime();
    return diff <= 24 * 60 * 60 * 1000;
  }).length;

  // Filtered Checkins
  const filteredCheckins = checkins.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(term) ||
      (c.organization && c.organization.toLowerCase().includes(term)) ||
      (c.roleOrRelation && c.roleOrRelation.toLowerCase().includes(term)) ||
      (c.message && c.message.toLowerCase().includes(term));

    // Status filter
    const itemStatus = c.status || 'active';
    if (statusFilter !== 'ALL' && itemStatus !== statusFilter) {
      return false;
    }

    if (relationFilter === 'ALL') return matchSearch;

    const selectedPreset = FILTER_CATEGORIES.find((p) => p.value === relationFilter);
    const translatedFilterName = selectedPreset ? t(selectedPreset.value, selectedPreset.fallback) : relationFilter;
    const matchRelation =
      c.roleOrRelation === relationFilter ||
      c.roleOrRelation === translatedFilterName ||
      c.roleOrRelation?.includes(selectedPreset?.fallback || '');

    return matchSearch && matchRelation;
  });

  // Filtered Logs
  const filteredLogs = logs.filter((l) => {
    const term = searchTerm.toLowerCase();
    return (
      l.email.toLowerCase().includes(term) ||
      (l.displayName && l.displayName.toLowerCase().includes(term))
    );
  });

  // Export CSV
  const handleExportCSV = () => {
    if (activeTab === 'checkins') {
      const headers = ['ID,Name,Status,Organization,RoleOrRelation,Message,CheckinTime,CheckoutTime,Duration,Platform'];
      const rows = checkins.map(
        (c) =>
          `"${c.id}","${c.name}","${c.status || 'active'}","${c.organization || ''}","${c.roleOrRelation || ''}","${(c.message || '').replace(/"/g, '""')}","${c.timestamp}","${c.checkoutTimestamp || ''}","${calculateDuration(c.timestamp, c.checkoutTimestamp)}","${c.platform || ''}"`
      );
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `kfc_visitor_checkins_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSV 다운로드가 완료되었습니다.', 'success');
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
      link.setAttribute('download', `kfc_admin_logs_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSV 다운로드가 완료되었습니다.', 'success');
    }
  };

  return (
    <div className="w-full bg-[#fbfbfa] border border-[#e3e2de] rounded-xl shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 sm:px-6 py-4 bg-white border-b border-[#e3e2de] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#edf6ec] border border-[#d2ebd0] flex items-center justify-center text-emerald-700 shadow-2xs">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-sans font-bold text-[#37352f] flex items-center gap-2">
              <span>{t('admin.usersTitle', '방문자 체크인 & 체크아웃 명단')}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#edf6ec] text-emerald-700 border border-[#d2ebd0]">
                Live Realtime
              </span>
            </h2>
            <p className="text-xs font-sans text-[#787774]">
              {t('admin.usersSubtitle', '방문자가 남긴 이름, 소속, 메시지 및 실시간 접속 현황을 관리할 수 있습니다.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {((activeTab === 'checkins' && checkins.length > 0) ||
            (activeTab === 'logs' && logs.length > 0)) && (
            <button
              onClick={() => setConfirmClearAll(true)}
              className="px-3 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-sans font-medium text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title={t('admin.clearAll', '전체 기록 삭제')}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{t('admin.clearAll', '전체 기록 삭제')}</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-md bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] text-xs font-sans font-medium text-[#37352f] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#787774]" />
            <span className="hidden sm:inline">{t('admin.exportCsv', 'CSV 다운로드')}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-white hover:bg-[#efefed] border border-[#e3e2de] text-xs font-sans font-medium text-[#787774] hover:text-[#37352f] transition-colors cursor-pointer"
            >
              {t('modal.close', '닫기')}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing All Records */}
      {confirmClearAll && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e3e2de] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-sans font-bold text-sm text-[#37352f]">
                {t('admin.clearAll', '전체 기록 삭제')}
              </h3>
            </div>
            <p className="text-xs font-sans text-[#787774] leading-relaxed">
              {activeTab === 'checkins' ? `${checkins.length}개의 방문자 기록` : `${logs.length}개의 로그인 로그`}이 영구적으로 삭제됩니다. 계속하시겠습니까?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e3e2de]">
              <button
                onClick={() => setConfirmClearAll(false)}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded-lg border border-[#e3e2de] bg-[#f7f6f3] text-xs font-sans text-[#37352f] hover:bg-[#efefed] cursor-pointer"
              >
                {t('common.cancel', '취소')}
              </button>
              <button
                onClick={activeTab === 'checkins' ? handleClearAllCheckins : handleClearAllLogs}
                disabled={isDeleting}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-sans font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? '삭제 중...' : t('admin.clearAll', '전체 기록 삭제')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f7f6f3] border-b border-[#e3e2de]">
        {/* Card 1: Total Check-in Visitors */}
        <div className="p-3.5 bg-white rounded-lg border border-[#e3e2de] shadow-2xs">
          <div className="flex items-center justify-between text-[#787774] text-xs font-sans mb-1">
            <span>{t('admin.totalVisitors', '총 체크인 방문자')}</span>
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#37352f]">
            {totalCheckinsCount}
            <span className="text-xs font-sans font-normal text-[#787774] ml-1">{t('admin.unitPeople', '명')}</span>
          </div>
        </div>

        {/* Card 2: Currently Active Visitors */}
        <div className="p-3.5 bg-white rounded-lg border border-[#e3e2de] shadow-2xs">
          <div className="flex items-center justify-between text-[#787774] text-xs font-sans mb-1">
            <span>{t('admin.activeVisitors', '현재 체류 중')}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-700">
            {activeVisitorsCount}
            <span className="text-xs font-sans font-normal text-[#787774] ml-1">{t('admin.unitPeople', '명')}</span>
          </div>
        </div>

        {/* Card 3: Checked Out Visitors */}
        <div className="p-3.5 bg-white rounded-lg border border-[#e3e2de] shadow-2xs">
          <div className="flex items-center justify-between text-[#787774] text-xs font-sans mb-1">
            <span>{t('admin.checkedOutVisitors', '체크아웃 완료')}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-slate-700">
            {checkedOutVisitorsCount}
            <span className="text-xs font-sans font-normal text-[#787774] ml-1">{t('admin.unitPeople', '명')}</span>
          </div>
        </div>

        {/* Card 4: 24h Check-in */}
        <div className="p-3.5 bg-white rounded-lg border border-[#e3e2de] shadow-2xs">
          <div className="flex items-center justify-between text-[#787774] text-xs font-sans mb-1">
            <span>{t('admin.recent24h', '24시간 내 방문')}</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#37352f]">
            {recent24hCheckins}
            <span className="text-xs font-sans font-normal text-[#787774] ml-1">{t('admin.unitPeople', '명')}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filters Bar */}
      <div className="p-4 bg-white border-b border-[#e3e2de] flex flex-wrap items-center justify-between gap-3">
        {/* Left Tabs */}
        <div className="flex items-center gap-1 bg-[#f7f6f3] p-1 rounded-lg border border-[#e3e2de]">
          <button
            onClick={() => setActiveTab('checkins')}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'checkins'
                ? 'bg-white text-[#37352f] font-semibold shadow-2xs border border-[#e3e2de]'
                : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {t('admin.tabCheckins', '방문자 명단')} ({checkins.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-white text-[#37352f] font-semibold shadow-2xs border border-[#e3e2de]'
                : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#2383e2]" />
            <span>
              {t('admin.tabLogs', '관리자 접속 로그')} ({logs.length})
            </span>
          </button>
        </div>

        {/* Right Search & Filters */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end flex-wrap">
          {activeTab === 'checkins' && (
            <>
              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-[#f7f6f3] p-0.5 rounded-md border border-[#e3e2de] text-xs font-sans">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    statusFilter === 'ALL'
                      ? 'bg-white text-[#37352f] shadow-2xs font-semibold'
                      : 'text-[#787774] hover:text-[#37352f]'
                  }`}
                >
                  {t('admin.filterAllStatus', '전체')}
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'active'
                      ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-semibold border border-[#d2ebd0]'
                      : 'text-[#787774] hover:text-emerald-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {t('admin.filterActive', '체류 중')}
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('checked_out')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    statusFilter === 'checked_out'
                      ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                      : 'text-[#787774] hover:text-slate-800'
                  }`}
                >
                  {t('admin.filterCheckedOut', '체크아웃')}
                </button>
              </div>

              {/* Category Filter */}
              <select
                value={relationFilter}
                onChange={(e) => setRelationFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-md bg-[#f7f6f3] border border-[#e3e2de] text-xs font-sans text-[#37352f] outline-none cursor-pointer"
              >
                {FILTER_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {t(cat.value === 'ALL' ? cat.key : cat.value, cat.fallback)}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Search Box */}
          <div className="relative w-40 sm:w-56">
            <Search className="w-3.5 h-3.5 text-[#787774] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('admin.searchPlaceholder', '이름, 소속, 메시지 검색...')}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#e3e2de] focus:border-[#2383e2] rounded-md text-xs font-sans text-[#37352f] placeholder-[#9b9a97] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="py-16 text-center text-[#787774] flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs font-sans">불러오는 중...</span>
          </div>
        ) : activeTab === 'checkins' ? (
          /* VISITOR CHECK-INS LIST */
          filteredCheckins.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-lg border border-[#e3e2de] p-8 space-y-2">
              <UserCheck className="w-8 h-8 text-[#9b9a97] mx-auto opacity-60" />
              <p className="text-xs font-sans font-medium text-[#37352f]">
                {searchTerm
                  ? t('admin.noCheckinsSearch', '검색 조건과 일치하는 방문자 체크인 기록이 없습니다.')
                  : t('admin.noCheckins', '아직 등록된 방문자 체크인 기록이 없습니다.')}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#e3e2de] shadow-2xs overflow-hidden divide-y divide-[#e3e2de]">
              {filteredCheckins.map((checkin) => {
                const isActive = (checkin.status || 'active') === 'active';
                const isCheckingOut = checkingOutIds[checkin.id];

                return (
                  <div
                    key={checkin.id}
                    className="p-4 hover:bg-[#fbfbfa] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <div
                          className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-xs ${
                            isActive
                              ? 'bg-[#edf6ec] border-[#d2ebd0] text-emerald-800'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          {(checkin.name || 'V')[0].toUpperCase()}
                        </div>
                        <span className="font-sans font-bold text-sm text-[#37352f]">
                          {checkin.name}
                        </span>

                        {/* Status Badge */}
                        {isActive ? (
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#edf6ec] text-emerald-800 border border-[#d2ebd0] font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{t('checkin.statusActive', '체류 중')}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-slate-500" />
                            <span>{t('checkin.statusCheckedOut', '체크아웃 완료')}</span>
                          </span>
                        )}

                        {checkin.roleOrRelation && (
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-[#f7f6f3] text-[#37352f] border border-[#e3e2de] font-medium">
                            {checkin.roleOrRelation}
                          </span>
                        )}

                        {checkin.organization && (
                          <span className="text-[11px] font-sans text-[#787774] flex items-center gap-1">
                            <Building className="w-3 h-3 text-[#9b9a97]" />
                            <span>{checkin.organization}</span>
                          </span>
                        )}
                      </div>

                      {checkin.message && (
                        <div className="ml-9.5 p-2 rounded-lg bg-[#fbfbfa] border border-[#e3e2de] text-xs font-sans text-[#37352f] flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">"{checkin.message}"</span>
                        </div>
                      )}

                      <div className="ml-9.5 text-[11px] text-[#787774] flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <Laptop className="w-3 h-3 text-[#9b9a97]" />
                          <span>{checkin.platform || 'Web Browser'}</span>
                        </span>

                        {/* Duration badge */}
                        <span className="font-mono text-[10px] text-[#787774] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#9b9a97]" />
                          <span>
                            {t('checkin.stayDuration', '체류')}: {calculateDuration(checkin.timestamp, checkin.checkoutTimestamp)}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#e3e2de]/60">
                      <div className="text-right space-y-0.5">
                        <div className="text-xs font-mono font-semibold text-[#37352f] flex items-center gap-1 md:justify-end">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{formatDate(checkin.timestamp)}</span>
                        </div>
                        {checkin.checkoutTimestamp && (
                          <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 md:justify-end">
                            <LogOut className="w-2.5 h-2.5 text-slate-400" />
                            <span>퇴장: {formatDate(checkin.checkoutTimestamp)}</span>
                          </div>
                        )}
                        <div className="text-[11px] text-emerald-600 font-medium">
                          {getRelativeTime(checkin.timestamp)}
                        </div>
                      </div>

                      {/* Admin action: Check out if active */}
                      {isActive && (
                        <button
                          onClick={(e) => handleAdminCheckout(checkin.id, checkin.name, e)}
                          disabled={isCheckingOut}
                          className="px-2.5 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-sans font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                          title="관리자 퇴장 처리 (Check Out)"
                        >
                          {isCheckingOut ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <LogOut className="w-3 h-3 text-amber-700" />
                          )}
                          <span className="hidden sm:inline">체크아웃</span>
                        </button>
                      )}

                      {/* Delete Single Checkin */}
                      <button
                        onClick={(e) => handleDeleteCheckin(checkin.id, checkin.name, e)}
                        className="p-1.5 rounded-md text-[#787774] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* ADMIN AUDIT LOGS */
          filteredLogs.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-lg border border-[#e3e2de] p-8">
              <Clock className="w-8 h-8 text-[#9b9a97] mx-auto mb-2 opacity-60" />
              <p className="text-xs font-sans font-medium text-[#37352f]">
                No logs recorded yet.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#e3e2de] shadow-2xs overflow-hidden divide-y divide-[#e3e2de]">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 hover:bg-[#fbfbfa] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f7f6f3] border border-[#e3e2de] flex items-center justify-center font-bold text-[#37352f] text-xs shrink-0">
                      {(log.displayName || log.email || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#37352f]">{log.displayName || 'Admin'}</span>
                        <span className="font-mono text-xs text-[#787774]">({log.email})</span>
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#edf6ec] text-emerald-700 border border-[#d2ebd0]">
                          Admin Master
                        </span>
                      </div>
                      <div className="text-[11px] text-[#787774] flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Laptop className="w-3 h-3 text-[#9b9a97]" />
                          <span>{log.platform || 'Web Client'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-semibold text-[#37352f] flex items-center gap-1 sm:justify-end">
                        <Clock className="w-3 h-3 text-[#2383e2]" />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                      <div className="text-[11px] text-[#2383e2] font-medium">
                        {getRelativeTime(log.timestamp)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteLog(log.id, e)}
                      className="p-1.5 rounded-md text-[#787774] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
