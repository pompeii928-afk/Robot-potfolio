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
  const activeDescription = activeSite?.description || 'WRO & CoSpace Robotics 공식 스토어 및 리소스 사이트';

  // When active site changes, reset loading state
  useEffect(() => {
    setIsLoading(true);
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

  return (
    <section
      id="external-site"
      className={`relative w-full transition-all duration-300 scroll-mt-20 ${
        isExpanded ? 'px-2 sm:px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
      } py-4 sm:py-6`}
    >
      {/* Header Info & Toolbar */}
      <div className="mb-4 p-4 sm:p-5 rounded-2xl bg-[#f7f6f3] border border-[#e3e2de] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Site Identity (Targeted LIVE CONNECTED badge has been removed as requested) */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1a1a18] text-white flex items-center justify-center shrink-0 shadow-xs border border-zinc-700">
            <Store className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-[#37352f] leading-snug truncate">
                {t('nav.otherSite', '다른 왭사이트')}
              </h2>
            </div>
            <p className="text-xs text-[#787774] truncate mt-0.5">
              {activeTitle} • {activeDescription}
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
              title="새 웹사이트 추가 (관리자)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 웹사이트 추가</span>
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
            <RefreshCw className={`w-3.5 h-3.5 text-[#787774] ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
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

          {/* External Window Link */}
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a1a18] hover:bg-[#2d2d2a] text-white transition-colors cursor-pointer shadow-2xs"
            title="새 브라우저 탭에서 전체 사이트 열기"
          >
            <span>새 탭에서 열기</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300" />
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
                onClick={() => setSelectedSiteId(site.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#1a1a18] text-white border-[#1a1a18] shadow-xs'
                    : 'bg-white hover:bg-[#f7f6f3] text-[#787774] hover:text-[#37352f] border-[#e3e2de]'
                }`}
              >
                <Globe className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-[#787774]'}`} />
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
      <div className="relative w-full rounded-2xl border border-[#e3e2de] bg-white shadow-sm overflow-hidden min-h-[500px]">
        {/* Loading Spinner / Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs transition-opacity duration-300">
            <div className="w-10 h-10 border-3 border-[#e3e2de] border-t-amber-500 rounded-full animate-spin mb-3" />
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-[#37352f]">
                {activeTitle} 사이트를 불러오는 중입니다...
              </p>
              <p className="text-xs text-[#787774] font-mono">
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
          className={`w-full transition-all duration-300 border-0 ${
            isExpanded ? 'h-[88vh] min-h-[700px]' : 'h-[80vh] min-h-[640px]'
          }`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />
      </div>

      {/* Safe Bottom Notice */}
      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#787774] px-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>보안 연결을 통해 공식 외부 사이트가 실시간으로 임베드되어 작동합니다.</span>
        </div>
        <div className="flex items-center gap-2">
          <span>문제가 발생할 경우</span>
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium inline-flex items-center gap-0.5"
          >
            <span>직접 접속하기</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
