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
    <section id="awards" className="relative py-10 sm:py-14 border-t border-[#e3e2de] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notion Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none">🏆</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#37352f] tracking-tight">
                {t('awards.title', '수상 및 성과 내역')}
              </h2>
              <p className="text-xs sm:text-sm text-[#787774] mt-0.5">
                {t('awards.subtitle', '국내외 로봇 경진대회 및 자율주행 챌린지 수상 기록입니다.')}
              </p>
            </div>
          </div>

          {/* Admin Action: Add Award */}
          {isAdmin && onAddAward && (
            <button
              onClick={onAddAward}
              id="add-award-btn"
              className="px-3 py-1.5 rounded-md text-xs font-sans font-medium flex items-center gap-1.5 bg-[#f7f6f3] hover:bg-[#efefed] text-[#37352f] border border-[#e3e2de] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#787774]" />
              <span>{t('awards.addBtn', '새 수상 추가')}</span>
            </button>
          )}
        </div>

        {awards.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-[#e3e2de] bg-[#f7f6f3] text-sm text-[#787774]">
            {lang === 'en'
              ? 'No awards recorded yet. Please add awards in admin mode.'
              : '등록된 수상 내역이 없습니다. 관리자 모드에서 새 상을 추가해 보세요.'}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Highlight Award (Notion Callout Showcase) */}
            {mainAward && (
              <div className="relative group bg-[#fdfaf2] border border-[#f5e9d3] rounded-xl p-6 sm:p-8">
                {/* Admin Quick Action */}
                {isAdmin && rawMainAward && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                    {onEditAward && (
                      <button
                        onClick={() => onEditAward(rawMainAward)}
                        className="px-2.5 py-1 rounded text-xs font-sans bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> {t('journey.edit', '수정')}
                      </button>
                    )}
                    {onDeleteAward && (
                      <button
                        onClick={() => setAwardToDelete(rawMainAward)}
                        className="p-1.5 rounded text-xs font-sans bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#f5e9d3]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#f5e9d3] flex items-center justify-center text-2xl shadow-2xs">
                      🥇
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8f5b1d]">
                          {lang === 'en' ? 'TOP HONORS' : '최고 수상 성과'}
                        </span>
                        <span className="text-xs font-mono text-[#787774]">• {mainAward.date}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#37352f]">
                        {mainAward.competition}
                      </h3>
                    </div>
                  </div>

                  {/* Confetti Trigger Button */}
                  <button
                    onClick={(e) => handleTriggerCelebration(e, mainAward)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-sans font-semibold text-[#8f5b1d] bg-white hover:bg-[#fff9eb] border border-[#f5e9d3] transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>🎉</span>
                    <span>{lang === 'en' ? 'Celebrate' : '축하하기'}</span>
                  </button>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-sans font-bold bg-white text-[#37352f] border border-[#f5e9d3]">
                    <Trophy className="w-4 h-4 text-[#8f5b1d]" />
                    <span>{mainAward.title}</span>
                  </div>

                  <p className="text-sm font-sans text-[#37352f] leading-relaxed max-w-3xl whitespace-pre-line">
                    {mainAward.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-[#787774]">
                    {mainAward.rank && (
                      <span className="px-2.5 py-0.5 rounded bg-white text-[#8f5b1d] border border-[#f5e9d3] font-semibold">
                        Rank: {mainAward.rank}
                      </span>
                    )}
                    {mainAward.score && (
                      <span className="px-2.5 py-0.5 rounded bg-[#edf3ec] text-[#2b593f] border border-[#d3e5d0] font-semibold">
                        Score: {mainAward.score}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Other Awards (Notion Gallery Grid) */}
            {otherAwards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherAwards.map((award, idx) => {
                  const rawAward = awards.filter((a) => a.id !== rawMainAward?.id)[idx] || award;
                  return (
                    <div
                      key={award.id}
                      onClick={(e) => handleTriggerCelebration(e, award)}
                      className="relative p-5 rounded-xl border border-[#e3e2de] bg-white hover:bg-[#fbfbfa] transition-colors cursor-pointer flex flex-col justify-between group shadow-2xs"
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
        title={t('awards.deleteConfirm')}
        message={
          lang === 'en'
            ? 'Are you sure you want to permanently delete this award entry?'
            : '선택하신 수상 내역을 정말 삭제하시겠습니까?'
        }
        itemName={awardToDelete ? `${awardToDelete.competition} - ${awardToDelete.title}` : ''}
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
        onCancel={() => setAwardToDelete(null)}
      />
    </section>
  );
};
