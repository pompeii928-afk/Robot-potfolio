import React, { useState, useEffect } from 'react';
import { RobotLogo } from './RobotLogo';
import { Menu, X, Mail, Sun, Moon, Globe } from 'lucide-react';
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
    { id: 'about', label: t('nav.about') },
    { id: 'journey', label: t('nav.journey') },
    { id: 'awards', label: t('nav.awards') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'experience', label: t('nav.experience') },
  ];

  const handleLinkClick = (id: string) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      setTimeout(() => {
        onNavigate(id);
      }, 100);
    } else {
      onNavigate(id);
    }
  };

  return (
    <div
      id="navbar-header"
      className={`w-full transition-all duration-300 ${
        isScrolled
          ? theme === 'light'
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
            : 'bg-[#060a15]/95 backdrop-blur-md border-b border-cyan-500/20 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : theme === 'light'
            ? 'bg-white/90 backdrop-blur-md py-3 sm:py-3.5 border-b border-slate-200'
            : 'bg-[#070b13]/90 backdrop-blur-md py-3 sm:py-3.5 border-b border-cyan-500/15'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => handleLinkClick('about')}
          className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.02] cursor-pointer"
        >
          <RobotLogo size={34} />
          <div className="flex flex-col">
            <span
              className={`font-display font-bold text-lg sm:text-xl tracking-wide ${
                theme === 'light' ? 'text-sky-700' : 'text-cyan-400 text-glow-cyan'
              }`}
            >
              K.F.C.Code Chaser
            </span>
            <span
              className={`text-[11px] font-mono tracking-tight -mt-0.5 hidden sm:block ${
                theme === 'light' ? 'text-slate-500' : 'text-cyan-200/60'
              }`}
            >
              {t('nav.subtitle')}
            </span>
          </div>
        </button>

        {/* Desktop Nav Items + Theme & Lang Controls */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <nav id="desktop-nav" className="flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative px-3.5 py-1.5 text-sm font-medium transition-all rounded-md cursor-pointer ${
                    isActive
                      ? theme === 'light'
                        ? 'text-sky-700 bg-sky-50 border border-sky-200 shadow-sm'
                        : 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 text-glow-cyan shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : theme === 'light'
                        ? 'text-slate-600 hover:text-sky-600 hover:bg-slate-100'
                        : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full ${
                        theme === 'light'
                          ? 'bg-sky-600 shadow-[0_0_6px_#0284c7]'
                          : 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="h-5 w-px bg-slate-700/40 dark:bg-slate-700/60 mx-1" />

          {/* Theme Switcher Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className={`p-2 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-sm'
                : 'bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-sky-600" />
            )}
            <span className="text-[11px] font-semibold">
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </span>
          </button>

          {/* Language Switcher Toggle */}
          <button
            id="lang-toggle-btn"
            onClick={toggleLanguage}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-sm'
                : 'bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
            title="Switch Language (한국어 / English)"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
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
            <Mail className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span>{t('nav.contact')}</span>
          </button>
        </div>

        {/* Mobile Menu & Quick Toggles */}
        <div className="flex items-center gap-2 md:hidden">
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
            className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
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
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className={`md:hidden px-4 pt-3 pb-5 backdrop-blur-xl border-b shadow-2xl animate-in slide-in-from-top duration-200 ${
            theme === 'light'
              ? 'bg-white/98 border-slate-200'
              : 'bg-[#080e1d]/98 border-cyan-500/20'
          }`}
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between cursor-pointer ${
                    isActive
                      ? theme === 'light'
                        ? 'text-sky-700 bg-sky-50 border border-sky-300'
                        : 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 text-glow-cyan'
                      : theme === 'light'
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-sky-700'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-cyan-300'
                  }`}
                >
                  <span>{item.label}</span>
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
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-medium ${
                  theme === 'light'
                    ? 'bg-slate-100 text-slate-800 border border-slate-300'
                    : 'bg-slate-900 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
                <span>{theme === 'dark' ? t('common.themeLight') : t('common.themeDark')}</span>
              </button>

              <button
                onClick={toggleLanguage}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-medium ${
                  theme === 'light'
                    ? 'bg-slate-100 text-slate-800 border border-slate-300'
                    : 'bg-slate-900 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ko' ? 'Switch to English' : '한국어로 전환'}</span>
              </button>
            </div>
            
            <a
              href="mailto:pompeii928@gmail.com"
              className={`mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-mono font-medium ${
                theme === 'light'
                  ? 'text-sky-700 bg-sky-50 border border-sky-300'
                  : 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/40'
              }`}
            >
              <Mail className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span>pompeii928@gmail.com</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
