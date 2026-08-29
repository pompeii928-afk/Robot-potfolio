import React, { useState } from 'react';
import { Mail, Check, Copy, Youtube, ExternalLink, Lock } from 'lucide-react';
import { RobotLogo } from './RobotLogo';
import { useLanguage } from '../context/ThemeContext';
import { DEFAULT_CHANNEL_INFO } from '../data/portfolioData';

interface FooterProps {
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, isAdmin }) => {
  const { lang } = useLanguage();
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
      className="relative border-t border-[#e3e2de] py-8 bg-[#f7f6f3] text-[#37352f]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Brand info */}
          <div className="flex items-center gap-2.5">
            <RobotLogo size={20} />
            <div className="flex flex-col">
              <span className="font-sans font-bold text-xs text-[#37352f]">
                K.F.C.Code Chaser
              </span>
              <span className="text-[11px] text-[#787774] font-mono">
                © 2026 Jihoon Bae • Robotics Engineering Portfolio
              </span>
            </div>
          </div>

          {/* Right Links, Admin & Email */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Admin Portal Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-sans bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#787774] hover:text-[#37352f] transition-colors cursor-pointer"
                title="Admin Control"
              >
                <Lock className="w-3.5 h-3.5 text-[#787774]" />
                <span>{isAdmin ? (lang === 'en' ? 'Admin Active' : '관리자 모드') : (lang === 'en' ? 'Admin Login' : '관리자 로그인')}</span>
              </button>
            )}

            {/* YouTube Link */}
            <a
              href={DEFAULT_CHANNEL_INFO.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-sans bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] transition-colors"
            >
              <Youtube className="w-3.5 h-3.5 text-red-600" />
              <span>@Wrocospace</span>
              <ExternalLink className="w-3 h-3 text-[#787774]" />
            </a>

            {/* Email pill */}
            <button
              onClick={copyEmail}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-sans bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] transition-colors cursor-pointer"
              title="Click to copy email address"
            >
              <Mail className="w-3.5 h-3.5 text-[#787774]" />
              <span>{email}</span>
              {copied ? (
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 ml-1">
                  <Check className="w-3 h-3" /> {lang === 'en' ? 'Copied' : '복사됨'}
                </span>
              ) : (
                <Copy className="w-3 h-3 text-[#9b9a97] ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
