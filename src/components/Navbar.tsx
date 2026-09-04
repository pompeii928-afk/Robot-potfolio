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
  ChevronDown,
  Check,
  User,
  LogIn,
  LogOut,
  ShieldCheck,
  Users,
  UserCheck,
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, Language } from '../context/ThemeContext';
import { useAuth } from '../firebase/AuthContext';

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

  // Open direct Gmail web compose for contacting the portfolio owner
  const handleOpenGmail = () => {
    const email = 'pompeii928@gmail.com';
    const subject = encodeURIComponent(
      lang === 'ko'
        ? 'K.F.C. Code Chaser 로봇공학 포트폴리오 문의'
        : '[K.F.C. Code Chaser] Robotics Portfolio Inquiry'
    );
    const body = encodeURIComponent(
      lang === 'ko'
        ? '안녕하세요 배지훈(Jihoon Bae) 님!\nK.F.C. Code Chaser 로봇공학 포트폴리오를 보고 연락드립니다.\n\n- 성함 / 소속:\n- 연락처:\n- 문의 내용:\n'
        : 'Hello Jihoon Bae!\nI am reaching out regarding your K.F.C. Code Chaser Robotics Portfolio.\n\n- Name / Organization:\n- Contact Information:\n- Inquiry Details:\n'
    );

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

    // Open Gmail web compose in a new window/tab
    const newWin = window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
    // Fallback to mailto link if popup is restricted
    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
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
  ];

  const handleSelectTab = (id: string) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    onNavigate(id);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

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
              const label = t(cat.key, cat.fallback);
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

          {/* Right Controls: Multi-Language Selector & Contact */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Multi-Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                id="lang-toggle-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-2.5 py-1.5 rounded-md text-xs font-sans font-medium text-[#37352f] bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                title="Select language"
                aria-label="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-[#787774]" />
                <span className="text-xs font-sans font-medium flex items-center gap-1">
                  <span>{currentLangObj.flag}</span>
                  <span className="font-mono font-semibold">{currentLangObj.code.toUpperCase()}</span>
                </span>
                <ChevronDown className="w-3 h-3 text-[#787774]" />
              </button>

              {/* Language Dropdown Menu */}
              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-lg bg-white border border-[#e3e2de] shadow-lg py-1 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                  <div className="px-2.5 py-1 text-[11px] font-mono text-[#787774] border-b border-[#e3e2de] uppercase">
                    Select Language
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
                        className={`w-full px-2.5 py-1.5 text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#f7f6f3] text-[#37352f] font-semibold'
                            : 'text-[#5a5854] hover:bg-[#fbfbfa] hover:text-[#37352f]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">{item.flag}</span>
                          <span>{item.nativeName}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#2383e2]" />}
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
                  className="px-2.5 py-1.5 rounded-md text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer border shadow-2xs bg-[#edf6ec] hover:bg-[#d2ebd0] text-emerald-800 border-[#d2ebd0]"
                  title="Admin Account"
                >
                  <div className="w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-bold bg-emerald-700">
                    A
                  </div>
                  <span className="font-semibold text-xs">관리자</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <ChevronDown className="w-3 h-3 text-emerald-700" />
                </button>

                {/* Admin Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-60 rounded-lg bg-white border border-[#e3e2de] shadow-lg py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-[#e3e2de] bg-[#fbfbfa]">
                      <div className="font-semibold text-xs text-[#37352f] flex items-center gap-1.5">
                        <span>{adminUser?.username || '관리자 마스터'}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#edf6ec] text-emerald-700 border border-[#d2ebd0] font-bold">
                          ADMIN
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#787774] truncate mt-0.5">
                        포트폴리오 실시간 관리자
                      </div>
                    </div>

                    <div className="py-1">
                      {onOpenUsersView && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenUsersView();
                          }}
                          className="w-full px-3 py-2 text-xs text-left text-emerald-800 hover:bg-[#edf6ec] flex items-center gap-2 transition-colors cursor-pointer font-medium"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>👥 {t('admin.visitorList', '방문자 체크인 명단 확인')}</span>
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await logout();
                        }}
                        className="w-full px-3 py-1.5 text-xs text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer border-t border-[#e3e2de] mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
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
                className="px-2.5 py-1.5 rounded-md text-xs font-sans font-medium text-emerald-900 bg-[#edf6ec] hover:bg-[#d2ebd0] border border-[#d2ebd0] flex items-center gap-1.5 transition-colors cursor-pointer select-none shadow-2xs"
                title={t('checkin.reenter', '수정/다시 입력')}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="max-w-[100px] truncate font-semibold">{visitorName}</span>
                <span className="text-[10px] text-emerald-700 hidden sm:inline font-normal">
                  {t('nav.checkedInBadge', '님 (체크인됨)')}
                </span>
              </button>
            ) : (
              <button
                id="nav-visitor-checkin-btn"
                onClick={onOpenCheckin}
                className="px-2.5 py-1.5 rounded-md text-xs font-sans font-medium text-[#37352f] bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] flex items-center gap-1.5 transition-colors cursor-pointer select-none shadow-2xs"
                title={t('nav.checkin', '방문자 체크인')}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{t('nav.checkin', '방문자 체크인')}</span>
              </button>
            )}

            {/* Contact Button (Direct Gmail Integration) */}
            <button
              id="nav-contact-btn"
              onClick={handleOpenGmail}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold rounded-md text-[#37352f] bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] hover:border-red-300 transition-colors cursor-pointer group shadow-2xs"
              title="Gmail로 바로 문의하기 (pompeii928@gmail.com)"
            >
              <Mail className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
              <span>{t('nav.contact', 'CONTACT')}</span>
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
            const label = t(cat.key, cat.fallback);
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
              const label = t(item.key, item.fallback);
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

            {/* Mobile Language Selector */}
            <div className="pt-3 mt-2 border-t border-[#e3e2de]">
              <div className="text-[11px] font-mono text-[#787774] uppercase mb-1.5">
                Language
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
                      className={`px-2 py-1.5 rounded text-xs flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#37352f] text-white border-[#37352f] font-semibold'
                          : 'bg-[#f7f6f3] text-[#5a5854] border-[#e3e2de] hover:bg-[#efefed]'
                      }`}
                    >
                      <span>{item.flag}</span>
                      <span>{item.code.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-[#e3e2de] flex items-center justify-between text-xs text-[#787774]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenGmail();
                }}
                className="flex items-center gap-1.5 hover:text-[#37352f] cursor-pointer"
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
