import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Youtube, Plus, Video, Image, Tag, Sparkles, RefreshCw, CheckCircle2, Play } from 'lucide-react';
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
  youtubeUrl: 'https://www.youtube.com/watch?v=y4K_5A4wNrw',
  videoId: 'y4K_5A4wNrw',
  thumbnail: 'https://img.youtube.com/vi/y4K_5A4wNrw/maxresdefault.jpg',
  duration: '02:09',
  tags: ['WRO 2026', '자율주행'],
  category: 'Competition',
  views: '1.2K',
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
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper to extract YouTube video ID from various YouTube URL formats
  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Fetch real YouTube metadata (Title, High-Res Thumbnail, Author) via oEmbed
  const fetchYouTubeMetadata = async (url: string) => {
    if (!url) return;
    const videoId = extractVideoId(url);
    setIsFetchingInfo(true);
    setFetchSuccess(false);

    try {
      // 1. If we have videoId, we can set direct high-res YouTube thumbnails instantly
      let bestThumb = '';
      if (videoId) {
        bestThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }

      // 2. Fetch title and official metadata via oEmbed
      const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          const autoTitle = data.title || '';
          setFormData((prev) => ({
            ...prev,
            title: prev.title || autoTitle,
            titleKo: prev.titleKo || autoTitle,
            thumbnail: bestThumb || data.thumbnail_url || prev.thumbnail,
            videoId: videoId || prev.videoId,
            youtubeUrl: url,
          }));
          setFetchSuccess(true);
          setTimeout(() => setFetchSuccess(false), 2500);
          return;
        }
      }

      // Fallback if oembed response didn't return title
      if (videoId) {
        setFormData((prev) => ({
          ...prev,
          thumbnail: bestThumb || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          videoId,
          youtubeUrl: url,
        }));
        setFetchSuccess(true);
        setTimeout(() => setFetchSuccess(false), 2000);
      }
    } catch (e) {
      console.warn('Could not auto-fetch oEmbed metadata:', e);
      if (videoId) {
        setFormData((prev) => ({
          ...prev,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          videoId,
          youtubeUrl: url,
        }));
      }
    } finally {
      setIsFetchingInfo(false);
    }
  };

  const handleUrlChange = (url: string) => {
    const videoId = extractVideoId(url);
    const updated: Partial<YouTubeVideoItem> = { youtubeUrl: url };
    if (videoId) {
      updated.videoId = videoId;
      // Auto-set high resolution thumbnail
      updated.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    setFormData({ ...formData, ...updated });
  };

  useEffect(() => {
    if (isOpen) {
      const initial = initialData || getDefaultVideo();
      setFormData(initial);
      setTagInput('');
      setErrorMessage(null);
      setShowConfirmDelete(false);
      setFetchSuccess(false);

      // Auto-extract thumbnail if it was a generic placeholder
      if (initial.youtubeUrl) {
        const vId = extractVideoId(initial.youtubeUrl);
        if (vId && (!initial.thumbnail || initial.thumbnail.includes('unsplash.com'))) {
          setFormData((prev) => ({
            ...prev,
            videoId: vId,
            thumbnail: `https://img.youtube.com/vi/${vId}/maxresdefault.jpg`,
          }));
        }
      }
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

    const videoId = extractVideoId(formData.youtubeUrl || '');
    let finalThumbnail = formData.thumbnail;
    if (videoId && (!finalThumbnail || finalThumbnail.includes('unsplash.com'))) {
      finalThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    try {
      await onSave({
        ...formData,
        videoId: videoId || formData.videoId,
        thumbnail: finalThumbnail,
        youtubeUrl: formData.youtubeUrl || 'https://www.youtube.com/watch?v=y4K_5A4wNrw',
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
                  @Wrocospace 공식 유튜브 영상 링크 및 썸네일 자동 연동
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
            {/* YouTube URL input & Sync Button */}
            <div className="p-3.5 rounded-xl bg-[#040813] border border-red-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-500" /> 유튜브 영상 URL (주소) *
                </label>
                <button
                  type="button"
                  onClick={() => fetchYouTubeMetadata(formData.youtubeUrl)}
                  disabled={isFetchingInfo || !formData.youtubeUrl}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/40 transition-all cursor-pointer disabled:opacity-40"
                  title="유튜브에서 제목과 원본 썸네일을 자동으로 가져옵니다"
                >
                  {isFetchingInfo ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-red-400" />
                      <span>불러오는 중...</span>
                    </>
                  ) : fetchSuccess ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">연동 완료!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>유튜브 정보 & 썸네일 자동 연동</span>
                    </>
                  )}
                </button>
              </div>

              <input
                type="text"
                required
                value={formData.youtubeUrl || ''}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=y4K_5A4wNrw 또는 https://youtu.be/..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#081224] border border-red-500/40 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-red-400"
              />
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <span>💡 유튜브 링크만 입력하면 유튜브에 올라간 실제 썸네일과 영상 ID가 자동으로 완벽히 동일하게 세팅됩니다.</span>
              </p>
            </div>

            {/* Thumbnail Live Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center p-3 rounded-xl bg-[#050c1a] border border-slate-800">
              <div className="sm:col-span-1 aspect-video w-full rounded-lg overflow-hidden relative bg-black border border-slate-700">
                <img
                  src={formData.thumbnail || 'https://img.youtube.com/vi/y4K_5A4wNrw/hqdefault.jpg'}
                  alt="Thumbnail Preview"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to standard quality if maxres isn't available
                    const target = e.currentTarget;
                    const vId = extractVideoId(formData.youtubeUrl);
                    if (vId && !target.src.includes('hqdefault')) {
                      target.src = `https://img.youtube.com/vi/${vId}/hqdefault.jpg`;
                    }
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                  <Play className="w-6 h-6 text-white/80 fill-white/80" />
                </div>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <span className="text-[11px] font-mono text-cyan-400 block font-bold">
                  유튜브 썸네일 미리보기 (Live Preview)
                </span>
                <input
                  type="text"
                  value={formData.thumbnail || ''}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="썸네일 주소 (자동 생성됨)"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#081224] border border-slate-700 text-slate-300 text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

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
                  placeholder="예: WRO 로봇 자율주행 실전 경기 주행 및 미션 결과 분석"
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
                  placeholder="예: WRO Robot Autonomous Match Run & Mission Results"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#050c1a] border border-red-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400"
                />
              </div>
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
                  placeholder="예: 02:09"
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

            {/* Description (Korean / English) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-red-400 mb-1">
                  영상 설명 (한국어 - Korean Description)
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionKo || ''}
                  onChange={(e) => setFormData({ ...formData, descriptionKo: e.target.value })}
                  placeholder="대회 때 로봇이 어떻게 움직였고 어떤 결과를 냈는지에 대한 한국어 설명"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-red-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-red-400 mb-1">
                  영상 설명 (영문 - English Description)
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Match run and autonomous algorithm details in English..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-red-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400 resize-none"
                />
              </div>
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
