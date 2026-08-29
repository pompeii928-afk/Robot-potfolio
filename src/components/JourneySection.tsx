import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  Gauge,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { JourneyItem } from '../types';
import { ConfirmModal } from './modals/ConfirmModal';
import { useLanguage } from '../context/ThemeContext';
import { getLocalizedJourney } from '../utils/translationHelper';

interface JourneySectionProps {
  journeys: JourneyItem[];
  isAdmin?: boolean;
  onAddJourney?: () => void;
  onEditJourney?: (item: JourneyItem) => void;
  onDeleteJourney?: (id: string) => Promise<void>;
}

export const JourneySection: React.FC<JourneySectionProps> = ({
  journeys,
  isAdmin = false,
  onAddJourney,
  onEditJourney,
  onDeleteJourney,
}) => {
  const { lang, t } = useLanguage();

  // Localized items list for rendering
  const localizedJourneys = journeys.map((j) => getLocalizedJourney(j, lang));

  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(
    journeys[0]?.id || ''
  );
  const [journeyToDelete, setJourneyToDelete] = useState<JourneyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync selected journey if list changes or selected is deleted
  useEffect(() => {
    if (journeys.length > 0) {
      const exists = journeys.some((j) => j.id === selectedJourneyId);
      if (!exists) {
        setSelectedJourneyId(journeys[0].id);
      }
    } else {
      setSelectedJourneyId('');
    }
  }, [journeys, selectedJourneyId]);

  const rawSelectedItem: JourneyItem | undefined =
    journeys.find((j) => j.id === selectedJourneyId) || journeys[0];

  const selectedItem: JourneyItem | undefined =
    localizedJourneys.find((j) => j.id === selectedJourneyId) || localizedJourneys[0];

  const handleConfirmDelete = async () => {
    if (!journeyToDelete || !onDeleteJourney) return;
    setIsDeleting(true);
    try {
      await onDeleteJourney(journeyToDelete.id);
      setJourneyToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section id="journey" className="relative py-10 sm:py-14 border-t border-[#e3e2de] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notion Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none">🗺️</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#37352f] tracking-tight">
                {t('journey.title', '대회 및 연구 여정')}
              </h2>
              <p className="text-xs sm:text-sm text-[#787774] mt-0.5">
                {t('journey.subtitle', '실패와 성공, 문제 해결을 통해 축적된 엔지니어링 기록입니다.')}
              </p>
            </div>
          </div>

          {/* Admin Action: Add Journey */}
          {isAdmin && onAddJourney && (
            <button
              onClick={onAddJourney}
              id="add-journey-btn"
              className="px-3 py-1.5 rounded-md text-xs font-sans font-medium flex items-center gap-1.5 bg-[#f7f6f3] hover:bg-[#efefed] text-[#37352f] border border-[#e3e2de] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#787774]" />
              <span>{t('journey.addBtn', '새 여정 추가')}</span>
            </button>
          )}
        </div>

        {journeys.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-[#e3e2de] bg-[#f7f6f3] text-sm text-[#787774]">
            {lang === 'en'
              ? 'No journey entries found. Please add milestones in admin mode.'
              : '등록된 여정 기록이 없습니다. 관리자 모드에서 새 대회 여정을 추가해 보세요.'}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Notion Database Horizontal Tab Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-[#e3e2de]">
              {localizedJourneys.map((item, idx) => {
                const rawItem = journeys[idx] || item;
                const isSelected = selectedItem?.id === item.id;
                const itemYear = item.year || item.season || '';
                const itemTitle = item.competition || item.title || '';

                return (
                  <div
                    key={item.id}
                    className={`flex items-center rounded-t-md border-t border-x transition-colors ${
                      isSelected
                        ? 'bg-white border-[#e3e2de] text-[#37352f] shadow-2xs font-semibold'
                        : 'bg-[#f7f6f3] border-transparent text-[#787774] hover:text-[#37352f] hover:bg-[#efefed]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedJourneyId(item.id)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-sans cursor-pointer whitespace-nowrap"
                    >
                      <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-[#e3e2de]/60 text-[#5a5854]">
                        {item.step || idx + 1}
                      </span>
                      <span>{itemYear}</span>
                      <span className="max-w-[140px] truncate">{itemTitle}</span>
                    </button>

                    {isAdmin && onDeleteJourney && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setJourneyToDelete(rawItem);
                        }}
                        className="p-1.5 mr-1 text-[#787774] hover:text-red-600 rounded transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Journey Document Page */}
            {selectedItem && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-[#e3e2de] rounded-xl p-5 sm:p-7 shadow-xs">
                {/* Left Column: Metadata & Overview */}
                <div className="lg:col-span-5 space-y-5 lg:border-r lg:border-[#e3e2de] lg:pr-6">
                  {/* Step & Competition Title */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#787774] mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{selectedItem.year || selectedItem.season || ''}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#f1f1ef] text-[#37352f]">
                        STEP {selectedItem.step || 1}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#37352f] leading-snug">
                      {selectedItem.competition || selectedItem.title || ''}
                    </h3>
                  </div>

                  {/* Award Tag (Notion Yellow/Gold Tag) */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#fbf3db] border border-[#f5e9d3] text-xs font-sans font-medium text-[#8f5b1d]">
                    <span>🏆</span>
                    <span>{selectedItem.award || (lang === 'en' ? 'Participant / In Progress' : '대회 참가 / 진행')}</span>
                  </div>

                  {/* Summary Text */}
                  <p className="text-sm font-sans text-[#37352f] leading-relaxed whitespace-pre-line">
                    {selectedItem.summary || selectedItem.description || ''}
                  </p>

                  {/* Team Callout */}
                  <div className="p-3 rounded-lg bg-[#f7f6f3] border border-[#e3e2de] flex items-center gap-2.5 text-xs text-[#37352f]">
                    <Users className="w-4 h-4 text-[#787774] shrink-0" />
                    <div>
                      <span className="text-[#787774] mr-1.5">Team:</span>
                      <span className="font-semibold">{selectedItem.teamName || selectedItem.team || 'Team K.F.C.Code Chaser'}</span>
                    </div>
                  </div>

                  {/* Telemetry / Metrics Table */}
                  <div className="space-y-2 pt-2 border-t border-[#e3e2de]">
                    <div className="flex items-center justify-between text-xs font-mono text-[#787774]">
                      <span className="flex items-center gap-1 font-semibold text-[#37352f]">
                        <Gauge className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Key Metrics' : '주요 성능 지표'}</span>
                      </span>
                      {isAdmin && onEditJourney && rawSelectedItem && (
                        <button
                          type="button"
                          onClick={() => onEditJourney(rawSelectedItem)}
                          className="hover:underline flex items-center gap-1 text-[#787774]"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    {selectedItem.metrics && selectedItem.metrics.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedItem.metrics.map((metric, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-2 rounded bg-[#f7f6f3] border border-[#e3e2de] text-xs"
                          >
                            <div className="text-[11px] font-mono text-[#787774] truncate">
                              {metric.label}
                            </div>
                            <div className="text-xs font-mono font-bold text-[#37352f] mt-0.5">
                              {metric.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-[#9b9a97] italic">
                        {lang === 'en' ? 'Telemetry logged' : '실시간 텔레메트리 기록 완료'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Roles, Strengths & Improvements */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Admin controls row */}
                  {isAdmin && (
                    <div className="flex items-center justify-end gap-2 pb-2 border-b border-[#e3e2de]">
                      {onEditJourney && rawSelectedItem && (
                        <button
                          onClick={() => onEditJourney(rawSelectedItem)}
                          className="px-2.5 py-1 rounded text-xs font-sans bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> {t('journey.edit', '수정')}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Roles */}
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-[#787774] font-bold mb-1.5">
                      {t('journey.roles', '담당 역할')}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.roles?.map((role, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded text-xs font-mono bg-[#f1f1ef] text-[#37352f] border border-[#e3e2de]"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notion Strengths Callout (Green) */}
                  <div className="p-4 rounded-lg bg-[#edf3ec] border border-[#d3e5d0] text-xs sm:text-sm text-[#2b593f]">
                    <div className="flex items-center gap-1.5 font-semibold mb-1">
                      <span>💡</span>
                      <span>{t('journey.strengths', '잘한 점 & 강점')}</span>
                    </div>
                    <p className="pl-5 leading-relaxed whitespace-pre-line text-[#2b593f]">
                      {selectedItem.strengths}
                    </p>
                  </div>

                  {/* Notion Improvements Callout (Orange) */}
                  <div className="p-4 rounded-lg bg-[#faece6] border border-[#f1d5ca] text-xs sm:text-sm text-[#733e2b]">
                    <div className="flex items-center gap-1.5 font-semibold mb-1">
                      <span>⚠️</span>
                      <span>{t('journey.improvements', '보완할 점 & 개선 사항')}</span>
                    </div>
                    <p className="pl-5 leading-relaxed whitespace-pre-line text-[#733e2b]">
                      {selectedItem.improvements}
                    </p>
                  </div>

                  {/* Quote Banner */}
                  {selectedItem.quote && (
                    <div className="p-3.5 rounded-lg bg-[#f7f6f3] border-l-3 border-[#37352f] text-xs sm:text-sm text-[#37352f] italic">
                      "{selectedItem.quote}"
                    </div>
                  )}

                  {/* Key Engineering Points */}
                  {selectedItem.detailedPoints && selectedItem.detailedPoints.length > 0 && (
                    <div className="pt-2 border-t border-[#e3e2de] space-y-1.5">
                      <div className="text-xs font-mono uppercase tracking-wider text-[#787774] font-bold">
                        {t('journey.keyPoints', '주요 기술 및 문제 해결 과정')}
                      </div>
                      <ul className="space-y-1 text-xs sm:text-sm text-[#37352f]">
                        {selectedItem.detailedPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-mono text-[#787774] text-xs mt-0.5">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!journeyToDelete}
        title={t('journey.deleteConfirm')}
        message={
          lang === 'en'
            ? 'Are you sure you want to permanently delete this competition journey milestone?'
            : '선택하신 대회 여정 기록을 정말 삭제하시겠습니까?'
        }
        itemName={
          journeyToDelete
            ? `${journeyToDelete.year || journeyToDelete.season || ''} ${
                journeyToDelete.competition || journeyToDelete.title || ''
              }`
            : ''
        }
        confirmText={
          isDeleting
            ? lang === 'en'
              ? 'Deleting...'
              : '삭제 중...'
            : lang === 'en'
              ? 'Delete'
              : '삭제하기'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setJourneyToDelete(null)}
      />
    </section>
  );
};
