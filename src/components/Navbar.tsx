import React, { useState, useEffect } from 'react';
import { RobotLogo } from './RobotLogo';
import { Menu, X, Mail, Sun, Moon, Globe, LayoutGrid, Bot, TrendingUp, Trophy, Cpu, FolderGit2, Youtube } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme, useLanguage } from '../context/ThemeContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenTerminal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'all', label: lang === 'en' ? 'Overview' : '전체 보기', icon: LayoutGrid },
    { id: 'about', label: t('nav.about'), icon: Bot },
    { id: 'journey', label: t('nav.journey'), icon: TrendingUp },
    { id: 'awards', label: t('nav.awards'), icon: Trophy },
    { id: 'skills', label: t('nav.skills'), icon: Cpu },
    { id: 'experience', label: t('nav.experience'), icon: FolderGit2 },
    { id: 'youtube', label: t('nav.youtube', 'YouTube'), icon: Youtube },
  ];


  const handleLinkClick = (id: string) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    onNavigate(id);
  };

  return (
    <div
      id="navbar-header"
      className={`w-full transition-all duration-300 ${
        isScrolled
          ? theme === 'light'
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
            : 'bg-[#060a15]/95 backdrop-blur-md border-b border-cyan-500/20 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : theme === 'light'
            ? 'bg-white/90 backdrop-blur-md py-2.5 sm:py-3 border-b border-slate-200/80'
            : 'bg-[#070b13]/90 backdrop-blur-md py-2.5 sm:py-3 border-b border-cyan-500/15'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => handleLinkClick('all')}
          className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.02] cursor-pointer"
        >
          <RobotLogo size={36} />
          <div className="flex flex-col">
            <span
              className={`font-display font-extrabold text-lg sm:text-xl tracking-tight ${
                theme === 'light' ? 'text-slate-900' : 'text-cyan-400 text-glow-cyan'
              }`}
            >
              K.F.C.Code Chaser
            </span>
            <span
              className={`text-[11px] font-mono tracking-tight -mt-0.5 hidden sm:block ${
                theme === 'light' ? 'text-slate-500 font-medium' : 'text-cyan-200/60'
              }`}
            >
              {t('nav.subtitle')}
            </span>
          </div>
        </button>

        {/* Desktop Nav Items + Theme & Lang Controls */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-2">
          <nav id="desktop-nav" className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative px-3 py-1.5 text-xs xl:text-sm font-tech font-semibold transition-all rounded-lg cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? theme === 'light'
                        ? 'text-sky-950 font-bold'
                        : 'text-white font-bold'
                      : theme === 'light'
                        ? 'text-slate-600 hover:text-sky-700 hover:bg-white/60'
                        : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbarGlidingIndicator"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      className={`absolute inset-0 rounded-lg ${
                        theme === 'light'
                          ? 'bg-white shadow-[0_2px_8px_rgba(2,132,199,0.15)] border border-sky-200 text-sky-900'
                          : 'bg-cyan-950 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      }`}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? (theme === 'light' ? 'text-sky-600' : 'text-cyan-400') : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-800 mx-1" />

          {/* Theme Switcher Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm'
                : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-sky-600" />
            )}
            <span className="text-[11px] font-bold">
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </span>
          </button>

          {/* Language Switcher Toggle */}
          <button
            id="lang-toggle-btn"
            onClick={toggleLanguage}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm'
                : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
            title="Switch Language (한국어 / English)"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
            <span className="font-bold tracking-wider">
              {lang === 'ko' ? 'EN' : '한국어'}
            </span>
          </button>

          {/* Contact Button */}
          <button
            id="nav-contact-btn"
            onClick={() => {
              const el = document.getElementById('contact-footer');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
              theme === 'light'
                ? 'text-sky-700 bg-sky-50 border border-sky-300 hover:bg-sky-100 shadow-sm'
                : 'text-cyan-300 bg-cyan-950/60 border border-cyan-400/40 hover:bg-cyan-900/60 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            }`}
            title="Contact & Info"
          >
            <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
            <span>{t('nav.contact')}</span>
          </button>
        </div>

        {/* Medium and Small Screens Header controls */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Quick Theme Toggle on Mobile Header */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 text-slate-700 border border-slate-300'
                : 'bg-slate-900/80 text-cyan-300 border border-cyan-500/30'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-sky-600" />
            )}
          </button>

          {/* Quick Lang Toggle on Mobile Header */}
          <button
            onClick={toggleLanguage}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 text-slate-700 border border-slate-300'
                : 'bg-slate-900/80 text-cyan-300 border border-cyan-500/30'
            }`}
            aria-label="Toggle language"
          >
            {lang === 'ko' ? 'EN' : 'KO'}
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 border border-slate-300 text-slate-800'
                : 'bg-slate-900/80 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-950'
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className={`lg:hidden px-4 pt-3 pb-5 backdrop-blur-xl border-b shadow-2xl animate-in slide-in-from-top duration-200 ${
            theme === 'light'
              ? 'bg-white/98 border-slate-200'
              : 'bg-[#080e1d]/98 border-cyan-500/20'
          }`}
        >
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-tech font-semibold flex items-center justify-between cursor-pointer transition-all ${
                    isActive
                      ? theme === 'light'
                        ? 'text-sky-900 bg-sky-50 border border-sky-300 shadow-sm font-bold'
                        : 'text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 text-glow-cyan'
                      : theme === 'light'
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-sky-700'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-cyan-300'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                    <span>{item.label}</span>
                  </span>
                  {isActive && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        theme === 'light'
                          ? 'bg-sky-600 shadow-[0_0_8px_#0284c7]'
                          : 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
                      }`}
                    />
                  )}
                </button>
              );
            })}

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono font-medium ${
                  theme === 'light'
                    ? 'bg-slate-100 text-slate-800 border border-slate-300'
                    : 'bg-slate-900 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-600" />}
                <span>{theme === 'dark' ? t('common.themeLight') : t('common.themeDark')}</span>
              </button>

              <button
                onClick={toggleLanguage}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono font-medium ${
                  theme === 'light'
                    ? 'bg-slate-100 text-slate-800 border border-slate-300'
                    : 'bg-slate-900 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                <span>{lang === 'ko' ? 'English' : '한국어'}</span>
              </button>
            </div>
            
            <a
              href="mailto:pompeii928@gmail.com"
              className={`mt-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-medium ${
                theme === 'light'
                  ? 'text-sky-700 bg-sky-50 border border-sky-300'
                  : 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/40'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
              <span>pompeii928@gmail.com</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

