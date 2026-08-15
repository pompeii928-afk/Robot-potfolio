import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Trophy, Sparkles } from 'lucide-react';
import { AwardItem } from '../../types';
import { ConfirmModal } from './ConfirmModal';

interface EditAwardModalProps {
  initialData?: AwardItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AwardItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const getDefaultAward = (): AwardItem => ({
  id: `award-${Date.now()}`,
  title: '',
  competition: '',
  date: `${new Date().getFullYear()}`,
  category: 'Robotics Competition',
  description: '',
  highlight: false,
  rank: 'Winner',
  score: '',
});

export const EditAwardModal: React.FC<EditAwardModalProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState<AwardItem>(initialData || getDefaultAward());
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || getDefaultAward());
      setErrorMessage(null);
      setShowConfirmDelete(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

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
          className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-[#081224] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden text-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#050c1a] border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                {isEditing ? '수상 내역(Award) 수정' : '새 수상 내역(Award) 추가'}
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
            {/* Main Title (Award Name) */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                수상명 (Award Title) *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="예: 최우수상 (1등), 대상, Best Engineering Award"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Competition Name */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                대회명 (Competition Name) *
              </label>
              <input
                type="text"
                required
                value={formData.competition}
                onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                placeholder="예: 2024 IRC 국제로봇콘테스트, 로봇융합페스티벌"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Grid: Date & Rank */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  수상 연도 / 일자 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="예: 2024.10 또는 2024"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  순위 / 구분 (Rank / Grade)
                </label>
                <input
                  type="text"
                  value={formData.rank || ''}
                  onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                  placeholder="예: 1st Place, 1위, 최우수상"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Score / Additional Metric */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                기록 / 점수 (Score / Additional Info)
              </label>
              <input
                type="text"
                value={formData.score || ''}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                placeholder="예: 98.5 pts, Lap Time 14.2s (선택사항)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                수상 내용 및 성과 요약 (Description)
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="대회에서 달성한 성과, 미션 수행 내용, 로봇의 핵심 제어 특징 등을 입력하세요."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Highlight Toggle */}
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3">
              <input
                type="checkbox"
                id="award-highlight-check"
                checked={!!formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer"
              />
              <label htmlFor="award-highlight-check" className="text-xs font-mono text-cyan-300 cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>메인 하이라이트 메달 카드로 지정 (중앙 메인 배너)</span>
              </label>
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
        title="수상 내역 삭제"
        message="정말로 이 수상 내역을 삭제하시겠습니까?"
        itemName={formData.title ? `${formData.competition} - ${formData.title}` : ''}
        confirmText={isDeleting ? '삭제 중...' : '삭제하기'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </>
  );
};
