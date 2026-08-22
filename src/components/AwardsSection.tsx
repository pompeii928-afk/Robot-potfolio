import React, { useState } from 'react';
import { Trophy, Award, Sparkles, Medal, Plus, Edit3, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AwardItem } from '../types';
import { ConfirmModal } from './modals/ConfirmModal';

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
  const [selectedAward, setSelectedAward] = useState<AwardItem | null>(null);
  const [awardToDelete, setAwardToDelete] = useState<AwardItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const mainAward = awards.find((a) => a.highlight) || awards[0];
  const otherAwards = awards.filter((a) => a.id !== mainAward?.id);

  const handleTriggerCelebration = (e: React.MouseEvent, award: AwardItem) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { x, y },
      colors: ['#00f0ff', '#818cf8', '#c084fc', '#38bdf8', '#ffffff'],
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
    <section id="awards" className="relative py-16 sm:py-24 border-t border-cyan-500/10 scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-cyan-400 font-display text-2xl sm:text-3xl font-bold tracking-wide text-glow-cyan">
              <Trophy className="w-7 h-7 text-cyan-400" />
              <span>Awards</span>
            </div>
            <div className="hidden sm:block w-32 h-[1px] bg-gradient-to-r from-cyan-500/40 via-cyan-500/10 to-transparent" />
          </div>

          {/* Admin Action: Add Award */}
          {isAdmin && onAddAward && (
            <button
              onClick={onAddAward}
              id="add-award-btn"
              className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>수상 내역 추가</span>
            </button>
          )}
        </div>

        {awards.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#081224]/50 border border-dashed border-cyan-500/20 text-slate-400 font-mono text-sm">
            등록된 수상 내역이 없습니다. 관리자 모드에서 새로운 상을 추가해 보세요.
          </div>
        ) : (
          <>
            {/* Central Achievement Showcase Card */}
            {mainAward && (
              <div className="max-w-2xl mx-auto relative group">
                {/* Admin Quick Edit Bar for Main Award */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-[#060c18]/90 p-1 rounded-lg border border-cyan-500/40">
                    {onEditAward && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAward(mainAward);
                        }}
                        className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> 수정
                      </button>
                    )}
                    {onDeleteAward && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAwardToDelete(mainAward);
                        }}
                        className="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> 삭제
                      </button>
                    )}
                  </div>
                )}

                <div
                  onClick={(e) => handleTriggerCelebration(e, mainAward)}
                  className="relative cursor-pointer p-8 sm:p-12 rounded-3xl bg-[#0a152d]/85 backdrop-blur-xl border border-cyan-500/30 text-center transition-all duration-300 hover:border-cyan-400/80 hover:shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden"
                >
                  {/* Ambient Radial Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-purple-600/10 opacity-70 pointer-events-none" />

                  {/* Glowing Medal Icon */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#0c234a] to-[#081329] border-2 border-cyan-400/80 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
                      <Medal className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div className="text-xs sm:text-sm font-mono tracking-[0.25em] text-cyan-400/90 uppercase font-semibold mb-2 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>ACHIEVEMENT UNLOCKED</span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  </div>

                  {/* Main Award Title */}
                  <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-wide mb-5">
                    {mainAward.competition}
                  </h3>

                  {/* Pill Badge */}
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-950/80 border border-cyan-400/70 text-cyan-300 font-semibold text-sm sm:text-base shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:bg-cyan-900/90 transition-all">
                    <span>{mainAward.title}</span>
                  </div>

                  {/* Description & Rank */}
                  <p className="mt-6 text-sm text-slate-300 max-w-lg mx-auto leading-relaxed whitespace-pre-line">
                    {mainAward.description}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-4 text-xs font-mono text-cyan-400/80">
                    <span>Date: {mainAward.date}</span>
                    {mainAward.rank && (
                      <>
                        <span>•</span>
                        <span className="text-purple-300 font-semibold">Rank: {mainAward.rank}</span>
                      </>
                    )}
                    {mainAward.score && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-300 font-semibold">Score: {mainAward.score}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Other Awards Grid */}
            {otherAwards.length > 0 && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherAwards.map((award) => (
                  <div
                    key={award.id}
                    onClick={(e) => handleTriggerCelebration(e, award)}
                    className="relative p-5 rounded-2xl bg-[#081224]/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-[#0a1832] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    {/* Admin Item Actions */}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                        {onEditAward && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditAward(award);
                            }}
                            className="p-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 cursor-pointer"
                            title="수정"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        )}
                        {onDeleteAward && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAwardToDelete(award);
                            }}
                            className="p-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-mono border border-rose-500/30 cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1 pr-12">
                        <span>{award.date}</span>
                        {award.rank && (
                          <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-[10px]">
                            {award.rank}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
                        {award.title}
                      </h4>
                      <div className="text-xs text-slate-400 mb-2">{award.competition}</div>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 whitespace-pre-line">{award.description}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!awardToDelete}
        title="수상 내역 삭제"
        message="선택하신 수상 내역을 정말 삭제하시겠습니까?"
        itemName={awardToDelete ? `${awardToDelete.competition} - ${awardToDelete.title}` : ''}
        confirmText={isDeleting ? '삭제 중...' : '삭제하기'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setAwardToDelete(null)}
      />
    </section>
  );
};
