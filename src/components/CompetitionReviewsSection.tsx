import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Edit2,
  Trash2,
  Plus,
  Maximize2,
  Minimize2,
  Award,
  Sparkles,
  FileCode,
  Download,
  Image as ImageIcon,
  Check,
  Lock,
  ListOrdered,
} from 'lucide-react';
import { CompetitionReviewItem } from '../types';
import { useLanguage } from '../context/ThemeContext';
import { useToast } from './Toast';
import { AdminDownloadModal } from './AdminDownloadModal';

interface CompetitionReviewsSectionProps {
  reviews: CompetitionReviewItem[];
  isAdmin?: boolean;
  onAddReview?: () => void;
  onEditReview?: (review: CompetitionReviewItem) => void;
  onDeleteReview?: (id: string) => void;
}

export const CompetitionReviewsSection: React.FC<CompetitionReviewsSectionProps> = ({
  reviews,
  isAdmin = false,
  onAddReview,
  onEditReview,
  onDeleteReview,
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  // Interactive Notion Toggles state
  const [openToggles, setOpenToggles] = useState<Record<string, boolean>>({
    'team-info': true,
    'site-info': true,
    'day1-problems': true,
    'day1-strategy': true,
    'day2-scores': true,
    'day2-surprise': true,
    'day2-strategy': true,
    'day2-code': true,
    'day2-problems': true,
    'day2-mustfix': true,
    'day3-scores': true,
    'day3-challenge': true,
    'day3-strategy': true,
    'day3-code': true,
    'day3-problems': true,
    'day3-mustfix': true,
    'lib-code': true,
    'feelings-good': true,
    'feelings-regret': true,
    'feelings-lack': true,
    'feelings-mistakes': true,
    'rules-place': true,
    'rules-key': true,
    'rules-damage': true,
    'rules-diff': true,
  });

  const [downloadTarget, setDownloadTarget] = useState<{ fileName: string; filePath: string } | null>(null);

  const handleRequestDownload = (fileName: string, filePath: string) => {
    // If logged in as admin, trigger download immediately using admin token
    if (isAdmin) {
      const storedToken = localStorage.getItem('admin_token');
      fetch('/api/files/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        body: JSON.stringify({ filePath }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Download failed');
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          showToast(`${fileName} 다운로드가 완료되었습니다.`, 'success');
        })
        .catch(() => {
          // Open modal if direct token call failed
          setDownloadTarget({ fileName, filePath });
        });
      return;
    }

    // Require admin password modal
    setDownloadTarget({ fileName, filePath });
  };

  const toggleItem = (key: string) => {
    setOpenToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAll = () => {
    const allKeys = [
      'team-info',
      'site-info',
      'day1-problems',
      'day1-strategy',
      'day2-scores',
      'day2-surprise',
      'day2-strategy',
      'day2-code',
      'day2-problems',
      'day2-mustfix',
      'day3-scores',
      'day3-challenge',
      'day3-strategy',
      'day3-code',
      'day3-problems',
      'day3-mustfix',
      'lib-code',
      'feelings-good',
      'feelings-regret',
      'feelings-lack',
      'feelings-mistakes',
      'rules-place',
      'rules-key',
      'rules-damage',
      'rules-diff',
    ];
    const newState: Record<string, boolean> = {};
    allKeys.forEach((k) => (newState[k] = true));
    setOpenToggles(newState);
  };

  const collapseAll = () => {
    setOpenToggles({});
  };

  if (!reviews || reviews.length === 0) {
    return (
      <section id="reviews" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-8 text-center bg-[#f7f6f3] rounded-xl border border-[#e3e2de]">
          <BookOpen className="w-10 h-10 text-[#787774] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#37352f]">등록된 대회 후기가 없습니다</h3>
          <p className="text-xs text-[#787774] mt-1">대회 참가 후기 및 회고를 확인하세요.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#e3e2de] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#efefed] border border-[#e3e2de] flex items-center justify-center text-[#37352f]">
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-[#37352f] tracking-tight">
                {t('nav.reviews', '대회 후기')}
              </h2>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                WRO 2026 INDIA
              </span>
            </div>
            <p className="text-xs text-[#787774] mt-0.5">
              실전 라운드별 점수, 미션 분석 및 회고 기록
            </p>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <button
            onClick={expandAll}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#5a5854] bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] rounded-md transition-colors cursor-pointer"
            title="모든 토글 펼치기"
          >
            <Maximize2 className="w-3 h-3 text-[#787774]" />
            <span>모두 펼치기</span>
          </button>
          <button
            onClick={collapseAll}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#5a5854] bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] rounded-md transition-colors cursor-pointer"
            title="모든 토글 접기"
          >
            <Minimize2 className="w-3 h-3 text-[#787774]" />
            <span>모두 접기</span>
          </button>

          {isAdmin && onAddReview && (
            <button
              onClick={onAddReview}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-[#2383e2] hover:bg-[#1b6dc1] rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>후기 추가</span>
            </button>
          )}
        </div>
      </div>

      {/* Reviews Article Container */}
      <div className="space-y-10">
        {reviews.map((rev) => (
          <article
            key={rev.id}
            className="relative bg-white rounded-2xl border border-[#e3e2de] shadow-[0_2px_15px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 hover:border-[#cfcdca]"
          >
            {/* Notion Style Cover Header Banner */}
            <div className="relative w-full h-44 sm:h-64 lg:h-72 bg-zinc-900 overflow-hidden">
              <img
                src={rev.coverImage || '/wro-oc-regular-apac-india-2026.webp'}
                alt={rev.title}
                className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Cover Top Badges */}
              <div className="absolute top-3.5 left-4 sm:left-6 flex flex-wrap items-center gap-2 z-10">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  WRO OPEN CHAMPIONSHIP 2026
                </span>
                <span className="px-2 py-0.8 rounded-md text-[10px] font-mono text-zinc-200 bg-white/10 backdrop-blur-md border border-white/15">
                  ASIA PACIFIC · INDIA
                </span>
              </div>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="absolute top-3.5 right-4 sm:right-6 flex items-center gap-1.5 z-10">
                  {onEditReview && (
                    <button
                      onClick={() => onEditReview(rev)}
                      className="p-1.5 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md rounded-md border border-white/20 transition-colors cursor-pointer"
                      title="후기 수정"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDeleteReview && (
                    <button
                      onClick={() => {
                        if (confirm('정말로 이 대회 후기를 삭제하시겠습니까?')) {
                          onDeleteReview(rev.id);
                        }
                      }}
                      className="p-1.5 bg-rose-950/70 hover:bg-rose-900 text-rose-200 backdrop-blur-md rounded-md border border-rose-500/30 transition-colors cursor-pointer"
                      title="후기 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Bottom Quick Score Callout */}
              <div className="absolute bottom-3 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-center justify-between gap-2 z-10 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-black/80 border border-white/20 p-1 flex items-center justify-center">
                    <img
                      src="/favicon.svg?v=7"
                      alt="KFC logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold drop-shadow-sm text-zinc-100">
                    Team K.F.C. (배지훈, 송민규)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-tech font-bold bg-amber-500 text-black shadow-sm flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    {rev.rankBadge || '11등 (249점)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Body (Faithful to updated Notion page) */}
            <div className="p-5 sm:p-8 lg:p-10 space-y-6 text-[#37352f]">
              {/* Document Icon & Title Block */}
              <div className="space-y-3 pb-4 border-b border-[#f1f0ee]">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-xs border border-zinc-700">
                  <img
                    src="/favicon.svg?v=7"
                    alt="K.F.C. Code Chaser Original Logo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37352f] tracking-tight leading-snug">
                  {rev.title}
                </h1>

                {/* Metadata badges row */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#787774]">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f7f6f3] border border-[#e3e2de]">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{rev.location || 'GMR Arena, Aerocity, Hyderabad, India'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f7f6f3] border border-[#e3e2de]">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{rev.period || '2026년 9월 25일 ~ 27일'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f7f6f3] border border-[#e3e2de]">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>팀원: {rev.members.join(', ')}</span>
                  </div>

                  {rev.scoringUrl && (
                    <a
                      href={rev.scoringUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors font-medium"
                      title="WRO 공식 실시간 점수 사이트"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-600" />
                      <span>점수 확인 사이트</span>
                      <ExternalLink className="w-3 h-3 text-amber-600" />
                    </a>
                  )}

                  {rev.notionUrl && (
                    <a
                      href={rev.notionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#edf6ec] hover:bg-[#d2ebd0] text-emerald-800 border border-[#d2ebd0] transition-colors font-medium ml-auto"
                      title="원본 노션 문서 새 창으로 열기"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Notion 원본 열기</span>
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                    </a>
                  )}
                </div>
              </div>

              {/* ========================================================= */}
              {/* NOTION SECTION 1: 2-Column Grid [팀 명 & 팀 원] & [대회 사이트] */}
              {/* ========================================================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-2">
                {/* Column 1: Toggle [팀 명 & 팀 원] */}
                <div className="rounded-xl border border-[#e3e2de] bg-[#fbfbfa] overflow-hidden">
                  <button
                    onClick={() => toggleItem('team-info')}
                    className="flex items-center gap-2 text-left w-full p-2.5 hover:bg-[#f1f1ef] transition-colors cursor-pointer group"
                  >
                    <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] transition-colors">
                      {openToggles['team-info'] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                    <span className="font-bold text-sm text-[#37352f] bg-[#f1f1ef] px-2 py-0.5 rounded">
                      [팀 명 & 팀 원]
                    </span>
                  </button>
                  {openToggles['team-info'] && (
                    <div className="px-5 pb-3 pt-1 text-sm text-[#37352f] space-y-1.5 border-t border-[#f1f1ef] bg-white">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#37352f]" />
                        <span className="font-semibold text-zinc-900">{rev.teamName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#37352f]" />
                        <span>{rev.members.join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column 2: Toggle [대회 사이트] */}
                <div className="rounded-xl border border-[#e3e2de] bg-[#fbfbfa] overflow-hidden">
                  <button
                    onClick={() => toggleItem('site-info')}
                    className="flex items-center gap-2 text-left w-full p-2.5 hover:bg-[#f1f1ef] transition-colors cursor-pointer group"
                  >
                    <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] transition-colors">
                      {openToggles['site-info'] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                    <span className="font-bold text-sm text-[#37352f] bg-[#f1f1ef] px-2 py-0.5 rounded">
                      [대회 사이트]
                    </span>
                  </button>
                  {openToggles['site-info'] && (
                    <div className="px-5 pb-3 pt-1 text-sm border-t border-[#f1f1ef] bg-white">
                      <a
                        href={rev.officialUrl || 'https://oc26.wroindia.org/schedule/'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#2383e2] hover:underline font-medium"
                      >
                        <span>WRO Open Championship 2026 India (공식 일정 및 경기 안내)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Notion Table of Contents (목차) Block */}
              <div className="p-4 rounded-xl border border-[#e3e2de] bg-[#fbfbfa] my-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-[#ecebe8]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#787774] uppercase tracking-wider">
                    <ListOrdered className="w-4 h-4 text-zinc-500" />
                    <span>목차 (Table of Contents)</span>
                  </div>
                  <span className="text-[10px] text-[#9b9a97] font-mono">Notion Index</span>
                </div>
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#5f5e5b]">
                  <a
                    href="#notion-day1"
                    className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#efefed] hover:text-blue-700 transition-colors border-l-2 border-blue-400"
                  >
                    <span className="font-semibold text-blue-700">1.</span>
                    <span className="truncate">첫째 날 (연습 & 최종 전략 & 결과)</span>
                  </a>
                  <a
                    href="#notion-day2"
                    className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#efefed] hover:text-rose-700 transition-colors border-l-2 border-rose-400"
                  >
                    <span className="font-semibold text-rose-700">2.</span>
                    <span className="truncate">둘째 날 (1~4라운드 & 서프라이즈 미션)</span>
                  </a>
                  <a
                    href="#notion-day3"
                    className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#efefed] hover:text-teal-700 transition-colors border-l-2 border-teal-400"
                  >
                    <span className="font-semibold text-teal-700">3.</span>
                    <span className="truncate">셋째 날 (1~2라운드 & 챌린지 미션)</span>
                  </a>
                  <a
                    href="#notion-library"
                    className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#efefed] hover:text-pink-700 transition-colors border-l-2 border-pink-400"
                  >
                    <span className="font-semibold text-pink-700">4.</span>
                    <span className="truncate italic">라이브러리 코드 (WRO_FINAL_LIB)</span>
                  </a>
                  <a
                    href="#notion-reflections"
                    className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#efefed] hover:text-amber-700 transition-colors border-l-2 border-amber-400"
                  >
                    <span className="font-semibold text-amber-700">5.</span>
                    <span className="truncate">느낀 점 (좋았던 점 / 아쉬운 점 / 실수)</span>
                  </a>
                  <a
                    href="#notion-details"
                    className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#efefed] hover:text-zinc-800 transition-colors border-l-2 border-zinc-400"
                  >
                    <span className="font-semibold text-zinc-700">6.</span>
                    <span className="truncate">대회 세부 사항 (장소, 규칙 및 주의점)</span>
                  </a>
                </nav>
              </div>

              {/* Notion Divider Line */}
              <hr className="border-[#e3e2de] my-4" />

              {/* ========================================================= */}
              {/* NOTION SECTION 2: 첫째 날 (연습 및 결과)                  */}
              {/* ========================================================= */}
              <div id="notion-day1" className="space-y-4 scroll-mt-24">
                {/* Notion Blue Header Banner */}
                <div className="p-3.5 rounded-xl bg-[#e8f1fc] border border-[#d0e2f9] text-[#1c3879] flex items-center justify-between shadow-2xs">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                    <span>{rev.day1.title}</span>
                  </h2>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
                    DAY 1 • 연습 & 전략
                  </span>
                </div>

                <hr className="border-[#e3e2de]" />

                {/* Sub-header: 연습 */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-[#37352f]">
                    {rev.day1.subtitle}
                  </h3>

                  {/* Toggle: 연습 날 있었던 문제점 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day1-problems')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day1-problems'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        연습 날 있었던 문제점
                      </span>
                    </button>
                    {openToggles['day1-problems'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f] space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-xs text-rose-600 font-bold mt-0.5">1.</span>
                            <span className="text-zinc-800">먼지 미션을 할 때 빨간 베리어를 침</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-xs text-rose-600 font-bold mt-0.5">2.</span>
                            <span className="text-zinc-800">유물을 잡을 때 직진 속도가 너무 빨라 유물을 쳐서 잘 못 잡음</span>
                          </div>
                        </div>

                        {/* Nested Sub-toggle: 수정 방법 */}
                        <div className="p-3 bg-[#edf6ec]/60 border border-[#d2ebd0] rounded-xl space-y-2">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            수정 방법
                          </span>
                          <ul className="text-xs text-zinc-800 space-y-1.5 pl-2">
                            <li className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>빨간 베리어를 치는 문제의 요인이 팔 때문이라는 것을 인지하고 팔의 각도를 높여 베리어의 높이 보다 높이 들어 베리어를 안 치게 하였다.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>유물을 집을 때 속도가 너무 빨라 유물을 놓치는 경우는 라이브러리 파일에서 유물을 잡는 함수를 찾은 뒤 속도를 낮추었다.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 최종 전략 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day1-strategy')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day1-strategy'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        최종 전략
                      </span>
                    </button>
                    {openToggles['day1-strategy'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f] space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                          <span className="text-zinc-800 font-medium">
                            {rev.day1.strategy}
                          </span>
                        </div>
                        <div className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-lg text-xs text-blue-900">
                          <span className="font-bold">이유: </span>
                          <span>점수가 높아야지 속도가 빠른게 의미가 있기 때문이다.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-[#e3e2de]" />

                {/* Sub-header: 결과 (Notion Blue Callout Block) */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#37352f]">
                    결과
                  </h3>
                  
                  {/* Notion Blue Callout Block */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-[#eef5fc] border border-[#d0e2f9] text-[#1e3a8a] my-2 shadow-2xs">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0 mt-0.5">
                      ℹ️
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <div className="text-base sm:text-lg font-bold text-[#1e40af] flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <span>11등 (249점)</span>
                      </div>
                      {rev.scoringUrl && (
                        <div className="text-xs text-[#2563eb] flex items-center gap-1.5 flex-wrap">
                          <span className="font-medium text-[#1e40af]">점수 사이트 :</span>
                          <a
                            href={rev.scoringUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-900 inline-flex items-center gap-1 font-mono font-medium truncate"
                          >
                            <span>{rev.scoringUrl}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notion Divider Line */}
              <hr className="border-[#e3e2de] my-4" />

              {/* ========================================================= */}
              {/* NOTION SECTION 3: 둘째 날 (1, 2, 3, 4라운드 / 240점 만점) */}
              {/* ========================================================= */}
              <div id="notion-day2" className="space-y-4 scroll-mt-24">
                {/* Notion Red Header Banner */}
                <div className="p-3.5 rounded-xl bg-[#fbe9e7] border border-[#f5c6cb] text-[#9c271d] flex items-center justify-between shadow-2xs">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                    <span>{rev.day2.title}</span>
                  </h2>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 border border-rose-200">
                    DAY 2 • 1~4라운드
                  </span>
                </div>

                <hr className="border-[#e3e2de]" />

                {/* Sub-header: 1, 2, 3, 4라운드 (240점 만점) */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-[#37352f]">
                    {rev.day2.subtitle}
                  </h3>

                  {/* Toggle: 결과(점수) with Detailed Breakdown */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day2-scores')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day2-scores'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        결과(점수)
                      </span>
                    </button>
                    {openToggles['day2-scores'] && (
                      <div className="pl-6 pt-2 pb-3 space-y-3">
                        <div className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-purple-600" />
                          <span>순위: {rev.day2.rank}</span>
                        </div>

                        {/* Detailed Round Breakdown with Cause & Learning */}
                        <div className="space-y-2">
                          {rev.day2.scoresDetailed?.map((sc, idx) => {
                            const isPeak = idx === 3;
                            return (
                              <div
                                key={idx}
                                className={`p-3 rounded-xl border text-sm transition-all ${
                                  isPeak
                                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 ring-1 ring-amber-300'
                                    : 'bg-[#f7f6f3] border-[#e3e2de]'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold">
                                  <span className="text-zinc-800">
                                    {sc.round} : <span className={isPeak ? 'text-amber-700 text-base' : 'text-zinc-900'}>{sc.score}점</span>
                                  </span>
                                  {isPeak && (
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                                      ★ 최고 득점 돌파!
                                    </span>
                                  )}
                                </div>
                                {sc.cause && (
                                  <p className="text-xs text-rose-700 mt-1">
                                    <span className="font-semibold">원인: </span>{sc.cause}
                                  </p>
                                )}
                                {sc.lesson && (
                                  <p className="text-xs text-emerald-800 mt-0.5">
                                    <span className="font-semibold">개선책: </span>{sc.lesson}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 서프라이즈 미션 (with Rules & Photos) */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day2-surprise')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day2-surprise'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        서프라이즈 미션
                      </span>
                    </button>
                    {openToggles['day2-surprise'] && (
                      <div className="pl-6 pt-2 pb-3 space-y-3">
                        <div className="p-3 bg-[#f7f6f3] border border-[#e3e2de] rounded-xl space-y-2 text-xs">
                          <p className="font-medium text-zinc-900">
                            {rev.day2.surpriseMission?.rules ||
                              '새로운 유물인 하얀색 유물이 추가되어 하얀색 유물을 WRO 2026 seasonal logo가 있는 곳에 갖다 놓는 미션이였다.'}
                          </p>
                          <div className="p-2 bg-amber-50/60 border border-amber-200 rounded-lg space-y-1">
                            <span className="font-bold text-amber-900">점수:</span>
                            <ul className="list-disc list-inside text-zinc-800 space-y-0.5">
                              {rev.day2.surpriseMission?.scoring && rev.day2.surpriseMission.scoring.length > 0 ? (
                                rev.day2.surpriseMission.scoring.map((item, sIdx) => (
                                  <li key={sIdx}>{item}</li>
                                ))
                              ) : (
                                <>
                                  <li>부분적으로 유물이 seasonal logo에 걸쳐져 있음 : 15점</li>
                                  <li>유물이 완전히 seasonal logo안에 있음 : 25점 (넘어지면 안됨)</li>
                                </>
                              )}
                            </ul>
                          </div>

                          {/* Notion Additional Analysis */}
                          {(rev.day2.surpriseMission?.reason || rev.day2.surpriseMission?.lesson) && (
                            <div className="p-2.5 bg-[#f7f6f3] border border-[#e3e2de] rounded-lg space-y-1.5 text-xs text-zinc-800">
                              {rev.day2.surpriseMission?.reason && (
                                <p className="flex items-start gap-1.5">
                                  <span className="font-bold text-amber-800 shrink-0">• 이유 :</span>
                                  <span>{rev.day2.surpriseMission.reason}</span>
                                </p>
                              )}
                              {rev.day2.surpriseMission?.disadvantage && (
                                <p className="flex items-start gap-1.5">
                                  <span className="font-bold text-rose-700 shrink-0">• 불이익 :</span>
                                  <span>{rev.day2.surpriseMission.disadvantage}</span>
                                </p>
                              )}
                              {rev.day2.surpriseMission?.lesson && (
                                <p className="flex items-start gap-1.5">
                                  <span className="font-bold text-emerald-700 shrink-0">• 다음에 시도 하기 위한 대책 :</span>
                                  <span>{rev.day2.surpriseMission.lesson}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Image Thumbnails */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="rounded-xl overflow-hidden border border-[#e3e2de] bg-zinc-100 group">
                            <img
                              src="/reviews/wro2026/surprise_mission_1.jpg"
                              alt="서프라이즈 미션 1"
                              className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform"
                            />
                            <div className="p-2 text-center text-xs font-mono text-[#787774] bg-white border-t border-[#e3e2de]">
                              서프라이즈 미션.jpg
                            </div>
                          </div>
                          <div className="rounded-xl overflow-hidden border border-[#e3e2de] bg-zinc-100 group">
                            <img
                              src="/reviews/wro2026/surprise_mission_2.jpg"
                              alt="서프라이즈 미션 2"
                              className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform"
                            />
                            <div className="p-2 text-center text-xs font-mono text-[#787774] bg-white border-t border-[#e3e2de]">
                              서프라이즈 미션_2.jpg
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 전략 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day2-strategy')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day2-strategy'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        전략
                      </span>
                    </button>
                    {openToggles['day2-strategy'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f]">
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                          <span className="text-zinc-800 font-medium">
                            {rev.day2.strategy}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 코드 (WRO_FINAL_2026_MAIN_2.py) */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day2-code')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day2-code'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        코드
                      </span>
                    </button>
                    {openToggles['day2-code'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f]">
                        <button
                          type="button"
                          onClick={() => handleRequestDownload('WRO_FINAL_2026_MAIN_2.py', '/reviews/wro2026/WRO_FINAL_2026_MAIN_2.py')}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] rounded-lg font-mono text-xs text-[#37352f] transition-all cursor-pointer group hover:border-[#2383e2]/40"
                          title="관리자 비밀번호 인증 후 다운로드"
                        >
                          <FileCode className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">WRO_FINAL_2026_MAIN_2.py</span>
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-sans flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            관리자 인증
                          </span>
                          <Download className="w-3.5 h-3.5 text-[#787774] group-hover:text-[#37352f]" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 둘째 날에 일어난 문제점 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day2-problems')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day2-problems'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        둘째 날에 일어난 문제점
                      </span>
                    </button>
                    {openToggles['day2-problems'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f] space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="font-mono text-xs text-rose-600 font-bold mt-0.5">1.</span>
                          <span>로봇에 업로드된 프로그램이 실행이 안되었다.</span>
                        </div>
                        <div className="p-2.5 bg-[#edf6ec]/70 border border-[#d2ebd0] rounded-lg text-xs">
                          <span className="font-bold text-emerald-800">수정 방법: </span>
                          <span className="text-zinc-800">로봇을 계속 껐다 켰다를 로봇이 실행될 때 까지 반복하였다.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 고쳐야 했던 점 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day2-mustfix')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day2-mustfix'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        고쳐야 했던 점
                      </span>
                    </button>
                    {openToggles['day2-mustfix'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f]">
                        <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-xl text-zinc-800 leading-relaxed text-xs sm:text-sm">
                          • 아무리 상황이 급박해도 당황하지 않고 차근차근 코드를 쓰고 로봇이 잘 작동이 안되어도 시작 지점은 꼭 잘 지켜야 한다.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notion Divider Line */}
              <hr className="border-[#e3e2de] my-4" />

              {/* ========================================================= */}
              {/* NOTION SECTION 4: 셋째 날 (1, 2라운드 / 240점 만점)       */}
              {/* ========================================================= */}
              <div id="notion-day3" className="space-y-4 scroll-mt-24">
                {/* Notion Teal Header Banner */}
                <div className="p-3.5 rounded-xl bg-[#e2f5f4] border border-[#b2e5e1] text-[#0d5953] flex items-center justify-between shadow-2xs">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                    <span>{rev.day3.title}</span>
                  </h2>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-teal-100 text-teal-900 border border-teal-200">
                    DAY 3 • 챌린지 미션
                  </span>
                </div>

                <hr className="border-[#e3e2de]" />

                {/* Sub-header: 1, 2라운드 (240점 만점) */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-[#37352f]">
                    {rev.day3.subtitle}
                  </h3>

                  {/* Toggle: 결과(점수) with Detailed Breakdown */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day3-scores')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day3-scores'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        결과(점수)
                      </span>
                    </button>
                    {openToggles['day3-scores'] && (
                      <div className="pl-6 pt-2 pb-3 space-y-3">
                        <div className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-purple-600" />
                          <span>순위: {rev.day3.rank}</span>
                        </div>

                        {/* Detailed Round Breakdown with Cause & Learning */}
                        <div className="space-y-2">
                          {rev.day3.scoresDetailed?.map((sc, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl border bg-[#f7f6f3] border-[#e3e2de] text-sm"
                            >
                              <div className="font-bold text-zinc-900">
                                {sc.round} : <span className="text-purple-700 text-base">{sc.score}점</span>
                              </div>
                              {sc.cause && (
                                <p className="text-xs text-rose-700 mt-1">
                                  <span className="font-semibold">원인: </span>{sc.cause}
                                </p>
                              )}
                              {sc.lesson && (
                                <p className="text-xs text-emerald-800 mt-0.5">
                                  <span className="font-semibold">개선책: </span>{sc.lesson}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 챌린지 미션 (Tasks 1 ~ 6 & Images) */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day3-challenge')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day3-challenge'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        챌린지 미션 (태스크 1 ~ 6 세부 규칙)
                      </span>
                    </button>
                    {openToggles['day3-challenge'] && (
                      <div className="pl-6 pt-2 pb-3 space-y-3">
                        <div className="space-y-2">
                          {rev.day3.challengeMission?.tasks.map((task) => {
                            const desc = task.description || '';
                            const hasGoal = desc.includes('목표:');
                            const hasCondition = desc.includes('완료 조건:');
                            let goalText = '';
                            let conditionText = '';
                            if (hasGoal && hasCondition) {
                              const match = desc.match(/목표:\s*(.*?)(?:완료 조건:|$)/);
                              const condMatch = desc.match(/완료 조건:\s*(.*?)$/);
                              goalText = match ? match[1].trim() : '';
                              conditionText = condMatch ? condMatch[1].trim() : '';
                            }

                            return (
                              <div
                                key={task.taskNumber}
                                className="p-3.5 rounded-xl border bg-[#fbfbfa] border-[#e3e2de] space-y-2 text-xs"
                              >
                                <div className="font-bold text-sm text-zinc-900 flex items-center justify-between border-b border-[#f1f1ef] pb-1.5">
                                  <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                                    태스크 {task.taskNumber}
                                  </span>
                                  <span className="font-semibold text-zinc-900 text-xs sm:text-sm">{task.name}</span>
                                </div>
                                <div className="space-y-1 pl-1 text-zinc-700">
                                  {goalText ? (
                                    <>
                                      <p className="flex items-start gap-1.5 leading-relaxed">
                                        <span className="font-bold text-zinc-900 shrink-0">• 목표:</span>
                                        <span>{goalText}</span>
                                      </p>
                                      {conditionText && (
                                        <p className="flex items-start gap-1.5 leading-relaxed">
                                          <span className="font-bold text-zinc-900 shrink-0">• 완료 조건:</span>
                                          <span>{conditionText}</span>
                                        </p>
                                      )}
                                    </>
                                  ) : (
                                    <p className="leading-relaxed">{desc}</p>
                                  )}
                                  <p className="flex items-start gap-1.5 text-indigo-900 font-semibold pt-0.5">
                                    <span className="text-indigo-600 shrink-0">• 배점:</span>
                                    <span>{task.score}</span>
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Images */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="rounded-xl overflow-hidden border border-[#e3e2de] bg-zinc-100 group">
                            <img
                              src="/reviews/wro2026/challenge_mission.png"
                              alt="챌린지 미션 1"
                              className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform"
                            />
                            <div className="p-2 text-center text-xs font-mono text-[#787774] bg-white border-t border-[#e3e2de]">
                              챌린지 미션.png
                            </div>
                          </div>
                          <div className="rounded-xl overflow-hidden border border-[#e3e2de] bg-zinc-100 group">
                            <img
                              src="/reviews/wro2026/challenge_mission_2.jpg"
                              alt="챌린지 미션 2"
                              className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform"
                            />
                            <div className="p-2 text-center text-xs font-mono text-[#787774] bg-white border-t border-[#e3e2de]">
                              챌린지 미션_2.jpg
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 전략 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day3-strategy')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day3-strategy'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        전략
                      </span>
                    </button>
                    {openToggles['day3-strategy'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f] space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                          <span className="text-zinc-800 font-medium">
                            {rev.day3.strategy}
                          </span>
                        </div>
                        {rev.day3.strategyTasks && rev.day3.strategyTasks.length > 0 && (
                          <div className="mt-2 p-2.5 bg-blue-50/50 border border-blue-200/60 rounded-xl space-y-1.5 text-xs">
                            <span className="font-bold text-blue-900 block">선택 집중 미션:</span>
                            <ol className="list-decimal list-inside space-y-1 text-zinc-800 font-medium pl-1">
                              {rev.day3.strategyTasks.map((task, tidx) => (
                                <li key={tidx}>{task}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Toggle: 코드 (WRO_Challenge_MAIN.py) */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day3-code')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day3-code'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        코드
                      </span>
                    </button>
                    {openToggles['day3-code'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f]">
                        <button
                          type="button"
                          onClick={() => handleRequestDownload('WRO_Challenge_MAIN.py', '/reviews/wro2026/WRO_Challenge_MAIN.py')}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] rounded-lg font-mono text-xs text-[#37352f] transition-all cursor-pointer group hover:border-[#2383e2]/40"
                          title="관리자 비밀번호 인증 후 다운로드"
                        >
                          <FileCode className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">WRO_Challenge_MAIN.py</span>
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-sans flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            관리자 인증
                          </span>
                          <Download className="w-3.5 h-3.5 text-[#787774] group-hover:text-[#37352f]" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 셋째 날에서 일어난 문제점 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day3-problems')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day3-problems'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        셋째 날에서 일어난 문제점
                      </span>
                    </button>
                    {openToggles['day3-problems'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f] space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="font-mono text-xs text-rose-600 font-bold mt-0.5">1.</span>
                          <span>뒤에 있는 팔이 관객을 잘 잡지 못하는 구조였다.</span>
                        </div>
                        <div className="p-2.5 bg-[#edf6ec]/70 border border-[#d2ebd0] rounded-lg text-xs">
                          <span className="font-bold text-emerald-800">수정 방법: </span>
                          <span className="text-zinc-800">뒤에 있는 팔의 길이를 늘려 관객을 잘 잡도록 하였다.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 고쳐야 했던 점 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('day3-mustfix')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['day3-mustfix'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        고쳐야 했던 점
                      </span>
                    </button>
                    {openToggles['day3-mustfix'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f]">
                        <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-xl text-zinc-800 leading-relaxed text-xs sm:text-sm">
                          • 한번에 많은 미션을 동시에 병행하지 않고 차근차근 자신이 할 수 있는 미션을 먼저 코드를 써야 한다.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notion Divider Line */}
              <hr className="border-[#e3e2de] my-4" />

              {/* ========================================================= */}
              {/* NOTION SECTION: 라이브러리 코드                            */}
              {/* ========================================================= */}
              <div id="notion-library" className="rounded-xl border border-pink-200 bg-[#fdf2f7] p-3 scroll-mt-24 shadow-2xs">
                <button
                  onClick={() => toggleItem('lib-code')}
                  className="flex items-center gap-2 text-left w-full cursor-pointer group"
                >
                  <span className="p-0.5 rounded text-pink-700 group-hover:bg-pink-100 transition-colors">
                    {openToggles['lib-code'] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                  <span className="font-bold text-sm sm:text-base text-pink-900 bg-pink-100/80 px-2.5 py-0.5 rounded italic underline">
                    라이브러리 코드
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-pink-200/80 text-pink-800 ml-auto">
                    LIB • Python
                  </span>
                </button>
                {openToggles['lib-code'] && (
                  <div className="pl-6 pt-2.5 pb-1 text-sm text-[#37352f]">
                    <button
                      type="button"
                      onClick={() => handleRequestDownload('WRO_FINAL_2026_LIB.py', '/reviews/wro2026/WRO_FINAL_2026_LIB.py')}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-pink-50/50 border border-pink-200 rounded-lg font-mono text-xs text-[#37352f] transition-all cursor-pointer group hover:border-pink-300 shadow-2xs"
                      title="관리자 비밀번호 인증 후 다운로드"
                    >
                      <FileCode className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-zinc-900">WRO_FINAL_2026_LIB.py</span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-sans flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        관리자 인증
                      </span>
                      <Download className="w-3.5 h-3.5 text-[#787774] group-hover:text-pink-700" />
                    </button>
                  </div>
                )}
              </div>

              {/* Notion Divider Line */}
              <hr className="border-[#e3e2de] my-4" />

              {/* ========================================================= */}
              {/* NOTION SECTION 5: 느낀 점 & 실수                          */}
              {/* ========================================================= */}
              <div id="notion-reflections" className="space-y-4 scroll-mt-24">
                <h3 className="text-lg sm:text-xl font-bold text-[#37352f] flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>느낀 점</span>
                </h3>

                <div className="space-y-2.5">
                  {/* Toggle: 좋았던 점 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('feelings-good')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['feelings-good'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-emerald-800 bg-[#edf6ec] px-2 py-0.5 rounded border border-[#d2ebd0] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        좋았던 점
                      </span>
                    </button>
                    {openToggles['feelings-good'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f]">
                        <div className="p-3 bg-[#edf6ec]/50 border border-[#d2ebd0] rounded-xl text-zinc-800 leading-relaxed">
                          • {rev.reflections.strengths}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 아쉬웠던 점 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('feelings-regret')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['feelings-regret'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        아쉬웠던 점
                      </span>
                    </button>
                    {openToggles['feelings-regret'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f]">
                        <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-zinc-800 leading-relaxed">
                          • {rev.reflections.regrets}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 부족했던 점 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('feelings-lack')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['feelings-lack'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        부족했던 점
                      </span>
                    </button>
                    {openToggles['feelings-lack'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f]">
                        <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl text-zinc-800 leading-relaxed font-mono text-xs sm:text-sm">
                          • {rev.reflections.improvements}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 실수 (Mistakes Summary) */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('feelings-mistakes')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['feelings-mistakes'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        실수 정리
                      </span>
                    </button>
                    {openToggles['feelings-mistakes'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f] space-y-1.5">
                        {rev.reflections.mistakesList?.map((m, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="font-mono text-xs text-rose-600 font-bold mt-0.5">{idx + 1}.</span>
                            <span className="text-zinc-800">{m}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notion Divider Line */}
              <hr className="border-[#e3e2de] my-4" />

              {/* ========================================================= */}
              {/* NOTION SECTION 6: 대회 세부 사항                           */}
              {/* ========================================================= */}
              <div id="notion-details" className="space-y-4 scroll-mt-24">
                <h3 className="text-lg sm:text-xl font-bold text-[#37352f] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  <span>대회 세부 사항</span>
                </h3>

                <div className="space-y-2.5">
                  {/* Toggle: 대회 장소 & 참가일 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('rules-place')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['rules-place'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        대회 장소 & 참가일
                      </span>
                    </button>
                    {openToggles['rules-place'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f] space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#37352f]" />
                          <span className="font-bold text-zinc-900">{rev.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#37352f]" />
                          <span>{rev.period}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 대회 룰 중 중요했던 규칙 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('rules-key')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['rules-key'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        대회 룰 중 중요했던 규칙
                      </span>
                    </button>
                    {openToggles['rules-key'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f]">
                        <div className="p-3 bg-[#f7f6f3] border border-[#e3e2de] rounded-xl text-zinc-800 leading-relaxed">
                          • {rev.competitionDetails.criticalRules}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 대회 규칙 중 모르는 게 있어서 피해를 본 것 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('rules-damage')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['rules-damage'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        대회 규칙 중 모르는 게 있어서 피해를 본 것
                      </span>
                    </button>
                    {openToggles['rules-damage'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f]">
                        <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl text-rose-900 leading-relaxed">
                          • {rev.competitionDetails.ruleLessonLearned}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle: 작년 대회와 달랐던 점 */}
                  <div className="rounded-lg hover:bg-[#f7f6f3]/60 transition-colors p-1">
                    <button
                      onClick={() => toggleItem('rules-diff')}
                      className="flex items-center gap-2 text-left w-full font-medium text-sm sm:text-base text-[#37352f] cursor-pointer group"
                    >
                      <span className="p-0.5 rounded text-[#787774] group-hover:text-[#37352f] group-hover:bg-[#efefed] transition-colors">
                        {openToggles['rules-diff'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        작년 대회와 달랐던 점
                      </span>
                    </button>
                    {openToggles['rules-diff'] && (
                      <div className="pl-6 pt-2 pb-2 text-sm text-[#37352f]">
                        <div className="p-3 bg-[#f7f6f3] border border-[#e3e2de] rounded-xl text-zinc-800 leading-relaxed">
                          • {rev.competitionDetails.differencesFromPrevious}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Notion Page Source Footer */}
              <div className="pt-6 mt-6 border-t border-[#f1f0ee] flex flex-col sm:flex-row items-center justify-between text-xs text-[#787774] gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>노션 실시간 연동 문서 · Verified Match Debrief</span>
                </div>
                {rev.notionUrl && (
                  <a
                    href={rev.notionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-zinc-600 hover:text-black hover:underline"
                  >
                    <span>노션 공식 문서에서 실시간 원본 보기</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Admin Protected File Download Modal */}
      {downloadTarget && (
        <AdminDownloadModal
          isOpen={!!downloadTarget}
          fileName={downloadTarget.fileName}
          filePath={downloadTarget.filePath}
          onClose={() => setDownloadTarget(null)}
          isAdmin={isAdmin}
        />
      )}
    </section>
  );
};
