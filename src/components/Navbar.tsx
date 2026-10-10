import React, { useState, useEffect, useRef } from 'react';
import { RobotLogo } from './RobotLogo';
import {
  Menu,
  X,
  Mail,
  Globe,
  LayoutGrid,
  Bot,
  BookOpen,
  TrendingUp,
  Trophy,
  Cpu,
  FolderGit2,
  Youtube,
  ExternalLink,
  ChevronDown,
  Check,
  User,
  LogIn,
  LogOut,
  ShieldCheck,
  Users,
  UserCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, Language } from '../context/ThemeContext';
import { useAuth } from '../firebase/AuthContext';
import { openGmailCompose } from '../utils/contactHelper';
import { cyberAudio } from '../utils/cyberAudio';

export interface CategoryCounts {
  reviews?: number;
  journeys?: number;
  awards?: number;
  skills?: number;
  projects?: number;
  videos?: number;
  websites?: number;
}

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  counts?: CategoryCounts;
  isAdmin?: boolean;
  visitorName?: string;
  onOpenCheckin?: () => void;
  onOpenAdmin?: () => void;
  onOpenUsersView?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  counts = {} as CategoryCounts,
  isAdmin = false,
  visitorName,
  onOpenCheckin,
  onOpenAdmin,
  onOpenUsersView,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { lang, setLanguage, toggleLanguage, t } = useLanguage();
  const { currentUser, userProfile, logout, adminUser } = useAuth();
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside click for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open direct Gmail web compose for contacting the portfolio owner in the user's selected language
  const handleOpenGmail = () => {
    openGmailCompose(lang);
  };

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

    const timeoutId = setTimeout(scrollCategoryIntoView, 50);
    return () => clearTimeout(timeoutId);
  }, [activeSection]);

  const categories = [
    {
      id: 'all',
      key: 'nav.overview',
      fallback: '전체 보기',
      icon: LayoutGrid,
      count: undefined,
    },
    {
      id: 'about',
      key: 'nav.about',
      fallback: '소개 & 비전',
      icon: Bot,
      count: undefined,
    },
    {
      id: 'reviews',
      key: 'nav.reviews',
      fallback: '대회 후기',
      icon: BookOpen,
      count: counts.reviews,
    },
    {
      id: 'journey',
      key: 'nav.journey',
      fallback: '대회 여정',
      icon: TrendingUp,
      count: counts.journeys,
    },
    {
      id: 'awards',
      key: 'nav.awards',
      fallback: '수상 내역',
      icon: Trophy,
      count: counts.awards,
    },
    {
      id: 'skills',
      key: 'nav.skills',
      fallback: '핵심 역량',
      icon: Cpu,
      count: counts.skills,
    },
    {
      id: 'experience',
      key: 'nav.experience',
      fallback: '로봇 시스템',
      icon: FolderGit2,
      count: counts.projects,
    },
    {
      id: 'youtube',
      key: 'nav.youtube',
      fallback: '유튜브 채널',
      icon: Youtube,
      count: counts.videos,
    },
    {
      id: 'external-site',
      key: 'nav.otherSite',
      fallback: '다른 왭사이트',
      icon: Globe,
      count: counts.websites,
    },
  ];

  const handleSelectTab = (id: string) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    onNavigate(id);
  };

  // Consecutive 6-click trigger for Admin Login Portal
  const logoClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoClickCountRef = useRef<number>(0);

  const handleLogoClick = () => {
    handleSelectTab('all');

    logoClickCountRef.current += 1;

    if (logoClickTimeoutRef.current) {
      clearTimeout(logoClickTimeoutRef.current);
    }

    logoClickTimeoutRef.current = setTimeout(() => {
      logoClickCountRef.current = 0;
    }, 2500);

    if (logoClickCountRef.current >= 6) {
      logoClickCountRef.current = 0;
      if (logoClickTimeoutRef.current) {
        clearTimeout(logoClickTimeoutRef.current);
      }
      if (onOpenAdmin) {
        onOpenAdmin();
      } else {
        window.history.pushState({}, '', '/admin');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  const [isSoundActive, setIsSoundActive] = useState<boolean>(() => !cyberAudio.getMuted());

  const handleToggleSound = () => {
    const newMuted = cyberAudio.toggleMuted();
    setIsSoundActive(!newMuted);
    if (!newMuted) {
      cyberAudio.playBootSound();
    }
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <header
      id="navbar-header"
      className="sticky top-0 z-50 w-full transition-all duration-200 bg-white/95 backdrop-blur-xl border-none border-0 shadow-none"
    >
      {/* Top Workspace Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
          {/* Left: Brand Identity */}
          <button
            id="nav-logo-btn"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer transition-opacity hover:opacity-85 shrink-0 min-w-0 select-none"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-zinc-100 flex items-center justify-center shrink-0 shadow-2xs border border-zinc-200 group-hover:scale-105 active:scale-95 transition-all duration-200">
              <img
                src="/favicon.svg?v=7"
                alt="K.F.C. Code Chaser Logo"
                className="w-full h-full object-cover select-none cursor-pointer"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-sans font-black text-sm sm:text-base text-zinc-900 tracking-tight truncate">
                K.F.C. Code Chaser
              </span>
              <span className="hidden sm:inline font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                // ARCHIVE
              </span>
            </div>
          </button>

          {/* Center (Desktop/Tablet): Alche Studio Category Bar (No lines) */}
          <nav
            ref={desktopNavRef}
            className="hidden lg:flex items-center gap-1 bg-zinc-100/90 p-1 rounded-full overflow-x-auto no-scrollbar max-w-2xl scroll-smooth backdrop-blur-md"
          >
            {categories.map((cat, idx) => {
              const isActive = activeSection === cat.id;
              const Icon = cat.icon;
              const label = t(cat.key, cat.fallback);
              const isYouTube = cat.id === 'youtube';

              return (
                <button
                  key={cat.id}
                  id={`top-cat-${cat.id}`}
                  data-category-id={cat.id}
                  onClick={() => handleSelectTab(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-150 cursor-pointer select-none whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-black text-white font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-black hover:bg-black/5'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive
                        ? isYouTube
                          ? 'text-red-400'
                          : 'text-white'
                        : isYouTube
                        ? 'text-red-600'
                        : 'text-zinc-500'
                    }`}
                  />
                  <span>{label}</span>
                  {cat.count !== undefined && cat.count > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1 rounded-full leading-tight ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-zinc-500'
                      }`}
                    >
                      ({cat.count})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Sound Toggle, Multi-Language Selector & Contact */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Alche Studio Sound Toggle Button */}
            <button
              id="nav-sound-toggle-btn"
              onClick={handleToggleSound}
              className={`px-2.5 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer select-none shrink-0 ${
                isSoundActive
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:text-black hover:bg-zinc-200'
              }`}
              title={isSoundActive ? 'Sound: ON (Click to Mute)' : 'Sound: OFF (Click to Enable)'}
              aria-label="Sound Toggle"
            >
              {isSoundActive ? (
                <Volume2 className="w-3.5 h-3.5 text-white shrink-0" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              )}
              <span className="hidden sm:inline text-[11px] font-mono tracking-wider font-semibold">
                {isSoundActive ? 'SOUND ON' : 'SOUND OFF'}
              </span>
              {/* Equalizer animation bars */}
              {isSoundActive && (
                <span className="hidden md:flex items-center gap-0.5 h-3 ml-0.5">
                  <span className="w-0.5 h-2 bg-white animate-pulse" />
                  <span className="w-0.5 h-3 bg-white/80 animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-white animate-pulse delay-150" />
                </span>
              )}
            </button>
            {/* Multi-Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                id="lang-toggle-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-2.5 py-1.5 rounded-full text-xs font-mono font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer select-none shrink-0"
                title="Select language"
                aria-label="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-500 hidden xs:block" />
                <span className="text-xs font-mono font-medium flex items-center gap-1">
                  <span>{currentLangObj.flag}</span>
                  <span className="font-semibold text-[11px] sm:text-xs">
                    {currentLangObj.code.toUpperCase()}
                  </span>
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {/* Language Dropdown Menu */}
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-zinc-200 shadow-xl py-1.5 z-50 text-zinc-900 backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-mono text-zinc-400 border-b border-zinc-100 uppercase tracking-wider">
                    // SELECT LANGUAGE
                  </div>
                  {SUPPORTED_LANGUAGES.map((item) => {
                    const isSelected = item.code === lang;
                    return (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-100 text-black font-bold'
                            : 'text-zinc-700 hover:bg-zinc-50 hover:text-black'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">{item.flag}</span>
                          <span>{item.nativeName}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Admin Profile or Visitor Checkin Button */}
            {isAdmin ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="user-profile-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-2.5 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/30 shrink-0"
                  title="Admin Account"
                >
                  <div className="w-4 h-4 rounded-full text-black flex items-center justify-center text-[9px] font-bold bg-emerald-400">
                    A
                  </div>
                  <span className="font-semibold text-xs hidden xs:inline">관리자</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <ChevronDown className="w-3 h-3 text-emerald-300" />
                </button>

                {/* Admin Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0c0d13] border border-white/10 shadow-2xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100 text-white">
                    <div className="px-3.5 py-2.5 border-b border-white/10 bg-white/[0.02]">
                      <div className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span>{adminUser?.username || '관리자 마스터'}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                          ADMIN
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                        시스템 실시간 관리자
                      </div>
                    </div>

                    <div className="py-1">
                      {onOpenUsersView && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenUsersView();
                          }}
                          className="w-full px-3.5 py-2 text-xs text-left text-zinc-200 hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                        >
                          <UserCheck className="w-4 h-4 text-cyan-400" />
                          <span>👥 {t('admin.visitorList', '방문자 체크인 명단 확인')}</span>
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await logout();
                        }}
                        className="w-full px-3.5 py-1.5 text-xs text-left text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors cursor-pointer border-t border-white/10 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>{t('admin.logout', '로그아웃')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : visitorName ? (
              <button
                id="nav-visitor-checkin-btn"
                onClick={onOpenCheckin}
                className="px-3 py-1.5 rounded-full text-xs font-mono font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer select-none shrink-0"
                title={t('checkin.reenter', '수정/다시 입력')}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="max-w-[70px] sm:max-w-[100px] truncate font-semibold">
                  {visitorName}
                </span>
                <span className="text-[10px] text-emerald-600 hidden sm:inline font-normal">
                  {t('nav.checkedInBadge', '님')}
                </span>
              </button>
            ) : (
              <button
                id="nav-visitor-checkin-btn"
                onClick={onOpenCheckin}
                className="px-3 py-1.5 rounded-full text-xs font-mono font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer select-none shrink-0"
                title={t('nav.checkin', '방문자 체크인')}
              >
                <UserCheck className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span className="hidden xs:inline">{t('nav.checkin', '방문자 체크인')}</span>
                <span className="xs:hidden">체크인</span>
              </button>
            )}

            {/* Contact Button */}
            <button
              id="nav-contact-btn"
              onClick={handleOpenGmail}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-bold rounded-full text-white bg-black hover:bg-zinc-800 transition-all duration-200 cursor-pointer group shadow-xs shrink-0"
              title="Gmail로 바로 문의하기 (pompeii928@gmail.com)"
            >
              <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>{lang === 'ko' ? '문의하기 ↗' : 'Get in touch ↗'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-full text-zinc-800 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile / Tablet Sub-strip Category Navigation (Line Removed) */}
        <div
          ref={mobileNavRef}
          className="lg:hidden -mx-4 px-4 py-2 border-none border-0 shadow-none flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth overscroll-x-contain touch-pan-x"
        >
          {categories.map((cat) => {
            const isActive = activeSection === cat.id;
            const Icon = cat.icon;
            const label = t(cat.key, cat.fallback);
            const isYouTube = cat.id === 'youtube';

            return (
              <button
                key={cat.id}
                data-category-id={cat.id}
                onClick={() => handleSelectTab(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-black text-white font-bold shadow-xs'
                    : 'text-zinc-600 bg-zinc-100 hover:bg-zinc-200'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? isYouTube
                        ? 'text-red-600'
                        : 'text-black'
                      : isYouTube
                      ? 'text-red-400'
                      : 'text-zinc-400'
                  }`}
                />
                <span>{label}</span>
                {cat.count !== undefined && cat.count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1 rounded-sm ${
                      isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-400'
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
          className="lg:hidden px-4 pt-3 pb-5 bg-white/98 backdrop-blur-2xl shadow-xl animate-in slide-in-from-top duration-200 text-zinc-900 border-b-0"
        >
          <div className="flex flex-col gap-1.5">
            {categories.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              const label = t(item.key, item.fallback);
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ${
                    isActive
                      ? 'text-white bg-black font-bold shadow-xs'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-zinc-500" />
                    <span>{label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Mobile Language Selector */}
            <div className="pt-3 mt-2 border-t border-zinc-100">
              <div className="text-[11px] font-mono text-zinc-400 uppercase mb-2">
                // LANGUAGE
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {SUPPORTED_LANGUAGES.map((item) => {
                  const isSelected = item.code === lang;
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white border-black font-bold'
                          : 'bg-zinc-100 text-zinc-700 border-transparent hover:bg-zinc-200'
                      }`}
                    >
                      <span>{item.flag}</span>
                      <span>{item.code.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenGmail();
                }}
                className="flex items-center gap-1.5 hover:text-black cursor-pointer"
                title="Gmail로 바로 연락하기 (pompeii928@gmail.com)"
              >
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span>pompeii928@gmail.com</span>
              </button>
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
