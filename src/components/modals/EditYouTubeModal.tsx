import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Youtube, Plus, Video, Image, Tag, Sparkles, RefreshCw, CheckCircle2, Play, AlertCircle, ExternalLink } from 'lucide-react';
import { YouTubeVideoItem } from '../../types';
import { ConfirmModal } from './ConfirmModal';
import { extractVideoId, getYouTubeThumbnail, fetchYouTubeInfo, handleThumbnailError } from '../../utils/youtubeHelper';
import { ModalBackdrop } from './ModalBackdrop';

interface EditYouTubeModalProps {
  initialData?: YouTubeVideoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: YouTubeVideoItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const getDefaultVideo = (): YouTubeVideoItem => ({
  id: `yt-${Date.now()}`,
  title: 'WRO Robot Autonomous Match Run',
  titleKo: 'WRO 로봇 자율주행 실전 경기 주행',
  description: 'Autonomous robotics mission run and control telemetry analysis.',
  descriptionKo: '대회 경기 주행 및 센서 튜닝, 미션 수행 영상 기록입니다.',
  youtubeUrl: 'https://www.youtube.com/watch?v=y4K_5A4wNrw',
  videoId: 'y4K_5A4wNrw',
  thumbnail: 'https://img.youtube.com/vi/y4K_5A4wNrw/hqdefault.jpg',
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

  // Auto-sync when URL is entered or pasted
  const handleUrlChange = async (url: string) => {
    const trimmed = url.trim();
    const videoId = extractVideoId(trimmed);
    const updatedThumbnail = videoId ? getYouTubeThumbnail(videoId) : formData.thumbnail;

    setFormData((prev) => ({
      ...prev,
      youtubeUrl: trimmed,
      videoId: videoId || prev.videoId,
      thumbnail: updatedThumbnail,
    }));

    if (videoId) {
      // Background attempt to fetch video metadata if title is empty
      try {
        const info = await fetchYouTubeInfo(trimmed);
        if (info && info.title) {
          setFormData((prev) => ({
            ...prev,
            title: prev.title && prev.title !== 'WRO Robot Autonomous Match Run' ? prev.title : info.title || prev.title,
            titleKo: prev.titleKo && prev.titleKo !== 'WRO 로봇 자율주행 실전 경기 주행' ? prev.titleKo : info.title || prev.titleKo,
            thumbnail: info.thumbnail_url || updatedThumbnail,
          }));
        }
      } catch {
        // ignore background fetch error
      }
    }
  };

  // Manual Trigger: Fetch title & thumbnail via oEmbed
  const handleFetchMetadata = async () => {
    if (!formData.youtubeUrl) return;
    setIsFetchingInfo(true);
    setFetchSuccess(false);

    try {
      const info = await fetchYouTubeInfo(formData.youtubeUrl);
      if (info) {
        setFormData((prev) => ({
          ...prev,
          title: info.title || prev.title,
          titleKo: info.title || prev.titleKo,
          thumbnail: info.thumbnail_url || (info.videoId ? getYouTubeThumbnail(info.videoId) : prev.thumbnail),
          videoId: info.videoId || prev.videoId,
        }));
        setFetchSuccess(true);
        setTimeout(() => setFetchSuccess(false), 2500);
      } else {
        const vId = extractVideoId(formData.youtubeUrl);
        if (vId) {
          setFormData((prev) => ({
            ...prev,
            videoId: vId,
            thumbnail: getYouTubeThumbnail(vId),
          }));
          setFetchSuccess(true);
          setTimeout(() => setFetchSuccess(false), 2000);
        }
      }
    } catch (e) {
      console.warn('Metadata fetch error:', e);
    } finally {
      setIsFetchingInfo(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const initial = initialData || getDefaultVideo();
      const vId = extractVideoId(initial.youtubeUrl);
      const guaranteedThumb = initial.thumbnail && !initial.thumbnail.includes('unsplash.com')
        ? initial.thumbnail
        : (vId ? getYouTubeThumbnail(vId) : 'https://img.youtube.com/vi/y4K_5A4wNrw/hqdefault.jpg');

      setFormData({
        ...initial,
        videoId: vId || initial.videoId || 'y4K_5A4wNrw',
        thumbnail: guaranteedThumb,
      });
      setTagInput('');
      setErrorMessage(null);
      setShowConfirmDelete(false);
      setFetchSuccess(false);
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

    const videoId = extractVideoId(formData.youtubeUrl) || formData.videoId || 'y4K_5A4wNrw';
    const finalThumbnail = formData.thumbnail || getYouTubeThumbnail(videoId);

    try {
      await onSave({
        ...formData,
        videoId,
        thumbnail: finalThumbnail,
        youtubeUrl: formData.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`,
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

  const liveVideoId = extractVideoId(formData.youtubeUrl) || formData.videoId;
  const liveThumbnail = formData.thumbnail || (liveVideoId ? getYouTubeThumbnail(liveVideoId) : 'https://img.youtube.com/vi/y4K_5A4wNrw/hqdefault.jpg');

  return (
    <>
      <ModalBackdrop
        isOpen={isOpen}
        onClose={onClose}
        maxWidthClass="max-w-2xl"
        zIndexClass="z-[9999]"
      >
        {/* Notion Header */}
        <div className="px-6 py-4 bg-[#fbfbfa] border-b border-[#e3e2de] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-[#37352f] tracking-tight">
                {isEditing ? '유튜브 영상 항목 수정' : '새 유튜브 영상 등록'}
              </h3>
              <p className="text-[11px] font-mono text-[#787774]">
                YouTube URL 입력 시 고화질 썸네일과 영상 정보가 자동 연동됩니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 max-h-[calc(90vh-140px)]">
            {/* YouTube URL input & Sync Button */}
            <div className="p-4 rounded-xl bg-[#f7f6f3] border border-[#e3e2de] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans font-bold text-[#37352f] flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-600" /> 유튜브 영상 URL (주소) *
                </label>
                <button
                  type="button"
                  onClick={handleFetchMetadata}
                  disabled={isFetchingInfo || !formData.youtubeUrl}
                  className="px-2.5 py-1 rounded-md text-[11px] font-sans font-medium flex items-center gap-1 bg-white hover:bg-[#efefed] text-[#37352f] border border-[#e3e2de] transition-colors cursor-pointer disabled:opacity-40 shadow-2xs"
                  title="유튜브에서 영상 제목과 원본 썸네일을 자동으로 가져옵니다"
                >
                  {isFetchingInfo ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-[#787774]" />
                      <span>불러오는 중...</span>
                    </>
                  ) : fetchSuccess ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">연동 완료!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>제목/썸네일 자동 불러오기</span>
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
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#e3e2de] focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] text-xs font-mono text-[#37352f] outline-none"
              />
              <p className="text-[11px] text-[#787774] font-sans">
                💡 일반 영상 링크, 쇼츠(Shorts), 공유 링크(youtu.be), 라이브 링크 모두 지원됩니다.
              </p>
            </div>

            {/* Live Thumbnail Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center p-3.5 rounded-xl bg-[#fbfbfa] border border-[#e3e2de]">
              <div className="sm:col-span-1 aspect-video w-full rounded-lg overflow-hidden relative bg-black/5 border border-[#e3e2de]">
                <img
                  src={liveThumbnail}
                  alt="Thumbnail Preview"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleThumbnailError(e, liveVideoId)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-xs">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-bold text-[#37352f]">
                    썸네일 연동 상태
                  </span>
                  {liveVideoId && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f1f1ef] text-[#787774]">
                      ID: {liveVideoId}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.thumbnail || ''}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="썸네일 주소 (자동 연동됨, 직접 수정 가능)"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#e3e2de] text-xs font-mono text-[#37352f] outline-none"
                />
                <p className="text-[10px] text-emerald-700 font-sans flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>유튜브 CDN 원본 썸네일이 실시간으로 정상 연결되어 있습니다.</span>
                </p>
              </div>
            </div>

            {/* Video Title (Korean / English) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f]">
                  영상 제목 (한국어) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleKo || ''}
                  onChange={(e) => setFormData({ ...formData, titleKo: e.target.value })}
                  placeholder="예: WRO 로봇 자율주행 실전 경기 주행"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#e3e2de] focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] text-xs font-sans text-[#37352f] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f]">
                  영상 제목 (영문 / 기본) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: WRO Robot Autonomous Match Run"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#e3e2de] focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] text-xs font-sans text-[#37352f] outline-none"
                />
              </div>
            </div>

            {/* Category & Duration & Views */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f]">
                  카테고리 (Category)
                </label>
                <select
                  value={formData.category || 'Competition'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#e3e2de] text-xs font-sans text-[#37352f] outline-none"
                >
                  <option value="Competition">Competition (대회/경기)</option>
                  <option value="Algorithm">Algorithm (알고리즘/제어)</option>
                  <option value="Hardware">Hardware (하드웨어/제작)</option>
                  <option value="Field Test">Field Test (필드테스트)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f]">
                  재생 시간 (Duration)
                </label>
                <input
                  type="text"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="예: 02:09"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#e3e2de] text-xs font-mono text-[#37352f] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f]">
                  조회수 표기 (Views)
                </label>
                <input
                  type="text"
                  value={formData.views || ''}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  placeholder="예: 1.2K"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#e3e2de] text-xs font-mono text-[#37352f] outline-none"
                />
              </div>
            </div>

            {/* Description (Korean / English) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f]">
                  영상 설명 (한국어)
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionKo || ''}
                  onChange={(e) => setFormData({ ...formData, descriptionKo: e.target.value })}
                  placeholder="대회 때 로봇이 어떻게 움직였고 어떤 결과를 냈는지에 대한 한국어 설명"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#e3e2de] text-xs font-sans text-[#37352f] outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-sans font-semibold text-[#37352f]">
                  영상 설명 (영문)
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="English summary of autonomous mission run."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#e3e2de] text-xs font-sans text-[#37352f] outline-none resize-none"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-semibold text-[#37352f]">
                태그 (Tags)
              </label>
              <div className="flex gap-2">
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
                  placeholder="태그 입력 후 엔터 또는 추가 (예: WRO 2026, 자율주행)"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#e3e2de] text-xs font-sans text-[#37352f] outline-none"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-1.5 rounded-lg bg-[#f7f6f3] hover:bg-[#efefed] text-[#37352f] border border-[#e3e2de] text-xs font-sans font-medium cursor-pointer"
                >
                  추가
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(formData.tags || []).map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f1f1ef] text-[#37352f] border border-[#e3e2de] text-xs font-sans"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => removeTag(idx)}
                      className="text-[#787774] hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </form>

          {/* Footer Controls */}
          <div className="px-6 py-3.5 bg-[#fbfbfa] border-t border-[#e3e2de] flex items-center justify-between">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="px-3 py-1.5 rounded-md bg-white hover:bg-rose-50 border border-[#e3e2de] hover:border-rose-200 text-rose-600 text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>영상 삭제</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-md bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] text-xs font-sans font-medium transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-md bg-[#2383e2] hover:bg-[#1a6cb8] text-white text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? '저장 중...' : '저장 완료'}</span>
              </button>
            </div>
          </div>
      </ModalBackdrop>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        title="영상 삭제 확인"
        message="이 유튜브 영상 항목을 포트폴리오에서 완전히 삭제하시겠습니까?"
        confirmText={isDeleting ? '삭제 중...' : '삭제하기'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </>
  );
};
