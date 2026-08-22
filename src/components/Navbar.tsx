import React, { useState, useEffect } from 'react';
import { RobotLogo } from './RobotLogo';
import { Menu, X, Mail } from 'lucide-react';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'journey', label: 'Journey' },
    { id: 'awards', label: 'Awards' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
  ];

  const handleLinkClick = (id: string) => {
    // If mobile menu is open, close it first and smoothly scroll after drawer collapse
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
          ? 'bg-[#060a15]/95 backdrop-blur-md border-b border-cyan-500/20 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
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
            <span className="font-display font-bold text-lg sm:text-xl text-cyan-400 tracking-wide text-glow-cyan">
              K.F.C.Code Chaser
            </span>
            <span className="text-[11px] text-cyan-200/60 font-mono tracking-tight -mt-0.5 hidden sm:block">
              ROBOTICS & AUTONOMOUS SYSTEMS
            </span>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleLinkClick(item.id)}
                className={`relative px-3.5 py-1.5 text-sm font-medium transition-all rounded-md cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 text-glow-cyan shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/40'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#06b6d4]" />
                )}
              </button>
            );
          })}

          <button
            id="nav-contact-btn"
            onClick={() => {
              const el = document.getElementById('contact-footer');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="ml-3 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-400/40 rounded-lg hover:bg-cyan-900/60 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            title="Contact & Info"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>CONTACT</span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-950 transition-all cursor-pointer"
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
          className="md:hidden px-4 pt-3 pb-5 bg-[#080e1d]/98 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl animate-in slide-in-from-top duration-200"
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
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 text-glow-cyan'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-cyan-300'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />}
                </button>
              );
            })}
            
            <a
              href="mailto:pompeii928@gmail.com"
              className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-mono font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-500/40"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>pompeii928@gmail.com</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
