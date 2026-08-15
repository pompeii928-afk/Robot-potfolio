import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, TrendingUp } from 'lucide-react';
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
  teamName: 'Team K.F.C.Code Chaser',
  award: '대회 참가 / 수상',
  step: 1,
  roles: ['로봇 설계/제작', '알고리즘 제어'],
  summary: '',
  strengths: '',
  improvements: '',
  quote: '',
  members: ['박지환'],
  detailedPoints: [],
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
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || getDefaultJourney());
      setRoleInput('');
      setPointInput('');
      setMemberInput('');
      setErrorMessage(null);
      setShowConfirmDelete(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('저장 중 오류가 발생했습니다. 권한을 확인해주세요.');
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
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#081224] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden text-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#050c1a] border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                {isEditing ? '대회 여정(Journey) 수정' : '새 대회 여정(Journey) 추가'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
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
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 max-h-[calc(90vh-140px)]">
            {/* Grid 1: Competition & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  대회명 (Competition) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.competition}
                  onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                  placeholder="예: 2024 IRC 국제로봇콘테스트"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  연도 / 기간 (Year / Period) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="예: 2024"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Grid 2: Team Name & Award */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  팀명 (Team Name)
                </label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  placeholder="예: Team K.F.C.Code Chaser"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  수상 내역 (Award Badge)
                </label>
                <input
                  type="text"
                  value={formData.award}
                  onChange={(e) => setFormData({ ...formData, award: e.target.value })}
                  placeholder="예: 최우수상 (1위) / 국회의원상"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                대회 개요 및 주요 목표 (Summary)
              </label>
              <textarea
                rows={2}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="대회의 목표, 미션 과제, 팀 구성 배경 등을 간략히 요약하세요."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Roles Chips */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                담당 역할 태그 (Roles)
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
                  placeholder="예: 자율주행 제어 알고리즘 개발"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={addRole}
                  className="px-3 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> 추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.roles.map((r, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-cyan-950/60 border border-cyan-500/40 text-cyan-300"
                  >
                    {r}
                    <button type="button" onClick={() => removeRole(idx)} className="hover:text-rose-400 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                주요 성과 및 잘한 점 (Strengths)
              </label>
              <textarea
                rows={2}
                value={formData.strengths}
                onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                placeholder="어떤 점이 성공적이었으며 우수한 성과를 낼 수 있었는지 서술하세요."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Improvements */}
            <div>
              <label className="block text-xs font-mono text-rose-400 mb-1">
                극복한 한계 및 개선점 (Improvements)
              </label>
              <textarea
                rows={2}
                value={formData.improvements}
                onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                placeholder="대회 과정에서 겪었던 시행착오나 기술적 한계, 개선한 사항을 서술하세요."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400 resize-none"
              />
            </div>

            {/* Quote / Reflection */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                한 줄 총평 / 소감 (Quote)
              </label>
              <input
                type="text"
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="예: '하드웨어의 오차를 소프트웨어 칼만 필터와 제어 루프로 완벽히 극복한 대회'"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Detailed Points */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                기술 실행 세부 노트 (Technical Notes)
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
                  placeholder="예: IMU 센서 퓨전을 통한 실시간 드리프트 보정"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={addPoint}
                  className="px-3 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> 추가
                </button>
              </div>
              <ul className="space-y-1 text-xs">
                {(formData.detailedPoints || []).map((pt, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="truncate mr-2 text-slate-300">• {pt}</span>
                    <button type="button" onClick={() => removePoint(idx)} className="text-slate-400 hover:text-rose-400 cursor-pointer">
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
                  className="px-3.5 py-2 rounded-xl text-xs font-mono text-rose-400 hover:text-white hover:bg-rose-950/80 border border-rose-500/40 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> 삭제
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-700 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-1.5 shadow-[0_0_15px_#00f0ff] cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? '저장 중...' : '저장'}</span>
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
