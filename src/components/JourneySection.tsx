import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, CheckCircle2, AlertTriangle, Plus, Edit3, Trash2 } from 'lucide-react';
import { JourneyItem } from '../types';
import { ConfirmModal } from './modals/ConfirmModal';
import { useTheme, useLanguage } from '../context/ThemeContext';
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
  const { theme } = useTheme();
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
    <section
      id="journey"
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
              <TrendingUp className={`w-7 h-7 ${theme === 'light' ? 'text-sky-600' : 'text-cyan-400'}`} />
              <span>{t('journey.title')}</span>
            </div>
            <div
              className={`hidden sm:block w-32 h-[1px] ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-sky-400/50 via-sky-300/20 to-transparent'
                  : 'bg-gradient-to-r from-cyan-500/40 via-cyan-500/10 to-transparent'
              }`}
            />
          </div>

          {/* Admin Action: Add Journey */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              {onAddJourney && (
                <button
                  onClick={onAddJourney}
                  id="add-journey-btn"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-700 shadow-sm'
                      : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('journey.addBtn')}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {journeys.length === 0 ? (
          <div
            className={`p-12 text-center rounded-2xl border border-dashed font-mono text-sm ${
              theme === 'light'
                ? 'bg-slate-50 border-slate-300 text-slate-500'
                : 'bg-[#081224]/50 border-cyan-500/20 text-slate-400'
            }`}
          >
            {lang === 'en'
              ? 'No journey entries found. Please add new competition journey milestones in admin mode.'
              : '등록된 여정 기록이 없습니다. 관리자 모드에서 새로운 대회 여정을 추가해 보세요.'}
          </div>
        ) : (
          <>
            {/* Timeline Stepper Navigation */}
            <div className="mb-10 overflow-x-auto pb-4 scrollbar-thin">
              <div className="flex items-center gap-3 min-w-max">
                {localizedJourneys.map((item, idx) => {
                  const rawItem = journeys[idx] || item;
                  const isSelected = selectedItem?.id === item.id;
                  const itemYear = item.year || item.season || '';
                  const itemTitle = item.competition || item.title || '';
                  return (
                    <div
                      key={item.id}
                      className={`relative group flex items-center gap-3 px-5 py-3 rounded-xl border text-left transition-all duration-300 ${
                        isSelected
                          ? theme === 'light'
                            ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-md ring-1 ring-sky-300'
                            : 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white'
                          : theme === 'light'
                            ? 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:text-slate-900 shadow-sm'
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
                              ? theme === 'light'
                                ? 'bg-sky-600 text-white border-sky-500 font-bold'
                                : 'bg-cyan-400 text-black border-cyan-300 font-bold'
                              : theme === 'light'
                                ? 'bg-slate-100 text-slate-600 border-slate-300'
                                : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          {item.step || idx + 1}
                        </div>
                        <div>
                          <div
                            className={`text-xs font-mono font-semibold ${
                              theme === 'light' ? 'text-sky-600' : 'text-cyan-400'
                            }`}
                          >
                            {itemYear}
                          </div>
                          <div className="text-sm font-bold truncate max-w-[170px]">{itemTitle}</div>
                        </div>
                      </button>

                      {/* Admin Quick Delete Icon on Timeline Tab */}
                      {isAdmin && onDeleteJourney && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setJourneyToDelete(rawItem);
                          }}
                          className={`ml-1 p-1 rounded-md transition-all cursor-pointer ${
                            theme === 'light'
                              ? 'bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600'
                              : 'bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white'
                          }`}
                          title="Delete Journey"
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
                  <div
                    className={`p-6 sm:p-8 rounded-2xl backdrop-blur-xl border relative overflow-hidden transition-all ${
                      theme === 'light'
                        ? 'bg-white border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.06)]'
                        : 'bg-[#081224]/80 border-cyan-500/30'
                    }`}
                  >
                    <div
                      className={`text-xs font-mono uppercase tracking-wider mb-1 ${
                        theme === 'light' ? 'text-sky-600' : 'text-cyan-400'
                      }`}
                    >
                      {selectedItem.year || selectedItem.season || ''} • STEP {selectedItem.step || 1}
                    </div>
                    <h3
                      className={`font-display text-2xl sm:text-3xl font-extrabold mb-3 ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {selectedItem.competition || selectedItem.title || ''}
                    </h3>
                    <div
                      className={`inline-block px-3 py-1 rounded-md text-xs font-mono font-semibold mb-6 border ${
                        theme === 'light'
                          ? 'bg-sky-50 border-sky-300 text-sky-800'
                          : 'bg-cyan-950/80 border-cyan-400/50 text-cyan-300'
                      }`}
                    >
                      {selectedItem.award || (lang === 'en' ? 'Participant / In Progress' : '대회 참가 / 진행')}
                    </div>

                    <p
                      className={`text-sm leading-relaxed mb-6 whitespace-pre-line ${
                        theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                      }`}
                    >
                      {selectedItem.summary || selectedItem.description || ''}
                    </p>

                    {/* Team Info Pill */}
                    <div
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-mono ${
                        theme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <Users className={`w-4 h-4 shrink-0 ${theme === 'light' ? 'text-sky-600' : 'text-cyan-400'}`} />
                      <span>{selectedItem.teamName || selectedItem.team || 'Team K.F.C.Code Chaser'}</span>
                    </div>
                  </div>

                  {/* Team Members List */}
                  {selectedItem.members && selectedItem.members.length > 0 && (
                    <div
                      className={`p-5 rounded-2xl border ${
                        theme === 'light'
                          ? 'bg-white border-slate-200 shadow-sm'
                          : 'bg-[#081224]/60 border-slate-800/80'
                      }`}
                    >
                      <div className="text-xs font-mono text-slate-400 uppercase mb-3">Team Lineup:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.members.map((member, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded border text-xs font-mono ${
                              theme === 'light'
                                ? 'bg-slate-100 border-slate-200 text-slate-800'
                                : 'bg-slate-900 border-slate-700 text-slate-300'
                            }`}
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
                  <div
                    className={`p-6 sm:p-8 rounded-2xl backdrop-blur-xl border relative overflow-hidden transition-all ${
                      theme === 'light'
                        ? 'bg-white border-slate-200/90 shadow-[0_10px_40px_rgba(15,23,42,0.08)]'
                        : 'bg-[#0a152d]/90 border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    {/* Top ambient glow */}
                    <div
                      className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-2xl pointer-events-none ${
                        theme === 'light' ? 'bg-sky-400/10' : 'bg-cyan-500/10'
                      }`}
                    />

                    {/* Admin Item Edit/Delete Controls */}
                    {isAdmin && (
                      <div
                        className={`flex items-center justify-between mb-4 pb-3 border-b ${
                          theme === 'light' ? 'border-slate-200' : 'border-cyan-500/20'
                        }`}
                      >
                        <span
                          className={`text-xs font-mono font-bold ${
                            theme === 'light' ? 'text-sky-700' : 'text-cyan-400'
                          }`}
                        >
                          STEP {selectedItem.step || 1}
                        </span>
                        <div className="flex items-center gap-2">
                          {onEditJourney && rawSelectedItem && (
                            <button
                              onClick={() => onEditJourney(rawSelectedItem)}
                              className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                                theme === 'light'
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                                  : 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300'
                              }`}
                            >
                              <Edit3 className="w-3.5 h-3.5" /> {t('journey.edit')}
                            </button>
                          )}
                          {onDeleteJourney && rawSelectedItem && (
                            <button
                              onClick={() => setJourneyToDelete(rawSelectedItem)}
                              className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                                theme === 'light'
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                                  : 'bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> {t('journey.delete')}
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Roles Section */}
                    <div className="mb-6">
                      <div
                        className={`text-xs font-mono font-semibold tracking-wider uppercase mb-2.5 ${
                          theme === 'light' ? 'text-sky-700' : 'text-cyan-400'
                        }`}
                      >
                        {t('journey.roles')}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.roles?.map((role, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-md text-xs font-medium border ${
                              theme === 'light'
                                ? 'bg-sky-50 border-sky-200 text-sky-800'
                                : 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                            }`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Strengths Section */}
                    <div
                      className={`mb-5 p-4 rounded-xl border ${
                        theme === 'light'
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : 'bg-[#061022]/70 border-cyan-500/20'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 text-sm font-semibold mb-1.5 ${
                          theme === 'light' ? 'text-emerald-800' : 'text-cyan-300'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${
                            theme === 'light' ? 'text-emerald-600' : 'text-cyan-400'
                          }`}
                        />
                        <span>{t('journey.strengths')}:</span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm leading-relaxed pl-6 whitespace-pre-line ${
                          theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                        }`}
                      >
                        {selectedItem.strengths}
                      </p>
                    </div>

                    {/* Improvements Section */}
                    <div
                      className={`mb-6 p-4 rounded-xl border ${
                        theme === 'light'
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-[#061022]/70 border-rose-500/20'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 text-sm font-semibold mb-1.5 ${
                          theme === 'light' ? 'text-amber-800' : 'text-rose-400'
                        }`}
                      >
                        <AlertTriangle
                          className={`w-4 h-4 shrink-0 ${
                            theme === 'light' ? 'text-amber-600' : 'text-rose-400'
                          }`}
                        />
                        <span>{t('journey.improvements')}:</span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm leading-relaxed pl-6 whitespace-pre-line ${
                          theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                        }`}
                      >
                        {selectedItem.improvements}
                      </p>
                    </div>

                    {/* Quote Footer Section */}
                    {selectedItem.quote && (
                      <div
                        className={`p-4 rounded-xl border-l-4 text-xs sm:text-sm font-medium italic ${
                          theme === 'light'
                            ? 'bg-sky-50/80 border-sky-500 text-sky-900'
                            : 'bg-cyan-950/30 border-cyan-400 text-cyan-200/90'
                        }`}
                      >
                        {selectedItem.quote}
                      </div>
                    )}

                    {/* Technical breakdown points if available */}
                    {selectedItem.detailedPoints && selectedItem.detailedPoints.length > 0 && (
                      <div
                        className={`mt-5 pt-5 border-t ${
                          theme === 'light' ? 'border-slate-200' : 'border-cyan-500/20'
                        }`}
                      >
                        <div className="text-xs font-mono text-slate-400 uppercase mb-2">
                          {t('journey.keyPoints')}:
                        </div>
                        <ul
                          className={`space-y-1.5 text-xs ${
                            theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                          }`}
                        >
                          {selectedItem.detailedPoints.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className={theme === 'light' ? 'text-sky-600 mt-0.5' : 'text-cyan-400 mt-0.5'}>
                                •
                              </span>
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
