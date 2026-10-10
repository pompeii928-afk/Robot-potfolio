import React, { useState } from 'react';
import { Trophy, Sparkles, Medal, Plus, Edit3, Trash2, Calendar, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AwardItem } from '../types';
import { ConfirmModal } from './modals/ConfirmModal';
import { useLanguage } from '../context/ThemeContext';
import { getLocalizedAward } from '../utils/translationHelper';

interface AwardsSectionProps {
  awards: AwardItem[];
  isAdmin?: boolean;
  onAddAward?: () => void;
  onEditAward?: (award: AwardItem) => void;
  onDeleteAward?: (id: string) => Promise<void>;
  onSelectAward?: (award: AwardItem) => void;
}

export const AwardsSection: React.FC<AwardsSectionProps> = ({
  awards,
  isAdmin = false,
  onAddAward,
  onEditAward,
  onDeleteAward,
  onSelectAward,
}) => {
  const { lang, t } = useLanguage();

  const localizedAwards = awards.map((a) => getLocalizedAward(a, lang));

  const [, setSelectedAward] = useState<AwardItem | null>(null);
  const [awardToDelete, setAwardToDelete] = useState<AwardItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const rawMainAward = awards.find((a) => a.highlight) || awards[0];
  const mainAward = localizedAwards.find((a) => a.highlight) || localizedAwards[0];
  const otherAwards = localizedAwards.filter((a) => a.id !== mainAward?.id);

  const handleTriggerCelebration = (e: React.MouseEvent, award: AwardItem) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { x, y },
      colors: ['#2383e2', '#f2994a', '#27ae60', '#9b51e0', '#37352f'],
      disableForReducedMotion: true,
    });

    setSelectedAward(award);
    if (onSelectAward) {
      onSelectAward(award);
    }
  };

  const handleConfirmDelete = async () => {
    if (!awardToDelete || !onDeleteAward) return;
    setIsDeleting(true);
    try {
      await onDeleteAward(awardToDelete.id);
      setAwardToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section id="awards" className="relative py-12 sm:py-20 border-t border-[#e2e0da] dark:border-white/10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stokt Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-[#6e6d6a] dark:text-[#a3a29e] tracking-wider uppercase">
              ( 03 / RECOGNITION &amp; HONORS )
            </span>
            <span className="h-px flex-1 bg-[#e2e0da] dark:bg-white/10 max-w-[80px]" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-orange-500/15 border border-amber-500/25 text-amber-600 shadow-2xs shrink-0 select-none transition-all duration-300 hover:scale-105 hover:border-amber-500/40">
                <Trophy className="w-5 h-5 text-amber-600 stroke-[2.2]" />
              </span>
              <div>
                <h2 className="text-2xl sm:text-4xl font-sans font-black text-[#0a0a0a] dark:text-[#f4f2ee] tracking-tight">
                  {t('awards.title', '수상 및 성과 내역')}
                </h2>
                <p className="text-xs sm:text-sm text-[#6e6d6a] dark:text-[#a3a29e] mt-0.5 font-sans">
                  {t('awards.subtitle', '국내외 로봇 경진대회 및 자율주행 챌린지 수상 기록입니다.')}
                </p>
              </div>
            </div>

            {/* Admin Action: Add Award */}
            {isAdmin && onAddAward && (
              <button
                onClick={onAddAward}
                id="add-award-btn"
                className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 bg-[#0a0a0a] text-white dark:bg-[#f4f2ee] dark:text-[#0a0a0a] transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Award</span>
              </button>
            )}
          </div>
        </div>

        {awards.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-[#e3e2de] bg-[#f7f6f3] text-sm text-[#787774]">
            {t('awards.empty', '등록된 수상 내역이 없습니다.')}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Highlight Award (Stokt Showcase) */}
            {mainAward && (
              <div className="relative group bg-white dark:bg-[#121318] border border-[#e2e0da] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xs hover:shadow-lg transition-all duration-300">
                {/* Admin Quick Action */}
                {isAdmin && rawMainAward && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                    {onEditAward && (
                      <button
                        onClick={() => onEditAward(rawMainAward)}
                        className="px-2.5 py-1 rounded text-xs font-mono bg-white/90 dark:bg-black/80 hover:bg-[#eae8e2] border border-[#e2e0da] dark:border-white/20 text-[#0a0a0a] dark:text-white flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3 h-3" /> {t('journey.edit', '수정')}
                      </button>
                    )}
                    {onDeleteAward && (
                      <button
                        onClick={() => setAwardToDelete(rawMainAward)}
                        className="p-1.5 rounded text-xs bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 cursor-pointer shadow-xs"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e0da] dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-2xl shadow-2xs">
                      🥇
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          ( {t('awards.unlocked', 'TOP HONORS')} )
                        </span>
                        <span className="text-xs font-mono text-[#6e6d6a] dark:text-[#a3a29e]">/ {mainAward.date}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#0a0a0a] dark:text-[#f4f2ee] tracking-tight">
                        {mainAward.competition}
                      </h3>
                    </div>
                  </div>

                  {/* Confetti Trigger Button */}
                  <button
                    onClick={(e) => handleTriggerCelebration(e, mainAward)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/40 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>🎉</span>
                    <span>{t('awards.celebrate', 'Celebrate')}</span>
                  </button>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="inline-flex items-center gap-2 text-sm font-sans font-bold text-[#0a0a0a] dark:text-[#f4f2ee]">
                    <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>{mainAward.title}</span>
                  </div>

                  <p className="text-sm font-sans text-[#4a4946] dark:text-[#b4b3ae] leading-relaxed max-w-3xl whitespace-pre-line">
                    {mainAward.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-[#6e6d6a] dark:text-[#a3a29e]">
                    {mainAward.rank && (
                      <span>
                        RANK / <strong className="text-[#0a0a0a] dark:text-[#f4f2ee]">{mainAward.rank}</strong>
                      </span>
                    )}
                    {mainAward.score && (
                      <>
                        <span>·</span>
                        <span>
                          SCORE / <strong className="text-emerald-600 dark:text-emerald-400">{mainAward.score}</strong>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Other Awards (Stokt Editorial Gallery Grid) */}
            {otherAwards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {otherAwards.map((award, idx) => {
                  const rawAward = awards.filter((a) => a.id !== rawMainAward?.id)[idx] || award;
                  return (
                    <div
                      key={award.id}
                      onClick={(e) => handleTriggerCelebration(e, award)}
                      className="relative p-6 rounded-2xl border border-[#e2e0da] dark:border-white/10 bg-white dark:bg-[#121318] hover:border-[#0a0a0a]/30 dark:hover:border-white/30 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-lg"
                    >
                      {/* Admin Quick Action */}
                      {isAdmin && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                          {onEditAward && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditAward(rawAward);
                              }}
                              className="p-1 rounded text-xs bg-[#f7f6f3] hover:bg-[#efefed] text-[#787774] border border-[#e3e2de] cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          )}
                          {onDeleteAward && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAwardToDelete(rawAward);
                              }}
                              className="p-1 rounded text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between text-xs font-mono text-[#787774] mb-2 pr-12">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#9b9a97]" />
                            <span>{award.date}</span>
                          </span>
                          {award.rank && (
                            <span className="px-2 py-0.5 rounded bg-[#f1f1ef] text-[#37352f] text-[11px] font-semibold">
                              {award.rank}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-sans font-bold text-[#37352f] mb-1 group-hover:text-[#2383e2] transition-colors">
                          {award.title}
                        </h4>

                        <div className="text-xs font-sans text-[#787774] mb-3">
                          {award.competition}
                        </div>
                      </div>

                      <p className="text-xs font-sans text-[#5a5854] leading-relaxed line-clamp-3 whitespace-pre-line">
                        {award.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!awardToDelete}
        title={t('awards.delete', '수상 내역 삭제')}
        message={t('awards.deleteConfirm', '이 수상 내역을 삭제하시겠습니까?')}
        itemName={awardToDelete ? `${awardToDelete.competition} - ${awardToDelete.title}` : ''}
        confirmText={
          isDeleting
            ? t('youtube.deleting', '삭제 중...')
            : t('awards.delete', '삭제')
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setAwardToDelete(null)}
      />
    </section>
  );
};
