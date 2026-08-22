import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, CheckCircle2, AlertTriangle, Plus, Edit3, Trash2 } from 'lucide-react';
import { JourneyItem } from '../types';
import { ConfirmModal } from './modals/ConfirmModal';

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

  const selectedItem: JourneyItem | undefined =
    journeys.find((j) => j.id === selectedJourneyId) || journeys[0];

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
    <section id="journey" className="relative py-16 sm:py-24 border-t border-cyan-500/10 scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-cyan-400 font-display text-2xl sm:text-3xl font-bold tracking-wide text-glow-cyan">
              <TrendingUp className="w-7 h-7 text-cyan-400" />
              <span>Competition Journey</span>
            </div>
            <div className="hidden sm:block w-32 h-[1px] bg-gradient-to-r from-cyan-500/40 via-cyan-500/10 to-transparent" />
          </div>

          {/* Admin Action: Add & Delete Journey */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              {onAddJourney && (
                <button
                  onClick={onAddJourney}
                  id="add-journey-btn"
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>대회 여정 추가</span>
                </button>
              )}
            </div>
          )}
        </div>

        {journeys.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#081224]/50 border border-dashed border-cyan-500/20 text-slate-400 font-mono text-sm">
            등록된 여정 기록이 없습니다. 관리자 모드에서 새로운 대회 여정을 추가해 보세요.
          </div>
        ) : (
          <>
            {/* Timeline Stepper Navigation */}
            <div className="mb-10 overflow-x-auto pb-4 scrollbar-thin">
              <div className="flex items-center gap-3 min-w-max">
                {journeys.map((item, idx) => {
                  const isSelected = selectedItem?.id === item.id;
                  const itemYear = item.year || item.season || '';
                  const itemTitle = item.competition || item.title || '';
                  return (
                    <div
                      key={item.id}
                      className={`relative group flex items-center gap-3 px-5 py-3 rounded-xl border text-left transition-all duration-300 ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white'
                          : 'bg-[#081224]/60 border-slate-800/80 text-slate-400 hover:border-cyan-500/40 hover:text-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedJourneyId(item.id)}
                        className="flex items-center gap-3 cursor-pointer text-left focus:outline-none"
                      >
                        <div
                          className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center border ${
                            isSelected
                              ? 'bg-cyan-400 text-black border-cyan-300 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          {item.step || idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-mono text-cyan-400 font-semibold">{itemYear}</div>
                          <div className="text-sm font-bold truncate max-w-[170px]">{itemTitle}</div>
                        </div>
                      </button>

                      {/* Admin Quick Delete Icon on Timeline Tab */}
                      {isAdmin && onDeleteJourney && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setJourneyToDelete(item);
                          }}
                          className="ml-1 p-1 rounded-md bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white transition-all cursor-pointer opacity-70 hover:opacity-100"
                          title="이 여정 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Journey Detailed View */}
            {selectedItem && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Competition Summary */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 sm:p-8 rounded-2xl bg-[#081224]/80 backdrop-blur-xl border border-cyan-500/30 relative overflow-hidden">
                    <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                      {selectedItem.year || selectedItem.season || ''} • STEP {selectedItem.step || 1}
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-3">
                      {selectedItem.competition || selectedItem.title || ''}
                    </h3>
                    <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-semibold bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 mb-6">
                      {selectedItem.award || '대회 참가 / 진행'}
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
                      {selectedItem.summary || selectedItem.description || ''}
                    </p>

                    {/* Team Info Pill */}
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300">
                      <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{selectedItem.teamName || selectedItem.team || 'Team K.F.C.Code Chaser'}</span>
                    </div>
                  </div>

                  {/* Team Members List */}
                  {selectedItem.members && selectedItem.members.length > 0 && (
                    <div className="p-5 rounded-2xl bg-[#081224]/60 border border-slate-800/80">
                      <div className="text-xs font-mono text-slate-400 uppercase mb-3">Team Lineup:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.members.map((member, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Detailed Card */}
                <div className="lg:col-span-7">
                  <div className="p-6 sm:p-8 rounded-2xl bg-[#0a152d]/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Top ambient glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Admin Item Edit/Delete Controls */}
                    {isAdmin && (
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/20">
                        <span className="text-xs font-mono text-cyan-400 font-bold">
                          선택된 여정 관리 (STEP {selectedItem.step || 1})
                        </span>
                        <div className="flex items-center gap-2">
                          {onEditJourney && (
                            <button
                              onClick={() => onEditJourney(selectedItem)}
                              className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> 수정
                            </button>
                          )}
                          {onDeleteJourney && (
                            <button
                              onClick={() => setJourneyToDelete(selectedItem)}
                              className="px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> 삭제
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Roles Section */}
                    <div className="mb-6">
                      <div className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase mb-2.5">
                        ROLE
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.roles?.map((role, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-md text-xs font-medium bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Strengths Section */}
                    <div className="mb-5 p-4 rounded-xl bg-[#061022]/70 border border-cyan-500/20">
                      <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300 mb-1.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Strengths:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6 whitespace-pre-line">
                        {selectedItem.strengths}
                      </p>
                    </div>

                    {/* Improvements Section */}
                    <div className="mb-6 p-4 rounded-xl bg-[#061022]/70 border border-rose-500/20">
                      <div className="flex items-center gap-2 text-sm font-semibold text-rose-400 mb-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Improvements:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6 whitespace-pre-line">
                        {selectedItem.improvements}
                      </p>
                    </div>

                    {/* Quote Footer Section */}
                    {selectedItem.quote && (
                      <div className="p-4 rounded-xl bg-cyan-950/30 border-l-4 border-cyan-400 text-xs sm:text-sm font-medium text-cyan-200/90 italic">
                        {selectedItem.quote}
                      </div>
                    )}

                    {/* Technical breakdown points if available */}
                    {selectedItem.detailedPoints && selectedItem.detailedPoints.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-cyan-500/20">
                        <div className="text-xs font-mono text-slate-400 uppercase mb-2">Technical Execution Notes:</div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {selectedItem.detailedPoints.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-cyan-400 mt-0.5">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!journeyToDelete}
        title="대회 여정 삭제"
        message="선택하신 대회 여정 기록을 정말 삭제하시겠습니까?"
        itemName={journeyToDelete ? `${journeyToDelete.year || journeyToDelete.season || ''} ${journeyToDelete.competition || journeyToDelete.title || ''}` : ''}
        confirmText={isDeleting ? '삭제 중...' : '삭제하기'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setJourneyToDelete(null)}
      />
    </section>
  );
};
