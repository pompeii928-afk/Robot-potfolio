import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Store,
  ShieldCheck,
  ArrowUpRight,
  Plus,
  Edit2,
  Trash2,
  Lock,
  ShoppingBag,
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

// Site Theme & Brand Helper
const getSiteTheme = (site: ExternalSiteItem) => {
  const isKfc =
    !!site.previewImage ||
    site.url?.toLowerCase().includes('kfcclubhouse') ||
    site.title?.toLowerCase().includes('clubhouse') ||
    site.title?.toUpperCase().includes('K.F.C') ||
    site.id?.toLowerCase().includes('clubhouse');

  const isStore =
    site.category?.toUpperCase() === 'STORE' ||
    site.title?.toUpperCase().includes('STORE') ||
    site.url?.toLowerCase().includes('selling-site');

  if (isKfc) {
    return {
      type: 'kfc' as const,
      categoryLabel: 'COMMUNITY',
      accentColor: 'cyan',
      headerIcon: (
        <div className="w-full h-full flex items-center justify-center p-1 bg-white dark:bg-black rounded-xl border border-cyan-500/30 dark:border-cyan-500/40 shadow-xs">
          <img src="/kfc_clubhouse_logo.png" alt="K.F.C." className="w-full h-full object-contain" />
        </div>
      ),
      tabIcon: (
        <img
          src="/kfc_clubhouse_logo.png"
          alt="K.F.C."
          className="w-4 h-4 object-contain rounded-full bg-white dark:bg-zinc-800 p-0.5 border border-zinc-300 dark:border-white/20 shrink-0"
        />
      ),
      badgeClass:
        'bg-zinc-900 text-white dark:bg-cyan-950/80 dark:text-cyan-300 border border-zinc-700 dark:border-cyan-500/40',
      activeTabClass:
        'bg-[#1a1a18] text-white border-[#1a1a18] dark:bg-cyan-950 dark:text-cyan-200 dark:border-cyan-500/50 shadow-xs font-bold',
      inactiveTabClass:
        'bg-white hover:bg-zinc-100 text-zinc-800 font-bold border-zinc-300 dark:bg-[#121318] dark:text-zinc-300 dark:border-white/10 dark:hover:bg-zinc-800',
      kickerTag: 'K.F.C. OFFICIAL CLUBHOUSE',
      previewTag: 'K.F.C. MEMBERSHIP HUB',
      themeBorder: 'border-zinc-300 dark:border-cyan-500/30',
    };
  }

  if (isStore) {
    return {
      type: 'store' as const,
      categoryLabel: 'STORE',
      accentColor: 'amber',
      headerIcon: (
        <div className="w-full h-full flex items-center justify-center p-1 bg-[#151514] dark:bg-black rounded-xl border border-amber-500/40 shadow-xs overflow-hidden">
          <img
            src="/robo_store_logo.svg"
            alt="ROBO STORE"
            className="w-full h-full object-contain"
          />
        </div>
      ),
      tabIcon: (
        <img
          src="/robo_store_logo.svg"
          alt="ROBO STORE"
          className="w-4 h-4 object-contain rounded-xs shrink-0"
        />
      ),
      badgeClass:
        'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/50',
      activeTabClass:
        'bg-amber-500 text-black border-amber-500 dark:bg-amber-400 dark:text-black dark:border-amber-400 shadow-xs font-bold',
      inactiveTabClass:
        'bg-white hover:bg-amber-100/50 text-zinc-800 font-bold border-zinc-300 dark:bg-[#121318] dark:text-[#a3a29e] dark:border-white/10 dark:hover:bg-amber-950/20',
      kickerTag: 'WRO 2026 HARDWARE STORE',
      previewTag: 'WRO 2026 OFFICIAL PARTS STORE',
      themeBorder: 'border-amber-500/30 dark:border-amber-500/40',
    };
  }

  // Generic / other
  return {
    type: 'default' as const,
    categoryLabel: site.category || 'PORTAL',
    accentColor: 'blue',
    headerIcon: (
      <div className="w-full h-full flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/20 rounded-xl border border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-xs">
        <Globe className="w-5 h-5 text-blue-500 dark:text-blue-400" />
      </div>
    ),
    tabIcon: <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />,
    badgeClass:
      'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800/50',
    activeTabClass:
      'bg-[#1a1a18] text-white border-[#1a1a18] dark:bg-white dark:text-black dark:border-white shadow-xs font-bold',
    inactiveTabClass:
      'bg-white hover:bg-zinc-100 text-zinc-800 font-bold border-zinc-300 dark:bg-[#121318] dark:text-[#a3a29e] dark:border-white/10',
    kickerTag: 'SATELLITE RESOURCE',
    previewTag: 'OFFICIAL SATELLITE WEB PORTAL',
    themeBorder: 'border-blue-500/30 dark:border-blue-500/40',
  };
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canEmbedDirectly, setCanEmbedDirectly] = useState<boolean | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    activeSite?.description || 'WRO & CoSpace Robotics 공식 스토어 및 리소스 사이트';

  // Active Site Theme
  const activeTheme = getSiteTheme(activeSite);

  // Check if this specific site is K.F.C. Clubhouse or has a custom preview image
  const isKfcClubhouse =
    !!activeSite?.previewImage ||
    activeSite?.url?.toLowerCase().includes('kfcclubhouse') ||
    activeSite?.title?.toLowerCase().includes('clubhouse') ||
    activeSite?.title?.toUpperCase().includes('K.F.C') ||
    activeSite?.id?.toLowerCase().includes('clubhouse');

  const customPreviewImage =
    activeSite?.previewImage ||
    (isKfcClubhouse ? '/kfc_clubhouse_logo.png' : null);

  // Check if site has X-Frame-Options: DENY or CSP frame-ancestors blocking
  useEffect(() => {
    let isMounted = true;
    setCanEmbedDirectly(null);

    fetch(`/api/check-site-embed?url=${encodeURIComponent(activeUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setCanEmbedDirectly(data.canEmbedDirectly);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Check site embed error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [activeUrl]);

  // When active URL changes, reset loading state with timeout
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [activeUrl]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReload = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = activeUrl;
    }
  };

  const handleOpenSite = () => {
    window.open(activeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="external-site"
      className={`relative w-full transition-all duration-300 scroll-mt-20 ${
        isExpanded ? 'px-2 sm:px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
      } py-6 sm:py-10`}
    >
      {/* Stokt Section Kicker */}
      <div className="flex items-center gap-2 mb-4">
        <span className="font-mono text-xs text-zinc-800 dark:text-zinc-200 font-bold tracking-wider uppercase">
          ( 06 / STORE &amp; SATELLITE SITES )
        </span>
        <span className="h-px flex-1 bg-zinc-300 dark:bg-white/10 max-w-[80px]" />
      </div>

      {/* Header Info & Toolbar */}
      <div className="mb-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121318] border border-zinc-200 dark:border-white/10 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Site Identity tailored to active site */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shrink-0 overflow-hidden shadow-xs">
            {activeTheme.headerIcon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black font-sans text-zinc-950 dark:text-[#f4f2ee] leading-snug tracking-tight truncate">
                {t('nav.otherSite', '다른 웹사이트')}
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shadow-2xs ${activeTheme.badgeClass}`}>
                {activeTheme.kickerTag}
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-800 dark:text-[#a3a29e] font-medium truncate mt-0.5">
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

          {/* Refresh Button */}
          <button
            onClick={handleReload}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="페이지 새로고침"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#787774] ${isLoading ? 'animate-spin text-blue-600' : ''}`}
            />
            <span className="hidden sm:inline">새로고침</span>
          </button>

          {/* Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title={isExpanded ? '표준 너비로 복원' : '화면 넓게 보기'}
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-[#787774]" />
                <span className="hidden sm:inline">표준 화면</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#787774]" />
                <span className="hidden sm:inline">넓게 보기</span>
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

      {/* Multiple Websites Tabs with individual site styling */}
      {siteList.length > 1 && (
        <div className="mb-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {siteList.map((site) => {
            const isSelected = site.id === activeSite.id;
            const theme = getSiteTheme(site);
            return (
              <button
                key={site.id}
                onClick={() => {
                  setSelectedSiteId(site.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected ? theme.activeTabClass : theme.inactiveTabClass
                }`}
              >
                {theme.tabIcon}
                <span className="font-semibold">{site.title}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    isSelected ? 'bg-white/20 text-current' : theme.badgeClass
                  }`}
                >
                  {theme.categoryLabel}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Embedded Iframe / Preview Container */}
      <div
        className={`group relative w-full rounded-2xl border ${activeTheme.themeBorder} bg-white dark:bg-[#121318] shadow-sm overflow-hidden min-h-[520px] transition-all`}
      >
        {/* Browser Top Window Bar Tailored to Site Theme */}
        <div className="px-4 py-2.5 bg-[#f5f4ef] dark:bg-[#070b14] border-b border-[#e3e2de] dark:border-white/10 flex items-center justify-between gap-3 select-none text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 text-[11px] text-zinc-600 dark:text-zinc-300 truncate">
            {activeTheme.type === 'store' ? (
              <img
                src="/robo_store_logo.svg"
                alt="Store"
                className="w-3.5 h-3.5 object-contain rounded-xs shrink-0"
              />
            ) : (
              <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
            )}
            <span className="truncate max-w-[200px] sm:max-w-xs">{activeUrl}</span>
            <span className={`hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded font-bold ${activeTheme.badgeClass}`}>
              {activeTheme.previewTag}
            </span>
          </div>

          <button
            onClick={handleOpenSite}
            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">새 탭 열기</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Display Body */}
        {customPreviewImage ? (
          <div
            onClick={handleOpenSite}
            className={`w-full flex flex-col items-center justify-center p-8 sm:p-14 select-none bg-white dark:bg-[#0c1220] transition-all relative cursor-pointer ${
              isExpanded ? 'h-[85vh] min-h-[660px]' : 'h-[75vh] min-h-[580px]'
            }`}
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md">
              {/* Image uploaded by user */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 shadow-lg group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300">
                <img
                  src={customPreviewImage}
                  alt={activeTitle}
                  className="w-48 h-48 sm:w-64 sm:h-64 object-contain transition-transform duration-300"
                />
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-bold font-sans text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                  {activeTitle}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans max-w-sm mx-auto">
                  {activeDescription}
                </p>
              </div>

              {/* Call-to-action button */}
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-sans font-bold text-xs sm:text-sm shadow-md group-hover:scale-105 transition-all">
                  <span>화면을 누르면 사이트로 이동합니다</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Bottom-right shortcut badge */}
            <div className="absolute bottom-4 right-4 z-10">
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-black/80 text-white dark:bg-white/90 dark:text-black flex items-center gap-1.5 shadow-md">
                <span>새 창에서 열기</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ) : (
          <div className="relative w-full">
            {/* Loading Spinner / Skeleton */}
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 dark:bg-[#121318]/95 backdrop-blur-xs transition-opacity duration-300">
                <div className="w-10 h-10 border-3 border-[#e3e2de] border-t-amber-500 rounded-full animate-spin mb-3" />
                <div className="text-center space-y-1.5 px-4">
                  <p className="text-sm font-semibold text-[#37352f] dark:text-[#f4f2ee]">
                    {activeTitle} 사이트를 불러오는 중입니다...
                  </p>
                  <p className="text-xs text-[#787774] dark:text-[#a3a29e] font-mono truncate max-w-md">
                    {activeUrl}
                  </p>
                </div>
              </div>
            )}

            {/* Live Iframe */}
            <iframe
              ref={iframeRef}
              key={activeUrl}
              src={activeUrl}
              title={activeTitle}
              onLoad={() => setIsLoading(false)}
              className={`w-full transition-all duration-300 border-0 bg-white ${
                isExpanded ? 'h-[85vh] min-h-[660px]' : 'h-[75vh] min-h-[580px]'
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
            />

            {/* Subtle click guide badge over iframe frame */}
            <div className="absolute bottom-3 right-3 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenSite();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-black/80 hover:bg-black text-white dark:bg-white/90 dark:text-black dark:hover:bg-white backdrop-blur-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>새 창에서 사이트 열기</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Safe Bottom Notice & Direct Access Card */}
      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#787774] px-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>안전한 연결을 통해 공식 외부 사이트가 실시간으로 임베드되어 작동합니다.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono">URL: {activeUrl}</span>
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-1"
          >
            <span>전체 화면 새 탭 열기</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
