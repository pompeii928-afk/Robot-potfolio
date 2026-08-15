import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Cpu, Code2, Wrench, Radio, CircuitBoard, Binary, Crosshair, Eye, Users2, SearchCode, Sparkles } from 'lucide-react';
import { SkillItem } from '../../types';
import { ConfirmModal } from './ConfirmModal';

interface EditSkillModalProps {
  initialData?: SkillItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SkillItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const AVAILABLE_ICONS = [
  'Code2',
  'Wrench',
  'Cpu',
  'Radio',
  'CircuitBoard',
  'Binary',
  'Crosshair',
  'Eye',
  'SearchCode',
  'Users2',
  'Sparkles',
];

const CATEGORIES: SkillItem['category'][] = [
  'HARDWARE',
  'ACTUATION',
  'PERCEPTION',
  'FRAMEWORK',
  'ALGORITHM',
  'AI/VISION',
  'SOFT_SKILL',
];

const getDefaultSkill = (): SkillItem => ({
  id: `skill-${Date.now()}`,
  name: '',
  description: '',
  category: 'HARDWARE',
  proficiency: 85,
  iconName: 'Cpu',
  highlighted: false,
});

export const EditSkillModal: React.FC<EditSkillModalProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState<SkillItem>(initialData || getDefaultSkill());
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || getDefaultSkill());
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
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                {isEditing ? '역량 항목(Skill) 수정' : '새 역량 항목(Skill) 추가'}
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
            {/* Skill Name */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                역량 / 기술 명칭 (Skill Name) *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: ROS2 Humble & Navigation2"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Category & Proficiency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  분류 (Category) *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillItem['category'] })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  숙련도 (Proficiency: {formData.proficiency || 80}%)
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={formData.proficiency || 80}
                  onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 mt-2"
                />
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1.5">
                아이콘 선택 (Select Icon)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, iconName: icon })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                      formData.iconName === icon
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                역량 세부 설명 (Description) *
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="해당 기술을 어떻게 활용하는지, 대표 경험 및 성과를 서술하세요."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Highlight toggle */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#060e1f] border border-cyan-500/30">
              <input
                type="checkbox"
                id="skill-highlight-check"
                checked={!!formData.highlighted}
                onChange={(e) => setFormData({ ...formData, highlighted: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer"
              />
              <label htmlFor="skill-highlight-check" className="text-xs font-mono text-cyan-300 cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>강조 스킬로 설정 (카드 테두리 및 빛 효과)</span>
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
        title="역량 항목 삭제"
        message="정말로 이 역량 항목을 삭제하시겠습니까?"
        itemName={formData.name ? `[${formData.category}] ${formData.name}` : ''}
        confirmText={isDeleting ? '삭제 중...' : '삭제하기'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </>
  );
};
