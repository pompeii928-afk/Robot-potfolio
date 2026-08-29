import React, { useState } from 'react';
import {
  Youtube,
  Play,
  ExternalLink,
  Plus,
  Edit3,
  Trash2,
  Tv,
  Share2,
  X,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { YouTubeVideoItem } from '../types';
import { DEFAULT_CHANNEL_INFO } from '../data/portfolioData';
import { useLanguage } from '../context/ThemeContext';
import { ConfirmModal } from './modals/ConfirmModal';
import { extractVideoId, getYouTubeThumbnail, handleThumbnailError } from '../utils/youtubeHelper';
import { ModalBackdrop } from './modals/ModalBackdrop';

interface YouTubeSectionProps {
  videos: YouTubeVideoItem[];
  isAdmin?: boolean;
  onAddVideo?: () => void;
  onEditVideo?: (video: YouTubeVideoItem) => void;
  onDeleteVideo?: (id: string) => Promise<void>;
}

export const YouTubeSection: React.FC<YouTubeSectionProps> = ({
  videos,
  isAdmin = false,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
}) => {
  const { lang, t } = useLanguage();

  const [activePlayingVideo, setActivePlayingVideo] = useState<YouTubeVideoItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<YouTubeVideoItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const channelInfo = DEFAULT_CHANNEL_INFO;

  const standardCategories = ['ALL', 'Competition', 'Algorithm', 'Hardware'];
  const videoCategories = Array.from(new Set(videos.map((v) => v.category).filter(Boolean))) as string[];
  const allCategoryKeys = Array.from(new Set(['ALL', ...standardCategories.slice(1), ...videoCategories]));

  const filteredVideos = videos.filter((v) => {
    if (activeFilter === 'ALL') return true;
    return v.category?.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleShareChannel = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(channelInfo.channelUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !onDeleteVideo) return;
    setIsDeleting(true);
    try {
      await onDeleteVideo(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const channelBio = lang === 'en' && channelInfo.description ? channelInfo.description : (channelInfo.descriptionKo || channelInfo.description);
  const channelTopics = lang === 'en' ? channelInfo.topics : (channelInfo.topicsKo || channelInfo.topics);

  return (
    <section id="youtube-section" className="relative py-10 sm:py-14 border-t border-[#e3e2de] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notion Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none">📺</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#37352f] tracking-tight">
                {t('youtube.sectionTitle', '유튜브 & 실전 주행 영상')}
              </h2>
              <p className="text-xs sm:text-sm text-[#787774] mt-0.5">
                {t('youtube.sectionDesc', '대회 경기 주행, 센서 튜닝, 미션 수행 영상 기록입니다.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Action: Add Video */}
            {isAdmin && onAddVideo && (
              <button
                onClick={onAddVideo}
                id="add-youtube-btn"
                className="px-3 py-1.5 rounded-md text-xs font-sans font-medium flex items-center gap-1.5 bg-[#f7f6f3] hover:bg-[#efefed] text-[#37352f] border border-[#e3e2de] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#787774]" />
                <span>{t('youtube.addVideo', '새 영상 추가')}</span>
              </button>
            )}

            {/* Visit Channel Link */}
            <a
              href={channelInfo.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-md text-xs font-sans font-medium flex items-center gap-1.5 bg-[#f1f1ef] hover:bg-[#e3e2de] text-[#37352f] border border-[#e3e2de] transition-colors"
            >
              <Youtube className="w-3.5 h-3.5 text-red-600" />
              <span>{t('youtube.visitChannel', '채널 방문')}</span>
              <ExternalLink className="w-3 h-3 text-[#787774]" />
            </a>
          </div>
        </div>

        {/* Notion Channel Callout Card */}
        <div className="mb-6 p-4 sm:p-5 rounded-xl bg-[#f7f6f3] border border-[#e3e2de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-[#e3e2de] flex items-center justify-center text-red-600 shrink-0 shadow-2xs">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-sans font-bold text-[#37352f] flex items-center gap-2">
                <span>{channelInfo.channelName}</span>
                <span className="text-xs font-mono text-[#787774] font-normal">{channelInfo.handle}</span>
              </div>
              <p className="text-xs text-[#787774] line-clamp-1 mt-0.5">
                {channelBio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleShareChannel}
              className="px-2.5 py-1 rounded text-xs font-sans bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] flex items-center gap-1 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3 text-[#787774]" />}
              <span>{copiedLink ? (lang === 'en' ? 'Copied' : '복사됨') : (lang === 'en' ? 'Share' : '공유')}</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          {allCategoryKeys.map((catKey) => {
            const isSelected = activeFilter.toLowerCase() === catKey.toLowerCase();
            return (
              <button
                key={catKey}
                onClick={() => setActiveFilter(catKey)}
                className={`px-3 py-1 rounded-md text-xs font-sans font-medium transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-[#37352f] text-white border-[#37352f]'
                    : 'bg-[#f7f6f3] text-[#787774] border-[#e3e2de] hover:bg-[#efefed] hover:text-[#37352f]'
                }`}
              >
                {catKey === 'ALL' ? (lang === 'en' ? 'All Videos' : '전체 영상') : catKey}
              </button>
            );
          })}
        </div>

        {/* Videos Gallery Grid */}
        {filteredVideos.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-[#e3e2de] bg-[#f7f6f3] text-sm text-[#787774]">
            {lang === 'en' ? 'No videos found in this category.' : '해당 카테고리에 영상이 없습니다.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVideos.map((video) => {
              const videoId = video.videoId || extractVideoId(video.youtubeUrl);
              const thumbUrl = getYouTubeThumbnail(video);

              return (
                <div
                  key={video.id}
                  className="group relative rounded-xl border border-[#e3e2de] bg-white hover:bg-[#fbfbfa] transition-colors overflow-hidden flex flex-col justify-between shadow-2xs"
                >
                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-20">
                      {onEditVideo && (
                        <button
                          onClick={() => onEditVideo(video)}
                          className="p-1 rounded text-xs bg-white hover:bg-[#efefed] text-[#787774] border border-[#e3e2de] cursor-pointer shadow-2xs"
                          title="Edit"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                      {onDeleteVideo && (
                        <button
                          onClick={() => setDeleteTarget(video)}
                          className="p-1 rounded text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer shadow-2xs"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Video Thumbnail Header */}
                  <div
                    onClick={() => setActivePlayingVideo(video)}
                    className="relative aspect-video w-full bg-[#f7f6f3] border-b border-[#e3e2de] overflow-hidden cursor-pointer group/thumb"
                  >
                    <img
                      src={thumbUrl}
                      alt={video.title}
                      className="w-full h-full object-cover object-center group-hover/thumb:scale-[1.02] transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleThumbnailError(e, videoId || undefined)}
                    />

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-md group-hover/thumb:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration / Tag */}
                    {video.category && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white backdrop-blur-xs">
                        {video.category}
                      </div>
                    )}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white backdrop-blur-xs">
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Video Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4
                        onClick={() => setActivePlayingVideo(video)}
                        className="text-sm font-sans font-bold text-[#37352f] group-hover:text-[#2383e2] transition-colors line-clamp-2 cursor-pointer leading-snug"
                      >
                        {video.title}
                      </h4>
                      {video.description && (
                        <p className="text-xs font-sans text-[#787774] line-clamp-2 mt-1">
                          {video.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Link */}
                    <div className="pt-2 border-t border-[#e3e2de] flex items-center justify-between text-xs font-mono text-[#787774]">
                      <button
                        onClick={() => setActivePlayingVideo(video)}
                        className="text-[#2383e2] hover:underline cursor-pointer font-sans text-xs font-medium"
                      >
                        {lang === 'en' ? 'Watch Video' : '영상 재생'}
                      </button>

                      {video.youtubeUrl && (
                        <a
                          href={video.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#787774] hover:text-[#37352f] transition-colors font-sans text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>YouTube</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal Player (Centered Portal) */}
      <ModalBackdrop
        isOpen={!!activePlayingVideo}
        onClose={() => setActivePlayingVideo(null)}
        maxWidthClass="max-w-3xl"
        zIndexClass="z-[9999]"
      >
        {activePlayingVideo && (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e3e2de] bg-[#f7f6f3]">
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#37352f] truncate pr-4">
                <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                <span className="truncate">{activePlayingVideo.title}</span>
              </div>
              <button
                onClick={() => setActivePlayingVideo(null)}
                className="p-1 rounded text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              {extractVideoId(activePlayingVideo.youtubeUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractVideoId(
                    activePlayingVideo.youtubeUrl
                  )}?autoplay=1&rel=0`}
                  title={activePlayingVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-mono">
                  Unable to load video stream
                </div>
              )}
            </div>

            {activePlayingVideo.description && (
              <div className="p-4 text-xs font-sans text-[#5a5854] bg-[#fdfdfd] border-t border-[#e3e2de] max-h-36 overflow-y-auto">
                {activePlayingVideo.description}
              </div>
            )}
          </>
        )}
      </ModalBackdrop>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={t('youtube.deleteConfirm', '영상 삭제 확인')}
        message={
          lang === 'en'
            ? 'Are you sure you want to delete this video item?'
            : '이 영상 항목을 삭제하시겠습니까?'
        }
        itemName={deleteTarget?.title}
        confirmText={isDeleting ? '...' : lang === 'en' ? 'Delete' : '삭제하기'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
};
