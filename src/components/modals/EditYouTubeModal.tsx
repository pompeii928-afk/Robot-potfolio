import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Youtube, Plus, Video, Image, Tag, Sparkles } from 'lucide-react';
import { YouTubeVideoItem } from '../../types';
import { ConfirmModal } from './ConfirmModal';

interface EditYouTubeModalProps {
  initialData?: YouTubeVideoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: YouTubeVideoItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const getDefaultVideo = (): YouTubeVideoItem => ({
  id: `yt-${Date.now()}`,
  title: '',
  titleKo: '',
  description: '',
  youtubeUrl: 'http://www.youtube.com/@Wrocospace',
  videoId: '',
  thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
  duration: '02:30',
  tags: ['WRO 2026', '자율주행'],
  category: 'Competition',
  views: '1.0K',
  isFeatured: false,
});

export const EditYouTubeModal: React.FC<EditYouTubeModalProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState<YouTubeVideoItem>(initialData || getDefaultVideo());
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || getDefaultVideo());
      setTagInput('');
      setErrorMessage(null);
      setShowConfirmDelete(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const addTag = () => {
    if (!tagInput.trim()) return;
    setFormData({
      ...formData,
      tags: [...(formData.tags || []), tagInput.trim()],
    });
    setTagInput('');
  };

  const removeTag = (idx: number) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSave({
        ...formData,
        youtubeUrl: formData.youtubeUrl || 'http://www.youtube.com/@Wrocospace',
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
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#081224] border border-red-500/40 shadow-[0_0_50px_rgba(220,38,38,0.3)] overflow-hidden text-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#050c1a] border-b border-red-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400">
                <Youtube className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white tracking-wide">
                  {isEditing ? '유튜브 영상 항목 수정' : '새 유튜브 영상 등록'}
                </h3>
                <p className="text-[11px] font-mono text-red-400/80">
                  @Wrocospace 공식 채널 영상 및 주행 영상 링크 관리
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

          {/* Error message */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 max-h-[calc(90vh-140px)]">
            {/* Title (Korean / English) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-red-400 mb-1">
                  영상 제목 (한국어) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleKo || ''}
                  onChange={(e) => setFormData({ ...formData, titleKo: e.target.value })}
                  placeholder="예: WRO 로보미션 고속 주행 테스트"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#050c1a] border border-red-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-red-400 mb-1">
                  영상 제목 (영문 / 기본) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: WRO Autonomous Mission Run"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#050c1a] border border-red-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400"
                />
              </div>
            </div>

            {/* YouTube URL / Channel link */}
            <div>
              <label className="block text-xs font-mono text-red-400 mb-1">
                유튜브 영상 링크 또는 채널 URL (YouTube URL) *
              </label>
              <input
                type="text"
                required
                value={formData.youtubeUrl || ''}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="http://www.youtube.com/@Wrocospace 또는 https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#050c1a] border border-red-500/30 text-white text-xs font-mono focus:outline-none focus:border-red-400"
              />
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-xs font-mono text-red-400 mb-1 flex items-center gap-1">
                <Image className="w-3.5 h-3.5" /> 썸네일 이미지 URL (Thumbnail Image)
              </label>
              <input
                type="text"
                value={formData.thumbnail || ''}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://images.unsplash.com/... 또는 직접 입력"
                className="w-full px-3.5 py-2 rounded-xl bg-[#050c1a] border border-red-500/30 text-white text-xs font-mono focus:outline-none focus:border-red-400"
              />
            </div>

            {/* Category & Duration & Views */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-red-400 mb-1">
                  카테고리 (Category)
                </label>
                <select
                  value={formData.category || 'Competition'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#050c1a] border border-red-500/30 text-white text-xs font-mono focus:outline-none focus:border-red-400"
                >
                  <option value="Competition">Competition (대회/경기)</option>
                  <option value="Algorithm">Algorithm (알고리즘/제어)</option>
                  <option value="Hardware">Hardware (하드웨어/제작)</option>
                  <option value="Field Test">Field Test (필드테스트)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-red-400 mb-1">
                  재생 시간 (Duration)
                </label>
                <input
                  type="text"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="예: 02:45"
                  className="w-full px-3 py-2 rounded-xl bg-[#050c1a] border border-red-500/30 text-white text-xs font-mono focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-red-400 mb-1">
                  조회수 표기 (Views)
                </label>
                <input
                  type="text"
                  value={formData.views || ''}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  placeholder="예: 1.2K"
                  className="w-full px-3 py-2 rounded-xl bg-[#050c1a] border border-red-500/30 text-white text-xs font-mono focus:outline-none focus:border-red-400"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-red-400 mb-1">
                영상 설명 (Description)
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="영상의 주요 내용, 기술적 포인트, 사용된 센서 및 알고리즘을 간략히 설명하세요."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-red-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-mono text-red-400 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> 태그 (Tags)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="예: WRO 2026, 자율주행"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#050c1a] border border-red-500/30 text-white text-xs focus:outline-none focus:border-red-400"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-1.5 rounded-lg bg-red-950 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> 추가
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(formData.tags || []).map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-red-950/60 border border-red-500/40 text-red-300 font-mono"
                  >
                    #{t}
                    <button type="button" onClick={() => removeTag(idx)} className="hover:text-white cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 flex items-center justify-between border-t border-red-500/20">
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
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-red-600 hover:bg-red-500 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer disabled:opacity-50"
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
        title="유튜브 영상 항목 삭제"
        message="정말로 이 유튜브 영상 항목을 삭제하시겠습니까?"
        itemName={formData.title || formData.titleKo || ''}
        confirmText={isDeleting ? '삭제 중...' : '삭제하기'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </>
  );
};
