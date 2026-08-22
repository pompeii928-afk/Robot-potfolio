import React, { useState } from 'react';
import { Trophy, Sparkles, Medal, Plus, Edit3, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AwardItem } from '../types';
import { ConfirmModal } from './modals/ConfirmModal';
import { useTheme, useLanguage } from '../context/ThemeContext';
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
  const { theme } = useTheme();
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
      particleCount: 70,
      spread: 70,
      origin: { x, y },
      colors: ['#00f0ff', '#818cf8', '#c084fc', '#38bdf8', '#ffffff', '#0284c7'],
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
    <section
      id="awards"
      className={`relative py-16 sm:py-24 border-t scroll-mt-20 sm:scroll-mt-24 ${
        theme === 'light' ? 'border-slate-200' : 'border-cyan-500/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2.5 font-display text-2xl sm:text-3xl font-bold tracking-wide ${
                theme === 'light'
                  ? 'text-sky-700'
                  : 'text-cyan-400 text-glow-cyan'
              }`}
            >
              <Trophy className={`w-7 h-7 ${theme === 'light' ? 'text-sky-600' : 'text-cyan-400'}`} />
              <span>{t('awards.title')}</span>
            </div>
            <div
              className={`hidden sm:block w-32 h-[1px] ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-sky-400/50 via-sky-300/20 to-transparent'
                  : 'bg-gradient-to-r from-cyan-500/40 via-cyan-500/10 to-transparent'
              }`}
            />
          </div>

          {/* Admin Action: Add Award */}
          {isAdmin && onAddAward && (
            <button
              onClick={onAddAward}
              id="add-award-btn"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-700 shadow-sm'
                  : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{t('awards.addBtn')}</span>
            </button>
          )}
        </div>

        {awards.length === 0 ? (
          <div
            className={`p-12 text-center rounded-2xl border border-dashed font-mono text-sm ${
              theme === 'light'
                ? 'bg-slate-50 border-slate-300 text-slate-500'
                : 'bg-[#081224]/50 border-cyan-500/20 text-slate-400'
            }`}
          >
            {lang === 'en'
              ? 'No awards recorded yet. Switch to admin mode to register competition awards.'
              : '등록된 수상 내역이 없습니다. 관리자 모드에서 새로운 상을 추가해 보세요.'}
          </div>
        ) : (
          <>
            {/* Central Achievement Showcase Card */}
            {mainAward && (
              <div className="max-w-2xl mx-auto relative group">
                    {/* Admin Quick Edit Bar for Main Award */}
                    {isAdmin && rawMainAward && (
                      <div
                        className={`absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1 rounded-lg border ${
                          theme === 'light'
                            ? 'bg-white/90 border-slate-300 shadow-sm'
                            : 'bg-[#060c18]/90 border-cyan-500/40'
                        }`}
                      >
                        {onEditAward && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditAward(rawMainAward);
                            }}
                            className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 cursor-pointer ${
                              theme === 'light'
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300'
                            }`}
                          >
                            <Edit3 className="w-3 h-3" /> {t('journey.edit')}
                          </button>
                        )}
                        {onDeleteAward && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAwardToDelete(rawMainAward);
                            }}
                            className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 cursor-pointer ${
                              theme === 'light'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                                : 'bg-rose-950 hover:bg-rose-900 text-rose-300'
                            }`}
                          >
                            <Trash2 className="w-3 h-3" /> {t('journey.delete')}
                          </button>
                        )}
                      </div>
                    )}

                <div
                  onClick={(e) => handleTriggerCelebration(e, mainAward)}
                  className={`relative cursor-pointer p-8 sm:p-12 rounded-3xl backdrop-blur-xl border text-center transition-all duration-300 overflow-hidden ${
                    theme === 'light'
                      ? 'bg-white border-slate-200 shadow-[0_15px_45px_rgba(15,23,42,0.08)] hover:border-sky-400 hover:shadow-[0_20px_50px_rgba(2,132,199,0.15)]'
                      : 'bg-[#0a152d]/85 border-cyan-500/30 hover:border-cyan-400/80 hover:shadow-[0_0_50px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  {/* Ambient Radial Background Glow */}
                  <div
                    className={`absolute inset-0 opacity-70 pointer-events-none ${
                      theme === 'light'
                        ? 'bg-gradient-to-b from-sky-400/10 via-transparent to-indigo-500/5'
                        : 'bg-gradient-to-b from-cyan-500/10 via-transparent to-purple-600/10'
                    }`}
                  />

                  {/* Glowing Medal Icon */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div
                      className={`absolute inset-0 rounded-full blur-xl animate-pulse ${
                        theme === 'light' ? 'bg-sky-400/30' : 'bg-cyan-400/20'
                      }`}
                    />
                    <div
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex items-center justify-center group-hover:scale-110 transition-transform ${
                        theme === 'light'
                          ? 'bg-gradient-to-br from-sky-100 to-indigo-50 border-sky-500 shadow-[0_6px_25px_rgba(2,132,199,0.3)]'
                          : 'bg-gradient-to-br from-[#0c234a] to-[#081329] border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                      }`}
                    >
                      <Medal
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${
                          theme === 'light'
                            ? 'text-sky-600'
                            : 'text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div
                    className={`text-xs sm:text-sm font-mono tracking-[0.25em] uppercase font-semibold mb-2 flex items-center justify-center gap-1.5 ${
                      theme === 'light' ? 'text-sky-700' : 'text-cyan-400/90'
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-sky-600' : 'text-cyan-300'}`} />
                    <span>{t('awards.unlocked')}</span>
                    <Sparkles className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-sky-600' : 'text-cyan-300'}`} />
                  </div>

                  {/* Main Award Title */}
                  <h3
                    className={`font-display text-2xl sm:text-4xl font-extrabold tracking-wide mb-5 ${
                      theme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {mainAward.competition}
                  </h3>

                  {/* Pill Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm sm:text-base border transition-all ${
                      theme === 'light'
                        ? 'bg-sky-50 border-sky-300 text-sky-800 shadow-sm group-hover:bg-sky-100'
                        : 'bg-cyan-950/80 border border-cyan-400/70 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:bg-cyan-900/90'
                    }`}
                  >
                    <span>{mainAward.title}</span>
                  </div>

                  {/* Description & Rank */}
                  <p
                    className={`mt-6 text-sm max-w-lg mx-auto leading-relaxed whitespace-pre-line ${
                      theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                    }`}
                  >
                    {mainAward.description}
                  </p>

                  <div
                    className={`mt-6 inline-flex items-center gap-4 text-xs font-mono ${
                      theme === 'light' ? 'text-slate-500' : 'text-cyan-400/80'
                    }`}
                  >
                    <span>Date: {mainAward.date}</span>
                    {mainAward.rank && (
                      <>
                        <span>•</span>
                        <span className={theme === 'light' ? 'text-indigo-600 font-semibold' : 'text-purple-300 font-semibold'}>
                          Rank: {mainAward.rank}
                        </span>
                      </>
                    )}
                    {mainAward.score && (
                      <>
                        <span>•</span>
                        <span className={theme === 'light' ? 'text-emerald-700 font-semibold' : 'text-emerald-300 font-semibold'}>
                          Score: {mainAward.score}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Other Awards Grid */}
            {otherAwards.length > 0 && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherAwards.map((award, idx) => {
                  const rawAward = awards.filter((a) => a.id !== rawMainAward?.id)[idx] || award;
                  return (
                  <div
                    key={award.id}
                    onClick={(e) => handleTriggerCelebration(e, award)}
                    className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      theme === 'light'
                        ? 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-md'
                        : 'bg-[#081224]/70 border-slate-800/80 hover:border-cyan-500/40 hover:bg-[#0a1832]'
                    }`}
                  >
                    {/* Admin Item Actions */}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                        {onEditAward && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditAward(rawAward);
                            }}
                            className={`p-1 rounded text-[10px] font-mono border cursor-pointer ${
                              theme === 'light'
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                                : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border-cyan-500/30'
                            }`}
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
                            className={`p-1 rounded text-[10px] font-mono border cursor-pointer ${
                              theme === 'light'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                                : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border-rose-500/30'
                            }`}
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    <div>
                      <div
                        className={`flex items-center justify-between text-xs font-mono mb-1 pr-12 ${
                          theme === 'light' ? 'text-sky-700 font-semibold' : 'text-cyan-400'
                        }`}
                      >
                        <span>{award.date}</span>
                        {award.rank && (
                          <span
                            className={`px-2 py-0.5 rounded border text-[10px] ${
                              theme === 'light'
                                ? 'bg-sky-50 border-sky-200 text-sky-800'
                                : 'bg-cyan-950/60 border-cyan-500/30'
                            }`}
                          >
                            {award.rank}
                          </span>
                        )}
                      </div>
                      <h4
                        className={`text-sm font-bold transition-colors mb-1 ${
                          theme === 'light'
                            ? 'text-slate-900 group-hover:text-sky-700'
                            : 'text-white group-hover:text-cyan-300'
                        }`}
                      >
                        {award.title}
                      </h4>
                      <div
                        className={`text-xs mb-2 ${
                          theme === 'light' ? 'text-slate-500 font-medium' : 'text-slate-400'
                        }`}
                      >
                        {award.competition}
                      </div>
                    </div>
                    <p
                      className={`text-[11px] line-clamp-2 whitespace-pre-line ${
                        theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {award.description}
                    </p>
                  </div>
                  );
                })}
              </div>
            )}
          </>
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
