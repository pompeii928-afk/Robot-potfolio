import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, TrendingUp, Activity, Gauge, Users, Award, Tag, Sparkles } from 'lucide-react';
import { JourneyItem } from '../../types';
import { ConfirmModal } from './ConfirmModal';

interface EditJourneyModalProps {
  initialData?: JourneyItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: JourneyItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const getDefaultJourney = (): JourneyItem => ({
  id: `journey-${Date.now()}`,
  competition: '',
  year: `${new Date().getFullYear()}`,
  season: `${new Date().getFullYear()} Season`,
  period: '',
  teamName: 'Team K.F.C.Code Chaser',
  award: '대회 참가 / 수상',
  step: 1,
  roles: ['로봇 설계/제작', '알고리즘 제어'],
  summary: '',
  strengths: '',
  improvements: '',
  quote: '',
  members: ['배지훈'],
  detailedPoints: [],
  metrics: [
    { label: '완주 성공률', value: '96.4%' },
    { label: '평균 미션 타임', value: '1m 24s' },
    { label: '센서 반응 속도', value: '10ms' },
  ],
});

export const EditJourneyModal: React.FC<EditJourneyModalProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState<JourneyItem>(initialData || getDefaultJourney());
  const [roleInput, setRoleInput] = useState('');
  const [pointInput, setPointInput] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [newMetricLabel, setNewMetricLabel] = useState('');
  const [newMetricValue, setNewMetricValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const data = initialData || getDefaultJourney();
      setFormData({
        ...data,
        metrics: data.metrics && data.metrics.length > 0 ? data.metrics : [
          { label: '완주 성공률', value: '96.4%' },
          { label: '평균 미션 타임', value: '1m 24s' },
          { label: '센서 반응 속도', value: '10ms' },
        ],
      });
      setRoleInput('');
      setPointInput('');
      setMemberInput('');
      setNewMetricLabel('');
      setNewMetricValue('');
      setErrorMessage(null);
      setShowConfirmDelete(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // Roles helpers
  const addRole = () => {
    if (!roleInput.trim()) return;
    setFormData({
      ...formData,
      roles: [...formData.roles, roleInput.trim()],
    });
    setRoleInput('');
  };

  const removeRole = (idx: number) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter((_, i) => i !== idx),
    });
  };

  // Members helpers
  const addMember = () => {
    if (!memberInput.trim()) return;
    setFormData({
      ...formData,
      members: [...(formData.members || []), memberInput.trim()],
    });
    setMemberInput('');
  };

  const removeMember = (idx: number) => {
    setFormData({
      ...formData,
      members: (formData.members || []).filter((_, i) => i !== idx),
    });
  };

  // Technical points helpers
  const addPoint = () => {
    if (!pointInput.trim()) return;
    setFormData({
      ...formData,
      detailedPoints: [...(formData.detailedPoints || []), pointInput.trim()],
    });
    setPointInput('');
  };

  const removePoint = (idx: number) => {
    setFormData({
      ...formData,
      detailedPoints: (formData.detailedPoints || []).filter((_, i) => i !== idx),
    });
  };

  // Metrics / Telemetry helpers
  const addMetric = (label?: string, value?: string) => {
    const l = (label || newMetricLabel).trim();
    const v = (value || newMetricValue).trim();
    if (!l || !v) return;

    setFormData({
      ...formData,
      metrics: [...(formData.metrics || []), { label: l, value: v }],
    });
    if (!label) setNewMetricLabel('');
    if (!value) setNewMetricValue('');
  };

  const updateMetric = (idx: number, field: 'label' | 'value', val: string) => {
    const updated = [...(formData.metrics || [])];
    if (updated[idx]) {
      updated[idx] = {
        ...updated[idx],
        [field]: val,
      };
      setFormData({ ...formData, metrics: updated });
    }
  };

  const removeMetric = (idx: number) => {
    setFormData({
      ...formData,
      metrics: (formData.metrics || []).filter((_, i) => i !== idx),
    });
  };

  const metricPresets = [
    { label: '완주 성공률', value: '98.5%' },
    { label: '평균 미션 타임', value: '1m 18s' },
    { label: '센서 반응 속도', value: '8ms' },
    { label: '위치 추정 오차', value: '< 2.0cm' },
    { label: '통신 레이턴시', value: '15ms' },
    { label: '객체 인식률', value: '96.2%' },
    { label: 'PID 루프 주기', value: '120Hz' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSave({
        ...formData,
        // Keep title and season in sync for backwards compatibility
        title: formData.competition || formData.title,
        season: formData.year || formData.season,
        description: formData.summary || formData.description,
        team: formData.teamName || formData.team,
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('저장 중 오류가 발생했습니다. 네트워크 또는 권한을 확인해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!initialData?.id || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(initialData.id);
      setShowConfirmDelete(false);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('삭제 중 오류가 발생했습니다. 권한을 확인해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
      >
        <div
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#081224] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden text-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#050c1a] border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white tracking-wide">
                  {isEditing ? '대회 및 연구 여정(Journey) 수정' : '새 대회 여정(Journey) 등록'}
                </h3>
                <p className="text-[11px] font-mono text-cyan-400/70">
                  센서 반응 속도, 미션 타임, 성공률 및 모든 세부 필드 실시간 조정
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 max-h-[calc(92vh-140px)]">
            {/* Section 1: Basic Stage & Info */}
            <div className="p-4 rounded-xl bg-[#050c1a]/90 border border-cyan-500/20 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> 기본 대회 정보 및 단계
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-cyan-400 mb-1">
                    대회명 (Competition Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.competition || ''}
                    onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                    placeholder="예: World Robot Olympiad 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081224] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-400 mb-1">
                    단계 순서 (Step) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={formData.step || 1}
                    onChange={(e) => setFormData({ ...formData, step: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081224] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-cyan-400 mb-1">
                    연도 / 시즌 (Year / Season) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.year || ''}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="예: 2026 Season"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081224] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-400 mb-1">
                    활동 기간 (Period)
                  </label>
                  <input
                    type="text"
                    value={formData.period || ''}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="예: 2025.10 ~ 2026.08"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081224] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-400 mb-1">
                    팀명 (Team Name)
                  </label>
                  <input
                    type="text"
                    value={formData.teamName || ''}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    placeholder="예: Team K.F.C.Code Chaser"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081224] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-amber-400 mb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> 수상 내역 / 마일스톤 (Award Badge)
                </label>
                <input
                  type="text"
                  value={formData.award || ''}
                  onChange={(e) => setFormData({ ...formData, award: e.target.value })}
                  placeholder="예: 최우수상 (1위) / Think Award 2위"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#081224] border border-amber-500/40 text-amber-200 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  대회 개요 및 주요 목표 (Summary)
                </label>
                <textarea
                  rows={2}
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="대회의 목표, 미션 과제, 팀 구성 배경 등을 간략히 요약하세요."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#081224] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>

            {/* Section 2: PERFORMANCE METRICS & TELEMETRY (센서반응속도, 평균 미션 타임, 완주성공률 등) */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#051124] to-[#040915] border border-cyan-400/40 shadow-inner space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-cyan-300" />
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    실시간 텔레메트리 & 성능 지표 (Performance Metrics)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  센서 반응 속도, 완주율, 랩타임 수치 자유 수정
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <div className="text-[11px] font-mono text-cyan-400/80 mb-1.5 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" /> 추천 지표 템플릿 클릭 추가:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {metricPresets.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => addMetric(preset.label, preset.value)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 transition-all cursor-pointer hover:border-cyan-400"
                    >
                      + {preset.label} ({preset.value})
                    </button>
                  ))}
                </div>
              </div>

              {/* Existing Metric Items List */}
              <div className="space-y-2.5">
                {(formData.metrics || []).map((metric, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#08152e] border border-cyan-500/30 hover:border-cyan-400 transition-all"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-0.5">
                          지표 항목명 (Label)
                        </label>
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                          placeholder="예: 센서 반응 속도 / 완주 성공률"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#040b17] border border-cyan-500/30 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-0.5">
                          측정 수치 (Value)
                        </label>
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                          placeholder="예: 10ms / 96.4% / 1m 24s"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#040b17] border border-cyan-500/30 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMetric(idx)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer self-end mb-0.5"
                      title="지표 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Custom Metric Input */}
              <div className="pt-2 border-t border-cyan-500/20">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-mono text-cyan-400 mb-1">
                      새 지표 라벨 (Label)
                    </label>
                    <input
                      type="text"
                      value={newMetricLabel}
                      onChange={(e) => setNewMetricLabel(e.target.value)}
                      placeholder="예: 센서 반응 속도"
                      className="w-full px-3 py-2 rounded-lg bg-[#050c1a] border border-cyan-500/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-mono text-cyan-400 mb-1">
                      새 수치 값 (Value)
                    </label>
                    <input
                      type="text"
                      value={newMetricValue}
                      onChange={(e) => setNewMetricValue(e.target.value)}
                      placeholder="예: 10ms"
                      className="w-full px-3 py-2 rounded-lg bg-[#050c1a] border border-cyan-500/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => addMetric()}
                      className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    >
                      <Plus className="w-3.5 h-3.5" /> 추가
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Roles & Team Lineup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#050c1a]/90 border border-cyan-500/20">
              {/* Roles Chips */}
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> 담당 역할 태그 (Roles)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addRole();
                      }
                    }}
                    placeholder="예: 자율주행 제어 알고리즘"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#081224] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={addRole}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.roles.map((r, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono"
                    >
                      {r}
                      <button type="button" onClick={() => removeRole(idx)} className="hover:text-rose-400 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Members */}
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> 팀 라인업 멤버 (Team Members)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addMember();
                      }
                    }}
                    placeholder="예: 배지훈"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#081224] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={addMember}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.members || []).map((m, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    >
                      {m}
                      <button type="button" onClick={() => removeMember(idx)} className="hover:text-rose-400 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: 3-Pillar Insights (Strengths, Improvements, Quote) */}
            <div className="p-4 rounded-xl bg-[#050c1a]/90 border border-cyan-500/20 space-y-4">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                인사이트 및 성장 과정 (3-Pillar Insights)
              </div>

              {/* Strengths */}
              <div>
                <label className="block text-xs font-mono text-emerald-400 mb-1">
                  1. 주요 성과 및 잘한 점 (Strengths)
                </label>
                <textarea
                  rows={2}
                  value={formData.strengths || ''}
                  onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  placeholder="어떤 점이 성공적이었으며 우수한 성과를 낼 수 있었는지 서술하세요."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#081224] border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              {/* Improvements */}
              <div>
                <label className="block text-xs font-mono text-rose-400 mb-1">
                  2. 극복한 한계 및 개선점 (Improvements / Challenges)
                </label>
                <textarea
                  rows={2}
                  value={formData.improvements || ''}
                  onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                  placeholder="대회 과정에서 겪었던 시행착오나 기술적 한계, 개선한 사항을 서술하세요."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#081224] border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400 resize-none"
                />
              </div>

              {/* Quote / Reflection */}
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  3. 한 줄 총평 / 소감 (Quote)
                </label>
                <input
                  type="text"
                  value={formData.quote || ''}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="예: '대회 전까지 팀이 꾸준히 노력한 끝에 성장할 수 있었던 대회'"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#081224] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Section 5: Detailed Technical Points */}
            <div className="p-4 rounded-xl bg-[#050c1a]/90 border border-cyan-500/20 space-y-3">
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                기술 실행 세부 노트 (Technical Execution Notes)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={pointInput}
                  onChange={(e) => setPointInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPoint();
                    }
                  }}
                  placeholder="예: 듀얼 컬러 센서 기반의 고속 라인트레이싱 PID 제어 알고리즘 구현"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#081224] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={addPoint}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer hover:bg-cyan-900"
                >
                  <Plus className="w-3.5 h-3.5" /> 추가
                </button>
              </div>
              <ul className="space-y-1.5 text-xs">
                {(formData.detailedPoints || []).map((pt, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="truncate mr-2 text-slate-300 font-mono">• {pt}</span>
                    <button type="button" onClick={() => removePoint(idx)} className="text-slate-400 hover:text-rose-400 cursor-pointer p-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Footer */}
            <div className="pt-4 flex items-center justify-between border-t border-cyan-500/20">
              {isEditing && onDelete ? (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-mono text-rose-400 hover:text-white hover:bg-rose-950/80 border border-rose-500/40 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> 삭제
                </button>
              ) : <div />}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-700 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_20px_#00f0ff] cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? '저장 중...' : '저장 완료'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        title="대회 여정 삭제"
        message="정말로 이 대회 여정 기록을 삭제하시겠습니까?"
        itemName={formData.competition ? `${formData.year} - ${formData.competition}` : ''}
        confirmText={isDeleting ? '삭제 중...' : '삭제하기'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </>
  );
};
