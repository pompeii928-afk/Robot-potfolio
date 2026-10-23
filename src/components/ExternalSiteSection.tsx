import React, { useState, useEffect } from 'react';
import {
  Globe,
  ExternalLink,
  Copy,
  Check,
  Store,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { ExternalSiteItem } from '../types';
import { useLanguage } from '../context/ThemeContext';

interface ExternalSiteSectionProps {
  sites?: ExternalSiteItem[];
  isAdmin?: boolean;
  onAddSite?: () => void;
  onEditSite?: (site: ExternalSiteItem) => void;
  onDeleteSite?: (id: string) => void;
  // Fallbacks if single site prop passed
  url?: string;
  title?: string;
}

export const ExternalSiteSection: React.FC<ExternalSiteSectionProps> = ({
  sites = [],
  isAdmin = false,
  onAddSite,
  onEditSite,
  onDeleteSite,
  url: fallbackUrl = 'https://wro-2026-selling-site.vercel.app/',
  title: fallbackTitle = 'ROBO STORE',
}) => {
  const { lang, t } = useLanguage();
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Determine active site list
  const siteList: ExternalSiteItem[] =
    sites.length > 0
      ? sites
      : [
          {
            id: 'default-site',
            title: fallbackTitle,
            url: fallbackUrl,
            description: 'WRO & CoSpace Robotics 공식 스토어 및 리소스 사이트',
            category: 'STORE',
          },
        ];

  // Set initial selected site
  useEffect(() => {
    if (siteList.length > 0) {
      if (!selectedSiteId || !siteList.some((s) => s.id === selectedSiteId)) {
        const defaultSite = siteList.find((s) => s.isDefault) || siteList[0];
        setSelectedSiteId(defaultSite.id);
      }
    }
  }, [siteList, selectedSiteId]);

  const activeSite = siteList.find((s) => s.id === selectedSiteId) || siteList[0];
  const activeUrl = activeSite?.url || fallbackUrl;
  const activeTitle = activeSite?.title || fallbackTitle;
  const activeDescription =
    activeSite?.description || 'WRO & CoSpace Robotics 공식 스토어 및 커뮤니티 사이트';
  const activeCategory = (activeSite?.category || 'ECOSYSTEM').toUpperCase();

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (cat: string) => {
    if (cat.includes('STORE') || cat.includes('SHOP') || cat.includes('MARKET')) {
      return <Store className="w-5 h-5 text-amber-500" />;
    }
    if (cat.includes('COMMUNITY') || cat.includes('CLUB') || cat.includes('FORUM')) {
      return <Users className="w-5 h-5 text-cyan-500" />;
    }
    return <Globe className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <section
      id="external-site"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 scroll-mt-20"
    >
      {/* Stokt Section Kicker */}
      <div className="flex items-center gap-2 mb-4">
        <span className="font-mono text-xs text-[#6e6d6a] dark:text-[#a3a29e] tracking-wider uppercase">
          ( 06 / STORE &amp; SATELLITE SITES )
        </span>
        <span className="h-px flex-1 bg-[#e2e0da] dark:bg-white/10 max-w-[80px]" />
      </div>

      {/* Header Info & Toolbar */}
      <div className="mb-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121318] border border-[#e2e0da] dark:border-white/10 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Site Identity */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0a0a0a] dark:bg-white/[0.08] text-white flex items-center justify-center shrink-0 shadow-xs border border-[#e2e0da] dark:border-white/20">
            {getCategoryIcon(activeCategory)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold font-sans text-[#0a0a0a] dark:text-[#f4f2ee] leading-snug tracking-tight truncate">
                {t('nav.otherSite', '다른 웹사이트')}
              </h2>
            </div>
            <p className="text-xs font-mono text-[#6e6d6a] dark:text-[#a3a29e] truncate mt-0.5">
              {activeTitle} · {activeDescription}
            </p>
          </div>
        </div>

        {/* Right: Actions Toolbar */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          {/* Admin: Add Website Button */}
          {isAdmin && onAddSite && (
            <button
              onClick={onAddSite}
              id="admin-add-website-btn"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-[#0a0a0a] text-white hover:bg-black dark:bg-[#f4f2ee] dark:text-[#0a0a0a] transition-colors cursor-pointer shadow-xs"
              title="새 웹사이트 추가 (관리자)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Website</span>
            </button>
          )}

          {/* Admin: Edit Current Website Button */}
          {isAdmin && onEditSite && activeSite && (
            <button
              onClick={() => onEditSite(activeSite)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] transition-colors cursor-pointer shadow-2xs"
              title="현재 사이트 수정 (관리자)"
            >
              <Edit2 className="w-3.5 h-3.5 text-zinc-600" />
              <span className="hidden sm:inline">수정</span>
            </button>
          )}

          {/* Admin: Delete Current Website Button */}
          {isAdmin && onDeleteSite && activeSite && siteList.length > 1 && (
            <button
              onClick={() => {
                if (window.confirm(`'${activeSite.title}' 사이트를 삭제하시겠습니까?`)) {
                  onDeleteSite(activeSite.id);
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-rose-50 border border-[#e3e2de] text-rose-600 transition-colors cursor-pointer shadow-2xs"
              title="현재 사이트 삭제 (관리자)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">삭제</span>
            </button>
          )}

          {/* Copy URL Pill */}
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] transition-colors cursor-pointer shadow-2xs"
            title="사이트 주소 복사"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">복사됨</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#787774]" />
                <span className="truncate max-w-[130px] sm:max-w-none text-[#787774]">
                  {activeUrl.replace('https://', '')}
                </span>
              </>
            )}
          </button>

          {/* Direct Open in New Tab Button (High Visibility) */}
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#1a1a18] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-2xs shrink-0"
            title="새 브라우저 탭에서 전체 사이트 열기"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
            <span>새 탭에서 열기</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Multiple Websites Tabs (matching screenshot) */}
      {siteList.length > 1 && (
        <div className="mb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {siteList.map((site) => {
            const isSelected = site.id === activeSite.id;
            return (
              <button
                key={site.id}
                onClick={() => {
                  setSelectedSiteId(site.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#1a1a18] text-white border-[#1a1a18] shadow-xs'
                    : 'bg-white hover:bg-[#f7f6f3] text-[#787774] hover:text-[#37352f] border-[#e3e2de]'
                }`}
              >
                <Globe
                  className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-[#787774]'}`}
                />
                <span className="font-semibold">{site.title}</span>
                {site.category && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-[#787774]'
                    }`}
                  >
                    {site.category}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Interactive Click-to-Launch Portal Screen (Replaces broken iframe) */}
      <a
        href={activeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative w-full rounded-2xl border border-[#e3e2de] dark:border-white/10 bg-white dark:bg-[#0c1220] shadow-sm hover:shadow-xl hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all duration-300 overflow-hidden cursor-pointer outline-none focus:ring-2 focus:ring-cyan-500"
        title={`${activeTitle} 웹사이트 바로 열기 (새 창)`}
      >
        {/* Browser Top Window Frame */}
        <div className="px-4 py-3 bg-[#f5f4ef] dark:bg-[#070b14] border-b border-[#e3e2de] dark:border-white/10 flex items-center justify-between gap-3 select-none">
          {/* Traffic light window controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
          </div>

          {/* Browser address bar */}
          <div className="flex-1 max-w-xl mx-auto flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-600 dark:text-zinc-300 group-hover:border-cyan-500/40 transition-colors">
            <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-md">{activeUrl}</span>
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold shrink-0">
              SECURE
            </span>
          </div>

          {/* Right link action hint */}
          <div className="flex items-center gap-1 text-xs font-mono text-zinc-500 dark:text-zinc-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            <span className="hidden md:inline text-[11px] font-semibold">새 탭에서 사이트 열기</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Main Display Canvas (Direct Interactive Card) */}
        <div className="relative min-h-[420px] sm:min-h-[480px] p-8 sm:p-14 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#faf9f6] via-white to-[#f5f4ef] dark:from-[#080d18] dark:via-[#0c1424] dark:to-[#060a12] overflow-hidden">
          {/* Subtle Background Circuit Grid Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

          {/* Interactive Floating Portal Card */}
          <div className="relative z-10 max-w-xl w-full flex flex-col items-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            {/* Category & Verified Status Pill */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60 shadow-xs">
                <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span>{activeCategory} PORTAL</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ONLINE</span>
              </span>
            </div>

            {/* Large Brand Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0a0a0a] dark:bg-[#121c32] text-white flex items-center justify-center shadow-xl border border-zinc-200 dark:border-cyan-500/30 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
              {activeCategory.includes('COMMUNITY') || activeCategory.includes('CLUB') ? (
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
              ) : activeCategory.includes('STORE') || activeCategory.includes('SHOP') ? (
                <Store className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
              ) : (
                <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
              )}
            </div>

            {/* Site Title & Tagline */}
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-4xl font-sans font-black tracking-tight text-[#0a0a0a] dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {activeTitle}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 font-sans max-w-md mx-auto leading-relaxed">
                {activeDescription}
              </p>
            </div>

            {/* Big Action Button */}
            <div className="pt-2 w-full max-w-sm">
              <div className="w-full py-3.5 px-6 rounded-2xl bg-black text-white dark:bg-cyan-500 dark:text-black font-sans font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg group-hover:bg-zinc-800 dark:group-hover:bg-cyan-400 group-hover:scale-[1.02] group-hover:shadow-cyan-500/20 transition-all duration-300">
                <span>공식 웹사이트 바로가기</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>

            {/* Subtle user instruction */}
            <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 pt-1">
              <span>🖱️</span>
              <span>화면 어디든 클릭하시면 공식 웹사이트가 새 창에서 열립니다.</span>
            </p>
          </div>
        </div>
      </a>

      {/* Safe Bottom Notice & Direct Access Card */}
      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#787774] px-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>안전한 공식 외부 사이트 연동 허브입니다.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] truncate max-w-[200px] sm:max-w-none">
            {activeUrl}
          </span>
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
          >
            <span>새 탭에서 열기</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
