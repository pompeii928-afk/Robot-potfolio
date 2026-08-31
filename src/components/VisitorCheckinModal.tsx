import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  X,
  Building,
  User,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Tag,
  Loader2,
  LogOut,
  Clock,
  ArrowRight,
  Edit3,
} from 'lucide-react';
import { recordVisitorCheckin, recordVisitorCheckout } from '../firebase/firestoreService';
import { useToast } from './Toast';
import { useLanguage } from '../context/ThemeContext';

interface VisitorCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckinSuccess?: (name: string) => void;
  onCheckoutSuccess?: () => void;
}

const RELATION_PRESETS = [
  { key: 'rel.wro', fallback: 'WRO / 로봇대회 관계자' },
  { key: 'rel.peer', fallback: '로봇공학 / 개발 동료' },
  { key: 'rel.school', fallback: '학교 / 연구소 / 동아리' },
  { key: 'rel.recruiter', fallback: 'IT / 기업 / 채용 담당자' },
  { key: 'rel.friend', fallback: '친구 / 지인 / 응원' },
  { key: 'rel.general', fallback: '일반 방문자' },
];

export const VisitorCheckinModal: React.FC<VisitorCheckinModalProps> = ({
  isOpen,
  onClose,
  onCheckinSuccess,
  onCheckoutSuccess,
}) => {
  const { lang, t } = useLanguage();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [selectedPresetKey, setSelectedPresetKey] = useState('rel.general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [checkedInInfo, setCheckedInInfo] = useState<{
    id?: string;
    name: string;
    organization?: string;
    roleOrRelation?: string;
    checkedInAt?: string;
  } | null>(null);

  // Load previously checked in info from localStorage if exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('kfc_visitor_id');
      const savedName = localStorage.getItem('kfc_visitor_name');
      const savedOrg = localStorage.getItem('kfc_visitor_org');
      const savedRole = localStorage.getItem('kfc_visitor_role');
      const savedTime = localStorage.getItem('kfc_visitor_time');

      if (savedName) {
        setName(savedName);
        if (savedOrg) setOrganization(savedOrg);
        if (savedRole) {
          const match = RELATION_PRESETS.find(
            (p) => t(p.key, p.fallback) === savedRole || p.fallback === savedRole || p.key === savedRole
          );
          if (match) setSelectedPresetKey(match.key);
        }
        setCheckedInInfo({
          id: savedId || undefined,
          name: savedName,
          organization: savedOrg || undefined,
          roleOrRelation: savedRole || undefined,
          checkedInAt: savedTime || undefined,
        });
        setIsEditing(false);
      } else {
        setCheckedInInfo(null);
        setIsEditing(true);
      }
    }
  }, [isOpen, t]);

  if (!isOpen) return null;

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      const locale = lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : 'en-US';
      return d.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getDurationText = (startTimeIso?: string) => {
    if (!startTimeIso) return '';
    try {
      const diffMs = Date.now() - new Date(startTimeIso).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHr = Math.floor(diffMin / 60);

      if (diffMin < 1) return lang === 'ko' ? '방금 전 (1분 미만)' : 'Just now (<1m)';
      if (diffHr < 1) return lang === 'ko' ? `${diffMin}분 경과` : `${diffMin} min`;
      const remMin = diffMin % 60;
      return lang === 'ko' ? `${diffHr}시간 ${remMin}분 경과` : `${diffHr}h ${remMin}m`;
    } catch {
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const presetObj = RELATION_PRESETS.find((p) => p.key === selectedPresetKey);
      const roleText = presetObj ? t(presetObj.key, presetObj.fallback) : t('rel.general', '일반 방문자');

      const res = await recordVisitorCheckin({
        name: name.trim(),
        organization: organization.trim() || undefined,
        roleOrRelation: roleText,
        message: message.trim() || undefined,
      });

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('kfc_visitor_id', res.id);
        localStorage.setItem('kfc_visitor_name', name.trim());
        if (organization.trim()) localStorage.setItem('kfc_visitor_org', organization.trim());
        localStorage.setItem('kfc_visitor_role', roleText);
        localStorage.setItem('kfc_visitor_time', res.timestamp);
      }

      setCheckedInInfo({
        id: res.id,
        name: name.trim(),
        organization: organization.trim() || undefined,
        roleOrRelation: roleText,
        checkedInAt: res.timestamp,
      });
      setIsEditing(false);

      showToast(
        `${name.trim()} - ${t('checkin.toastSuccess', '체크인이 완료되었습니다! 포트폴리오를 편하게 둘러보세요.')}`,
        'success',
        t('checkin.statusCompleted', '체크인 완료')
      );

      if (onCheckinSuccess) {
        onCheckinSuccess(name.trim());
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      showToast(t('checkin.toastError', '체크인 등록 중 오류가 발생했습니다. 다시 시도해 주세요.'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const checkinId = checkedInInfo?.id || localStorage.getItem('kfc_visitor_id');
      if (checkinId) {
        await recordVisitorCheckout(checkinId);
      }

      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kfc_visitor_id');
        localStorage.removeItem('kfc_visitor_name');
        localStorage.removeItem('kfc_visitor_org');
        localStorage.removeItem('kfc_visitor_role');
        localStorage.removeItem('kfc_visitor_time');
      }

      setCheckedInInfo(null);
      setName('');
      setOrganization('');
      setMessage('');
      setIsEditing(true);

      showToast(
        t('checkin.checkoutSuccess', '체크아웃이 완료되었습니다. 방문해 주셔서 감사합니다!'),
        'success',
        t('checkin.statusCheckedOut', '체크아웃 완료')
      );

      if (onCheckoutSuccess) {
        onCheckoutSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      console.error(err);
      showToast('체크아웃 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div
      id="visitor-checkin-modal-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white border border-[#e3e2de] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 relative">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e3e2de] bg-[#fbfbfa] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#edf6ec] border border-[#d2ebd0] flex items-center justify-center text-emerald-700 shadow-2xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-sans font-bold text-[#37352f] tracking-tight flex items-center gap-1.5">
                <span>{t('checkin.title', '방문자 체크인 & 체크아웃')}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#edf6ec] text-emerald-700 border border-[#d2ebd0] font-semibold">
                  {t('checkin.tag', 'Visitor Check-in')}
                </span>
              </h2>
              <p className="text-[11px] font-sans text-[#787774]">
                {t('checkin.subtitle', '복잡한 로그인 없이 이름만 남기고 자유롭게 관람하세요')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Active Checked-in Card */}
          {checkedInInfo && !isEditing ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#edf6ec] border border-[#d2ebd0] text-emerald-950 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-900 font-semibold">
                      {t('checkin.statusActive', '방문 중 (체류 중)')}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white/70 border border-[#d2ebd0] text-emerald-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    {getDurationText(checkedInInfo.checkedInAt)}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-sans font-bold text-[#37352f] flex items-center gap-2">
                    <span>{checkedInInfo.name}</span>
                    {checkedInInfo.roleOrRelation && (
                      <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded bg-white text-emerald-800 border border-[#d2ebd0]">
                        {checkedInInfo.roleOrRelation}
                      </span>
                    )}
                  </div>
                  {checkedInInfo.organization && (
                    <div className="text-[11px] font-sans text-emerald-800 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{checkedInInfo.organization}</span>
                    </div>
                  )}
                  {checkedInInfo.checkedInAt && (
                    <div className="text-[10px] font-mono text-emerald-700">
                      {t('checkin.checkedInAt', '체크인 시간')}: {formatDate(checkedInInfo.checkedInAt)}
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-emerald-800 leading-relaxed pt-1 border-t border-[#d2ebd0]">
                  {t(
                    'checkin.completedDesc',
                    '관리자가 방문 현황을 확인할 수 있도록 안전하게 기록되었습니다. 관람을 마치시면 체크아웃 버튼을 눌러주세요.'
                  )}
                </p>
              </div>

              {/* Action Buttons: Check Out & Edit */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="py-2 px-3 rounded-lg bg-[#f7f6f3] hover:bg-[#efefed] text-[#37352f] border border-[#e3e2de] font-sans font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#787774]" />
                  <span>{t('checkin.reenter', '수정 / 다시 입력')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-sans font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('checkin.checkingOut', '체크아웃 처리 중...')}</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('checkin.checkoutBtn', '체크아웃 (퇴장하기)')}</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-lg bg-[#37352f] hover:bg-[#22211e] text-white font-sans font-semibold text-xs tracking-tight flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <span>{t('checkin.continueExplore', '포트폴리오 계속 둘러보기')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Check-in Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Name / Nickname */}
              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f] flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#787774]" />
                    <span>{t('checkin.nameLabel', '이름 또는 닉네임')}</span>
                  </span>
                  <span className="text-[10px] text-rose-600 font-mono">
                    {t('checkin.required', '* 필수')}
                  </span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={40}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('checkin.namePlaceholder', '예: 홍길동, WRO 심사위원, 로봇동아리')}
                  className="w-full px-3 py-2 bg-white border border-[#e3e2de] focus:border-[#2383e2] rounded-lg text-xs font-sans text-[#37352f] placeholder-[#9b9a97] outline-none shadow-2xs"
                />
              </div>

              {/* 2. Organization / Affiliation */}
              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f] flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#787774]" />
                    <span>{t('checkin.orgLabel', '소속 / 학교 / 기관')}</span>
                  </span>
                  <span className="text-[10px] text-[#787774] font-mono">
                    {t('checkin.optional', '(선택)')}
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder={t('checkin.orgPlaceholder', '예: WRO Korea, 한국디지털미디어고, KAIST, 지인')}
                  className="w-full px-3 py-2 bg-white border border-[#e3e2de] focus:border-[#2383e2] rounded-lg text-xs font-sans text-[#37352f] placeholder-[#9b9a97] outline-none shadow-2xs"
                />
              </div>

              {/* 3. Role / Relation Preset Chips */}
              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-[#37352f] flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#787774]" />
                  <span>{t('checkin.relationLabel', '방문 구분 / 관계')}</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {RELATION_PRESETS.map((preset) => {
                    const isSelected = selectedPresetKey === preset.key;
                    const label = t(preset.key, preset.fallback);
                    return (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => setSelectedPresetKey(preset.key)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-sans transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#37352f] text-white border-[#37352f] font-medium shadow-2xs'
                            : 'bg-[#f7f6f3] text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] border-[#e3e2de]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Message / Cheering word */}
              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f] flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#787774]" />
                    <span>{t('checkin.msgLabel', '방문 한마디 / 응원 메시지')}</span>
                  </span>
                  <span className="text-[10px] text-[#787774] font-mono">
                    {t('checkin.optional', '(선택)')}
                  </span>
                </label>
                <textarea
                  rows={2}
                  maxLength={200}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t(
                    'checkin.msgPlaceholder',
                    '예: 포트폴리오 잘 둘러보고 갑니다! WRO 2026 대회 응원해요!'
                  )}
                  className="w-full px-3 py-2 bg-white border border-[#e3e2de] focus:border-[#2383e2] rounded-lg text-xs font-sans text-[#37352f] placeholder-[#9b9a97] outline-none shadow-2xs resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#37352f] hover:bg-[#22211e] text-white font-sans font-semibold text-xs tracking-tight flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('checkin.submitting', '체크인 등록 중...')}</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t('checkin.submitBtn', '체크인 완료 및 포트폴리오 입장')}</span>
                    </>
                  )}
                </button>

                {checkedInInfo && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-full py-1.5 text-xs text-[#787774] hover:text-[#37352f] font-sans transition-colors cursor-pointer text-center"
                  >
                    {t('common.cancel', '취소')}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#fbfbfa] border-t border-[#e3e2de] text-center flex items-center justify-center gap-1.5 text-[11px] font-sans text-[#787774]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>
            {t('checkin.footer', '체크인 시 관리자 대시보드에 실시간 방문자로 기록됩니다')}
          </span>
        </div>
      </div>
    </div>
  );
};
