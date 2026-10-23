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
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canEmbedDirectly, setCanEmbedDirectly] = useState<boolean | null>(null);
  const [hasBlockedEmbed, setHasBlockedEmbed] = useState(false);
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

  // Check if site has X-Frame-Options: DENY or CSP frame-ancestors blocking
  useEffect(() => {
    let isMounted = true;
    setCanEmbedDirectly(null);
    setHasBlockedEmbed(false);

    fetch(`/api/check-site-embed?url=${encodeURIComponent(activeUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setCanEmbedDirectly(data.canEmbedDirectly);
        if (data.canEmbedDirectly === false) {
          setHasBlockedEmbed(true);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Check site embed error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [activeUrl]);

  // Automatically use server proxy if embedding is blocked by X-Frame-Options/CSP
  const shouldUseProxy = canEmbedDirectly === false || hasBlockedEmbed;

  const effectiveIframeUrl = shouldUseProxy
    ? `/api/proxy-site?url=${encodeURIComponent(activeUrl)}`
    : activeUrl;

  // When active URL or effective URL changes, trigger loading with auto-timeout
  useEffect(() => {
    setIsLoading(true);
    // Safety timeout: prevents infinite spinner if iframe onLoad does not fire
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [effectiveIframeUrl]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReload = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = effectiveIframeUrl;
    }
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
            <Store className="w-5 h-5 text-amber-500 dark:text-amber-400" />
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

      {/* Multiple Websites Tabs (if more than 1 website registered) */}
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

      {/* Embedded Iframe Container */}
      <div className="relative w-full rounded-2xl border border-[#e3e2de] dark:border-white/10 bg-white dark:bg-[#121318] shadow-sm overflow-hidden min-h-[520px]">

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
              <div className="pt-2">
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  <span>화면이 늦게 뜨면 새 탭에서 바로 열기</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Live Iframe */}
        <iframe
          ref={iframeRef}
          key={`${activeUrl}-${shouldUseProxy}`}
          src={effectiveIframeUrl}
          title={activeTitle}
          onLoad={() => setIsLoading(false)}
          className={`w-full transition-all duration-300 border-0 bg-white ${
            isExpanded ? 'h-[88vh] min-h-[700px]' : 'h-[80vh] min-h-[640px]'
          }`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
        />
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

