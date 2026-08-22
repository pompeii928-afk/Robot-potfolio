import React, { useState } from 'react';
import { Mail, Check, Copy } from 'lucide-react';
import { RobotLogo } from './RobotLogo';
import { useTheme, useLanguage } from '../context/ThemeContext';

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const email = 'pompeii928@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact-footer"
      className={`relative mt-20 border-t py-12 font-sans transition-colors ${
        theme === 'light'
          ? 'bg-slate-100/80 border-slate-200 text-slate-600'
          : 'bg-[#040813] border-cyan-500/20 text-slate-400'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Brand info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
            <div className="flex items-center gap-2.5">
              <RobotLogo size={24} />
              <span
                className={`font-display font-bold text-base tracking-wide ${
                  theme === 'light' ? 'text-slate-900' : 'text-white text-glow-cyan'
                }`}
              >
                K.F.C.Code Chaser
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              © 2026 Jihoon Bae | Robotics Engineering Portfolio
            </p>
          </div>

          {/* Right Links & Email */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            {/* Email pill */}
            <button
              onClick={copyEmail}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer group ${
                theme === 'light'
                  ? 'bg-white border border-slate-300 text-sky-800 hover:border-sky-400 hover:bg-sky-50 shadow-sm'
                  : 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400'
              }`}
              title="Click to copy email address"
            >
              <Mail className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-sky-600' : 'text-cyan-400'}`} />
              <span>{email}</span>
              {copied ? (
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 ml-1">
                  <Check className="w-3 h-3" /> {lang === 'en' ? 'Copied!' : '복사됨!'}
                </span>
              ) : (
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-cyan-300 ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
