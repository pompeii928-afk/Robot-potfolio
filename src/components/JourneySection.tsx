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
  Compass,
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
    <section id="journey" className="relative py-12 sm:py-20 border-t border-[#e2e0da] dark:border-white/10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stokt Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-zinc-800 dark:text-zinc-200 font-bold tracking-wider uppercase">
              ( 02 / TIMELINE &amp; LOGS )
            </span>
            <span className="h-px flex-1 bg-zinc-300 dark:bg-white/10 max-w-[80px]" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/15 via-sky-500/10 to-teal-500/15 border border-indigo-500/25 text-indigo-500 shadow-2xs shrink-0 select-none">
                <Compass className="w-5 h-5 stroke-[2]" />
              </span>
              <div>
                <h2 className="text-2xl sm:text-4xl font-sans font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
                  {t('journey.title', '대회 및 연구 여정')}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium mt-0.5 font-sans">
                  {t('journey.subtitle', '실패와 성공, 문제 해결을 통해 축적된 엔지니어링 기록입니다.')}
                </p>
              </div>
            </div>

            {/* Admin Action: Add Journey */}
            {isAdmin && onAddJourney && (
              <button
                onClick={onAddJourney}
                id="add-journey-btn"
                className="px-4 py-2 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-black dark:hover:bg-zinc-200 transition-colors cursor-pointer shadow-2xs border border-zinc-900 dark:border-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Log</span>
              </button>
            )}
          </div>
        </div>

        {journeys.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-zinc-300 bg-zinc-100 text-sm text-zinc-800 font-medium">
            {t('journey.empty', '등록된 여정 기록이 없습니다.')}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stokt Timeline Horizontal Tab Selector */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-zinc-200 dark:border-white/10">
              {localizedJourneys.map((item, idx) => {
                const rawItem = journeys[idx] || item;
                const isSelected = selectedItem?.id === item.id;
                const itemYear = item.year || item.season || '';
                const itemTitle = item.competition || item.title || '';

                return (
                  <div
                    key={item.id}
                    className="flex items-center shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedJourneyId(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-zinc-950 text-white dark:bg-[#f4f2ee] dark:text-[#0a0a0a] font-bold shadow-2xs'
                          : 'text-zinc-800 dark:text-zinc-200 font-bold hover:text-black dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 dark:border-zinc-700'
                      }`}
                    >
                      <span className="text-[11px] font-mono opacity-80 font-bold">
                        ( {String(item.step || idx + 1).padStart(2, '0')} )
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
                        className="p-1 ml-1 text-zinc-700 hover:text-rose-600 rounded transition-colors cursor-pointer"
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 bg-white dark:bg-[#121318] border border-[#e2e0da] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xs">
                {/* Left Column: Metadata & Overview */}
                <div className="lg:col-span-5 space-y-5 lg:border-r lg:border-[#e2e0da] dark:lg:border-white/10 lg:pr-6">
                  {/* Step & Competition Title */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-800 dark:text-zinc-200 mb-1.5 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{selectedItem.year || selectedItem.season || ''}</span>
                      <span>·</span>
                      <span className="font-bold text-zinc-950 dark:text-zinc-100">
                        ( STEP {String(selectedItem.step || 1).padStart(2, '0')} )
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-sans font-black text-zinc-950 dark:text-zinc-100 leading-snug tracking-tight">
                      {selectedItem.competition || selectedItem.title || ''}
                    </h3>
                  </div>

                  {/* Award Tag (Clean Stokt Monospace Tag) */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                    <span>🏆</span>
                    <span>{selectedItem.award || t('journey.inProgress', '대회 참가 / 진행')}</span>
                  </div>

                  {/* Summary Text */}
                  <p className="text-sm font-sans text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed whitespace-pre-line">
                    {selectedItem.summary || selectedItem.description || ''}
                  </p>

                  {/* Team Callout */}
                  <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 flex items-center gap-2.5 text-xs text-zinc-950 dark:text-[#f4f2ee]">
                    <Users className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
                    <div>
                      <span className="text-zinc-800 dark:text-zinc-200 mr-1.5 font-mono font-bold">{t('journey.team', '팀')}:</span>
                      <span className="font-bold">{selectedItem.teamName || selectedItem.team || 'Team K.F.C.Code Chaser'}</span>
                    </div>
                  </div>

                  {/* Telemetry / Metrics Table */}
                  <div className="space-y-2 pt-2 border-t border-zinc-200">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-800">
                      <span className="flex items-center gap-1 font-bold text-zinc-950">
                        <Gauge className="w-3.5 h-3.5" />
                        <span>{t('journey.keyMetrics', '주요 성능 지표')}</span>
                      </span>
                      {isAdmin && onEditJourney && rawSelectedItem && (
                        <button
                          type="button"
                          onClick={() => onEditJourney(rawSelectedItem)}
                          className="hover:underline flex items-center gap-1 text-zinc-700 font-bold"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{t('journey.edit', '수정')}</span>
                        </button>
                      )}
                    </div>

                    {selectedItem.metrics && selectedItem.metrics.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedItem.metrics.map((metric, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-2 rounded bg-zinc-100 border border-zinc-300 text-xs"
                          >
                            <div className="text-[11px] font-mono text-zinc-800 font-bold truncate">
                              {metric.label}
                            </div>
                            <div className="text-xs font-mono font-bold text-zinc-950 mt-0.5">
                              {metric.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-700 font-medium italic">
                        {t('journey.telemetryLogged', '실시간 텔레메트리 기록 완료')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Roles, Strengths & Improvements */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Admin controls row */}
                  {isAdmin && (
                    <div className="flex items-center justify-end gap-2 pb-2 border-b border-zinc-200">
                      {onEditJourney && rawSelectedItem && (
                        <button
                          onClick={() => onEditJourney(rawSelectedItem)}
                          className="px-2.5 py-1 rounded text-xs font-sans bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-950 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> {t('journey.edit', '수정')}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Roles */}
                  <div id="journey-roles-box">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-xs font-mono uppercase tracking-wider text-zinc-900 font-bold">
                        {t('journey.roles', '담당 역할')}
                      </div>
                      {isAdmin && onEditJourney && rawSelectedItem && (
                        <button
                          type="button"
                          onClick={() => onEditJourney(rawSelectedItem)}
                          className="text-[11px] font-mono text-zinc-800 hover:text-black hover:underline flex items-center gap-1 cursor-pointer font-bold"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>{t('journey.edit', '수정')}</span>
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.roles?.map((role, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded text-xs font-mono bg-zinc-200 text-zinc-950 font-bold border border-zinc-300"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notion Strengths Callout (Green) */}
                  <div
                    id="journey-strengths-box"
                    className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-xs sm:text-sm text-emerald-950 relative group"
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <div className="flex items-center gap-1.5">
                        <span>💡</span>
                        <span>{t('journey.strengths', '잘한 점 & 강점')}</span>
                      </div>
                      {isAdmin && onEditJourney && rawSelectedItem && (
                        <button
                          type="button"
                          onClick={() => onEditJourney(rawSelectedItem)}
                          className="text-[11px] font-mono opacity-80 hover:opacity-100 hover:underline flex items-center gap-1 cursor-pointer text-emerald-900 font-bold"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>{t('journey.edit', '수정')}</span>
                        </button>
                      )}
                    </div>
                    <p className="pl-5 leading-relaxed whitespace-pre-line text-emerald-950 font-medium">
                      {selectedItem.strengths}
                    </p>
                  </div>

                  {/* Notion Improvements Callout (Orange) */}
                  <div
                    id="journey-improvements-box"
                    className="p-4 rounded-lg bg-amber-50 border border-amber-300 text-xs sm:text-sm text-amber-950 relative group"
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <div className="flex items-center gap-1.5">
                        <span>⚠️</span>
                        <span>{t('journey.improvements', '보완할 점 & 개선 사항')}</span>
                      </div>
                      {isAdmin && onEditJourney && rawSelectedItem && (
                        <button
                          type="button"
                          onClick={() => onEditJourney(rawSelectedItem)}
                          className="text-[11px] font-mono opacity-80 hover:opacity-100 hover:underline flex items-center gap-1 cursor-pointer text-amber-900 font-bold"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>{t('journey.edit', '수정')}</span>
                        </button>
                      )}
                    </div>
                    <p className="pl-5 leading-relaxed whitespace-pre-line text-amber-950 font-medium">
                      {selectedItem.improvements}
                    </p>
                  </div>

                  {/* Quote Banner */}
                  {selectedItem.quote && (
                    <div className="p-3.5 rounded-lg bg-zinc-100 border-l-4 border-zinc-900 text-xs sm:text-sm text-zinc-950 font-semibold italic">
                      "{selectedItem.quote}"
                    </div>
                  )}

                  {/* Key Engineering Points */}
                  {selectedItem.detailedPoints && selectedItem.detailedPoints.length > 0 && (
                    <div className="pt-2 border-t border-zinc-200 space-y-1.5">
                      <div className="text-xs font-mono uppercase tracking-wider text-zinc-900 font-bold">
                        {t('journey.keyPoints', '주요 기술 및 문제 해결 과정')}
                      </div>
                      <ul className="space-y-1 text-xs sm:text-sm text-zinc-950 font-medium">
                        {selectedItem.detailedPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-mono text-zinc-800 text-xs mt-0.5 font-bold">•</span>
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
        title={t('journey.delete', '여정 기록 삭제')}
        message={t('journey.deleteConfirm', '이 대회 여정 기록을 삭제하시겠습니까?')}
        itemName={
          journeyToDelete
            ? `${journeyToDelete.year || journeyToDelete.season || ''} ${
                journeyToDelete.competition || journeyToDelete.title || ''
              }`
            : ''
        }
        confirmText={
          isDeleting
            ? t('youtube.deleting', '삭제 중...')
            : t('journey.delete', '삭제')
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setJourneyToDelete(null)}
      />
    </section>
  );
};
