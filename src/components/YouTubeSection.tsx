import React, { useState } from 'react';
import {
  Youtube,
  Play,
  ExternalLink,
  Plus,
  Edit3,
  Trash2,
  Tv,
  Sparkles,
  Clock,
  Eye,
  CheckCircle2,
  ArrowUpRight,
  Share2,
  Video,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { YouTubeVideoItem } from '../types';
import { DEFAULT_CHANNEL_INFO } from '../data/portfolioData';
import { useTheme, useLanguage } from '../context/ThemeContext';
import { ConfirmModal } from './modals/ConfirmModal';

interface YouTubeSectionProps {
  videos: YouTubeVideoItem[];
  isAdmin?: boolean;
  onAddVideo?: () => void;
  onEditVideo?: (video: YouTubeVideoItem) => void;
  onDeleteVideo?: (id: string) => Promise<void>;
}

// Helper to extract YouTube video ID from various YouTube URL formats
const extractVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// Helper to get reliable YouTube thumbnail
const getYouTubeThumbnail = (video: YouTubeVideoItem): string => {
  if (video.thumbnail && !video.thumbnail.includes('unsplash.com')) {
    return video.thumbnail;
  }
  const videoId = video.videoId || extractVideoId(video.youtubeUrl);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return 'https://img.youtube.com/vi/y4K_5A4wNrw/hqdefault.jpg';
};

export const YouTubeSection: React.FC<YouTubeSectionProps> = ({
  videos,
  isAdmin = false,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
}) => {
  const { theme } = useTheme();
  const { lang, t } = useLanguage();

  const [activePlayingVideo, setActivePlayingVideo] = useState<YouTubeVideoItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<YouTubeVideoItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const channelInfo = DEFAULT_CHANNEL_INFO;

  // Category Translation Helper
  const getCategoryLabel = (catKey: string): string => {
    if (!catKey) return '';
    const upper = catKey.toUpperCase();
    if (upper === 'ALL') return lang === 'en' ? 'All Videos' : '전체 영상';
    if (upper === 'COMPETITION') return lang === 'en' ? 'Competition' : '대회 및 실전 경기';
    if (upper === 'ALGORITHM' || upper === 'CONTROL') return lang === 'en' ? 'Algorithm & Control' : '알고리즘 및 제어';
    if (upper === 'HARDWARE' || upper === 'BUILD') return lang === 'en' ? 'Hardware & Build' : '하드웨어 및 기구';
    if (upper === 'FIELD TEST' || upper === 'FIELD_TEST') return lang === 'en' ? 'Field Tests' : '필드 테스트';
    return catKey;
  };

  const getCategoryBadgeLabel = (catKey?: string): string => {
    if (!catKey) return '';
    const upper = catKey.toUpperCase();
    if (upper === 'COMPETITION') return lang === 'en' ? 'Competition' : '대회/경기';
    if (upper === 'ALGORITHM' || upper === 'CONTROL') return lang === 'en' ? 'Algorithm' : '알고리즘/제어';
    if (upper === 'HARDWARE' || upper === 'BUILD') return lang === 'en' ? 'Hardware' : '하드웨어/제작';
    if (upper === 'FIELD TEST' || upper === 'FIELD_TEST') return lang === 'en' ? 'Field Test' : '필드 테스트';
    return catKey;
  };

  // Standard filter categories list
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

  // Topics and Channel bio in current language
  const channelBio = lang === 'en' && channelInfo.description ? channelInfo.description : (channelInfo.descriptionKo || channelInfo.description);
  const channelTopics = lang === 'en' ? channelInfo.topics : (channelInfo.topicsKo || channelInfo.topics);

  return (
    <section id="youtube-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-red-600/10 dark:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400">
              <Youtube className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              {t('youtube.badge', 'OFFICIAL MEDIA CHANNEL')}
            </span>
          </div>
          <h2
            className={`font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            {t('youtube.title', lang === 'en' ? 'Official YouTube Channel & Match Archives' : '공식 유튜브 채널 및 실전 주행')}
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-mono text-slate-500 dark:text-cyan-400/80">
            {t('youtube.subtitle', lang === 'en'
              ? 'WRO match runs, autonomous algorithms & robotics build archives'
              : 'WRO 경기 실전 주행, 자율주행 알고리즘 튜닝 및 하드웨어 제작 영상 기록')}
          </p>
        </div>

        {/* Top Actions: Visit Channel & Admin Add Video */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={channelInfo.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-tech font-bold flex items-center gap-2 transition-all cursor-pointer bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:scale-[1.02]"
          >
            <Youtube className="w-4 h-4" />
            <span>{channelInfo.handle} {lang === 'en' ? 'Channel' : '바로가기'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleShareChannel}
            className={`px-3 py-2.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                : 'bg-[#081224] hover:bg-[#0c1a32] text-cyan-300 border border-cyan-500/30'
            }`}
            title={lang === 'en' ? 'Copy Channel Link' : '채널 링크 복사'}
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? (lang === 'en' ? 'Copied!' : '복사됨!') : (lang === 'en' ? 'Share' : '공유')}</span>
          </button>

          {isAdmin && onAddVideo && (
            <button
              type="button"
              onClick={onAddVideo}
              className="px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'en' ? '+ Add Video' : '영상 추가'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Featured Channel Banner Card */}
      <div
        className={`mb-8 p-5 sm:p-7 rounded-2xl border transition-all relative overflow-hidden ${
          theme === 'light'
            ? 'bg-gradient-to-br from-white via-red-50/30 to-sky-50/50 border-red-200/80 shadow-[0_10px_30px_rgba(239,68,68,0.06)]'
            : 'bg-gradient-to-br from-[#0a0715] via-[#0b1329] to-[#040813] border-red-500/30 shadow-[0_0_40px_rgba(220,38,38,0.15)]'
        }`}
      >
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-[0_0_25px_rgba(220,38,38,0.5)] border border-red-400/40">
                <Youtube className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-md" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-black/90 border border-red-500/50 text-[10px] font-mono font-bold text-red-400">
                4K HD
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`font-display text-xl sm:text-2xl font-bold tracking-tight ${
                    theme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {channelInfo.channelName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/20 border border-red-500/40 text-red-500 dark:text-red-400">
                  {channelInfo.handle}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-sans">
                {channelBio}
              </p>
              {/* Topic Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {channelTopics.map((topic, tIdx) => (
                  <span
                    key={tIdx}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono ${
                      theme === 'light'
                        ? 'bg-slate-100 border border-slate-200 text-slate-700'
                        : 'bg-[#08152e] border border-cyan-500/30 text-cyan-300'
                    }`}
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <a
              href={channelInfo.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-tech font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.4)]"
            >
              <Youtube className="w-4 h-4" />
              <span>{lang === 'en' ? 'Subscribe & Watch All Videos' : '채널 구독 및 전체 영상 시청'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div
              className={`px-3.5 py-2 rounded-xl text-center text-[11px] font-mono ${
                theme === 'light'
                  ? 'bg-white/80 border border-slate-200 text-slate-600'
                  : 'bg-black/50 border border-slate-800 text-slate-400'
              }`}
            >
              <span>{channelInfo.channelUrl}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs with Full Language Switching */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
        {allCategoryKeys.map((catKey) => {
          const isSelected = activeFilter.toLowerCase() === catKey.toLowerCase();
          const label = getCategoryLabel(catKey);

          return (
            <button
              key={catKey}
              type="button"
              onClick={() => setActiveFilter(catKey)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-tech font-bold transition-all cursor-pointer select-none whitespace-nowrap ${
                isSelected
                  ? theme === 'light'
                    ? 'bg-red-600 text-white shadow-[0_4px_12px_rgba(220,38,38,0.35)] scale-[1.02]'
                    : 'bg-red-600 text-white shadow-[0_0_18px_rgba(220,38,38,0.6)] scale-[1.02]'
                  : theme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    : 'bg-[#081224] hover:bg-[#0c1a32] text-slate-300 hover:text-cyan-200 border border-cyan-500/20'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredVideos.map((video) => {
          const thumbUrl = getYouTubeThumbnail(video);
          const videoId = video.videoId || extractVideoId(video.youtubeUrl);
          const videoTitle = lang === 'ko' && video.titleKo ? video.titleKo : video.title;
          const videoDesc = lang === 'ko' && video.descriptionKo ? video.descriptionKo : video.description;
          const videoTags = lang === 'ko' && video.tagsKo && video.tagsKo.length > 0 ? video.tagsKo : (video.tags || []);
          const categoryBadge = getCategoryBadgeLabel(video.category);

          return (
            <div
              key={video.id}
              className={`group rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden ${
                theme === 'light'
                  ? 'bg-white border-slate-200/90 hover:border-red-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.1)]'
                  : 'bg-[#070e1c] border-cyan-500/20 hover:border-red-500/50 shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]'
              }`}
            >
              {/* Thumbnail Box */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={thumbUrl}
                  alt={videoTitle}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to standard YouTube thumbnail if high-res failed
                    const target = e.currentTarget;
                    if (videoId && !target.src.includes('hqdefault')) {
                      target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Play Trigger Button */}
                <button
                  type="button"
                  onClick={() => setActivePlayingVideo(video)}
                  className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
                  title={lang === 'en' ? 'Play Video' : '영상 재생하기'}
                >
                  <div className="w-13 h-13 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.8)] border border-red-400/60 transform transition-transform duration-300 group-hover/play:scale-115">
                    <Play className="w-6 h-6 ml-0.5 fill-current" />
                  </div>
                </button>

                {/* Duration Badge */}
                {video.duration && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 text-[11px] font-mono text-white flex items-center gap-1 border border-white/10">
                    <Clock className="w-3 h-3 text-red-400" />
                    <span>{video.duration}</span>
                  </div>
                )}

                {/* Category Badge */}
                {categoryBadge && (
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-red-600/90 text-[10px] font-mono font-bold text-white uppercase tracking-wider shadow-sm">
                    {categoryBadge}
                  </div>
                )}

                {/* Views Badge */}
                {video.views && (
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>{video.views}</span>
                  </div>
                )}
              </div>

              {/* Video Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4
                    className={`font-tech font-bold text-base sm:text-lg line-clamp-2 leading-snug cursor-pointer ${
                      theme === 'light' ? 'text-slate-900 group-hover:text-red-600' : 'text-white group-hover:text-red-400'
                    }`}
                    onClick={() => setActivePlayingVideo(video)}
                  >
                    {videoTitle}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {videoDesc}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {videoTags.map((t, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        theme === 'light'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/20'
                      }`}
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActivePlayingVideo(video)}
                      className="text-xs font-mono font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'en' ? 'Play Video' : '영상 재생'}</span>
                    </button>

                    <a
                      href={video.youtubeUrl || channelInfo.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                      title={lang === 'en' ? 'Open in YouTube' : '유튜브 새창에서 열기'}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Admin controls */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      {onEditVideo && (
                        <button
                          type="button"
                          onClick={() => onEditVideo(video)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/50 cursor-pointer"
                          title={lang === 'en' ? 'Edit' : '수정'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteVideo && (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(video)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 cursor-pointer"
                          title={lang === 'en' ? 'Delete' : '삭제'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* In-App YouTube Video Player Modal */}
      <AnimatePresence>
        {activePlayingVideo && (
          <div
            onClick={() => setActivePlayingVideo(null)}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl rounded-2xl bg-[#081224] border border-red-500/40 shadow-[0_0_60px_rgba(220,38,38,0.4)] overflow-hidden text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-5 py-3.5 bg-[#050c1a] border-b border-red-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-500" />
                  <h3 className="font-tech font-bold text-sm sm:text-base line-clamp-1">
                    {lang === 'ko' && activePlayingVideo.titleKo ? activePlayingVideo.titleKo : activePlayingVideo.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={activePlayingVideo.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 transition-all"
                  >
                    <span>{lang === 'en' ? 'Watch on YouTube' : 'YouTube에서 보기'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => setActivePlayingVideo(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* YouTube Iframe Player */}
              <div className="relative aspect-video w-full bg-black">
                {(() => {
                  const vId = activePlayingVideo.videoId || extractVideoId(activePlayingVideo.youtubeUrl) || 'y4K_5A4wNrw';
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${vId}?autoplay=1&rel=0&modestbranding=1`}
                      title={activePlayingVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  );
                })()}
              </div>

              {/* Modal Footer Description */}
              <div className="p-4 bg-[#050c1a] border-t border-slate-800">
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {lang === 'ko' && activePlayingVideo.descriptionKo ? activePlayingVideo.descriptionKo : activePlayingVideo.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {((lang === 'ko' && activePlayingVideo.tagsKo && activePlayingVideo.tagsKo.length > 0 ? activePlayingVideo.tagsKo : activePlayingVideo.tags) || []).map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-950/60 border border-red-500/30 text-red-300">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={lang === 'en' ? 'Delete Video' : '영상 삭제'}
        message={lang === 'en' ? 'Are you sure you want to delete this YouTube video?' : '정말로 이 유튜브 영상 항목을 삭제하시겠습니까?'}
        itemName={deleteTarget ? (lang === 'ko' && deleteTarget.titleKo ? deleteTarget.titleKo : deleteTarget.title) : ''}
        confirmText={isDeleting ? (lang === 'en' ? 'Deleting...' : '삭제 중...') : (lang === 'en' ? 'Delete' : '삭제하기')}
        cancelText={lang === 'en' ? 'Cancel' : '취소'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
};
