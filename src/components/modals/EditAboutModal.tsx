import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import { AboutConfig } from '../../types';
import { ImageUploader } from '../ImageUploader';

interface EditAboutModalProps {
  initialData: AboutConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AboutConfig) => Promise<void>;
}

export const EditAboutModal: React.FC<EditAboutModalProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<AboutConfig>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setErrorMessage(null);
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
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || '저장 중 오류가 발생했습니다. 권한 및 파일 크기를 확인해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display text-lg font-bold text-white tracking-wide">
              Hero & 소개(About) 정보 수정
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
          {/* Main Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">메인 타이틀 1</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#060e1f] border border-cyan-500/30 text-xs font-sans text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">메인 타이틀 2 (그라데이션)</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#060e1f] border border-cyan-500/30 text-xs font-sans text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          </div>

          {/* Quote */}
          <div>
            <label className="block text-xs font-mono text-cyan-400 mb-1">강조 인용 문구 (Quote)</label>
            <input
              type="text"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#060e1f] border border-cyan-500/30 text-xs font-sans text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Bio paragraph 1 */}
          <div>
            <label className="block text-xs font-mono text-cyan-400 mb-1">소개 본문 1</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#060e1f] border border-cyan-500/30 text-xs font-sans text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Sub Bio paragraph 2 */}
          <div>
            <label className="block text-xs font-mono text-cyan-400 mb-1">소개 본문 2 (엔지니어 프로필)</label>
            <textarea
              rows={2}
              value={formData.subBio}
              onChange={(e) => setFormData({ ...formData, subBio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#060e1f] border border-cyan-500/30 text-xs font-sans text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-mono text-cyan-400 mb-1">목표 (Goal)</label>
            <input
              type="text"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#060e1f] border border-cyan-500/30 text-xs font-sans text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Status Bar Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">CURRENT FOCUS</label>
              <input
                type="text"
                value={formData.currentFocus}
                onChange={(e) => setFormData({ ...formData, currentFocus: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#060e1f] border border-slate-700 text-xs text-cyan-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">CORE DOMAIN</label>
              <input
                type="text"
                value={formData.coreDomain}
                onChange={(e) => setFormData({ ...formData, coreDomain: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#060e1f] border border-slate-700 text-xs text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">TEAM ROLE</label>
              <input
                type="text"
                value={formData.teamRole}
                onChange={(e) => setFormData({ ...formData, teamRole: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#060e1f] border border-slate-700 text-xs text-purple-400 font-mono"
              />
            </div>
          </div>

          {/* Hero Robot Arm Image */}
          <div className="pt-2">
            <ImageUploader
              label="시스템 뷰어 대표 로봇 이미지 (Robot System Viewer Image)"
              value={formData.heroImage}
              onChange={(img) => setFormData({ ...formData, heroImage: img })}
            />
          </div>

          {/* Submit Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-cyan-500/20">
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
        </form>
      </div>
    </div>
  );
};
