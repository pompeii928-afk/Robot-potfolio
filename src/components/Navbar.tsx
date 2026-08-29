import React, { useState, useEffect, useRef } from 'react';
import { RobotLogo } from './RobotLogo';
import {
  Menu,
  X,
  Mail,
  Globe,
  LayoutGrid,
  Bot,
  TrendingUp,
  Trophy,
  Cpu,
  FolderGit2,
  Youtube,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../context/ThemeContext';

export interface CategoryCounts {
  journeys?: number;
  awards?: number;
  skills?: number;
  projects?: number;
  videos?: number;
}

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  counts?: CategoryCounts;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  counts = {} as CategoryCounts,
  isAdmin = false,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll the category bar so the active category button follows and stays visible in view
  useEffect(() => {
    const scrollCategoryIntoView = () => {
      if (desktopNavRef.current) {
        const activeBtn = desktopNavRef.current.querySelector<HTMLElement>(
          `[data-category-id="${activeSection}"]`
        );
        if (activeBtn) {
          activeBtn.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
          });
        }
      }

      if (mobileNavRef.current) {
        const activeMobileBtn = mobileNavRef.current.querySelector<HTMLElement>(
          `[data-category-id="${activeSection}"]`
        );
        if (activeMobileBtn) {
          activeMobileBtn.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
          });
        }
      }
    };

    // Timeout ensures DOM updates and layout paints have occurred
    const timeoutId = setTimeout(scrollCategoryIntoView, 50);
    return () => clearTimeout(timeoutId);
  }, [activeSection]);

  const categories = [
    {
      id: 'all',
      labelEn: 'Overview',
      labelKo: '전체 보기',
      icon: LayoutGrid,
      count: undefined,
    },
    {
      id: 'about',
      labelEn: 'About & Robot',
      labelKo: '소개 & 비전',
      icon: Bot,
      count: undefined,
    },
    {
      id: 'journey',
      labelEn: 'Journey',
      labelKo: '대회 여정',
      icon: TrendingUp,
      count: counts.journeys,
    },
    {
      id: 'awards',
      labelEn: 'Awards',
      labelKo: '수상 내역',
      icon: Trophy,
      count: counts.awards,
    },
    {
      id: 'skills',
      labelEn: 'Skills',
      labelKo: '핵심 역량',
      icon: Cpu,
      count: counts.skills,
    },
    {
      id: 'experience',
      labelEn: 'Projects',
      labelKo: '로봇 시스템',
      icon: FolderGit2,
      count: counts.projects,
    },
    {
      id: 'youtube',
      labelEn: 'YouTube',
      labelKo: '유튜브 채널',
      icon: Youtube,
      count: counts.videos,
    },
  ];

  const handleSelectTab = (id: string) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    onNavigate(id);
  };

  return (
    <header
      id="navbar-header"
      className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white/95 backdrop-blur-md border-b border-[#e3e2de] ${
        isScrolled ? 'shadow-[0_2px_10px_rgba(0,0,0,0.04)]' : ''
      }`}
    >
      {/* Top Workspace Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-15 gap-3">
          {/* Left: Notion Page Identity */}
          <button
            id="nav-logo-btn"
            onClick={() => handleSelectTab('all')}
            className="flex items-center gap-2.5 group text-left cursor-pointer transition-opacity hover:opacity-80 shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#f7f6f3] border border-[#e3e2de] flex items-center justify-center text-zinc-900 shadow-2xs group-hover:bg-[#efefed]">
              <RobotLogo size={22} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-sm sm:text-base text-[#37352f] tracking-tight">
                K.F.C.Code Chaser
              </span>
            </div>
          </button>

          {/* Center (Desktop/Tablet): Notion Integrated Category Bar */}
          <nav
            ref={desktopNavRef}
            className="hidden lg:flex items-center gap-1 bg-[#f7f6f3] p-1 rounded-lg border border-[#e3e2de] overflow-x-auto no-scrollbar max-w-2xl scroll-smooth"
          >
            {categories.map((cat) => {
              const isActive = activeSection === cat.id;
              const Icon = cat.icon;
              const label = lang === 'en' ? cat.labelEn : cat.labelKo;
              const isYouTube = cat.id === 'youtube';

              return (
                <button
                  key={cat.id}
                  id={`top-cat-${cat.id}`}
                  data-category-id={cat.id}
                  onClick={() => handleSelectTab(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all duration-150 cursor-pointer select-none whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white text-[#37352f] font-semibold shadow-2xs border border-[#e3e2de]'
                      : 'text-[#787774] hover:text-[#37352f] hover:bg-white/60 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive
                        ? isYouTube
                          ? 'text-red-600'
                          : 'text-[#37352f]'
                        : isYouTube
                        ? 'text-red-500/70'
                        : 'text-[#787774]'
                    }`}
                  />
                  <span>{label}</span>
                  {cat.count !== undefined && cat.count > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1 rounded-sm leading-tight ${
                        isActive
                          ? 'bg-[#efefed] text-[#37352f]'
                          : 'bg-[#e3e2de]/60 text-[#787774]'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher & Contact */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Toggle (Notion pill) */}
            <button
              id="lang-toggle-btn"
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-md text-xs font-sans font-medium text-[#37352f] bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] flex items-center gap-1.5 transition-colors cursor-pointer select-none"
              title={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-[#787774]" />
              <span className="text-xs font-mono font-semibold">
                {lang === 'ko' ? 'EN' : '한국어'}
              </span>
            </button>

            {/* Contact Button (Notion style action) */}
            <button
              id="nav-contact-btn"
              onClick={() => {
                const el = document.getElementById('contact-footer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold rounded-md text-[#37352f] bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] transition-colors cursor-pointer"
              title="Contact"
            >
              <Mail className="w-3.5 h-3.5 text-[#787774]" />
              <span>{t('nav.contact', 'Contact')}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md text-[#37352f] bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile / Tablet Sub-strip Category Navigation */}
        <div
          ref={mobileNavRef}
          className="lg:hidden py-2 border-t border-[#e3e2de]/60 flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {categories.map((cat) => {
            const isActive = activeSection === cat.id;
            const Icon = cat.icon;
            const label = lang === 'en' ? cat.labelEn : cat.labelKo;
            const isYouTube = cat.id === 'youtube';

            return (
              <button
                key={cat.id}
                data-category-id={cat.id}
                onClick={() => handleSelectTab(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans font-medium shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#37352f] text-white font-semibold shadow-2xs'
                    : 'text-[#5a5854] bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? isYouTube
                        ? 'text-red-400'
                        : 'text-white'
                      : isYouTube
                      ? 'text-red-600'
                      : 'text-[#787774]'
                  }`}
                />
                <span>{label}</span>
                {cat.count !== undefined && cat.count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1 rounded-sm ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#e3e2de] text-[#787774]'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer (When hamburger is opened) */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="lg:hidden px-4 pt-3 pb-5 bg-white border-b border-[#e3e2de] shadow-lg animate-in slide-in-from-top duration-200"
        >
          <div className="flex flex-col gap-1">
            {categories.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              const label = lang === 'en' ? item.labelEn : item.labelKo;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-sans font-medium flex items-center justify-between cursor-pointer transition-colors ${
                    isActive
                      ? 'text-[#37352f] bg-[#efefed] font-semibold border border-[#e3e2de]'
                      : 'text-[#5a5854] hover:bg-[#f7f6f3]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#787774]" />
                    <span>{label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span className="text-xs font-mono text-[#787774] bg-[#e3e2de] px-1.5 py-0.5 rounded">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}



            <div className="pt-3 mt-2 border-t border-[#e3e2de] flex items-center justify-between text-xs text-[#787774]">
              <a
                href="mailto:pompeii928@gmail.com"
                className="flex items-center gap-1.5 hover:text-[#37352f]"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>pompeii928@gmail.com</span>
              </a>
              <a
                href="https://www.youtube.com/@Wrocospace"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-red-600 hover:underline"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>@Wrocospace</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
