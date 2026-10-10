import React, { useState } from 'react';
import { Mail, Check, Copy, Youtube, ExternalLink } from 'lucide-react';
import { RobotLogo } from './RobotLogo';
import { useLanguage } from '../context/ThemeContext';
import { DEFAULT_CHANNEL_INFO } from '../data/portfolioData';
import { openGmailCompose, OWNER_EMAIL } from '../utils/contactHelper';

interface FooterProps {
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = () => {
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
      className="relative mt-auto shrink-0 w-full border-t border-[#e2e0da] dark:border-white/10 pt-16 pb-12 bg-[#f4f2ee] dark:bg-[#0a0b0e] text-[#0a0a0a] dark:text-[#f4f2ee]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stokt Large Editorial Footer Callout */}
        <div className="pb-12 border-b border-[#e2e0da] dark:border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#6e6d6a] dark:text-[#a3a29e]">
              ( GET IN TOUCH · COLLABORATION &amp; INQUIRIES )
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-black tracking-[-0.035em] text-[#0a0a0a] dark:text-[#f4f2ee] mt-3 leading-[1.05]">
              Let's engineer something extraordinary.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Direct Gmail compose button */}
            <button
              onClick={() => openGmailCompose(lang)}
              className="px-5 py-2.5 rounded-full text-xs font-mono font-medium flex items-center gap-2 bg-[#0a0a0a] text-white hover:bg-black dark:bg-[#f4f2ee] dark:text-[#0a0a0a] transition-all cursor-pointer shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact via Gmail ↗</span>
            </button>

            {/* Email Copy Button */}
            <button
              onClick={copyEmail}
              className="px-4 py-2.5 rounded-full text-xs font-mono border border-[#e2e0da] dark:border-white/15 bg-white dark:bg-[#121318] hover:bg-[#eae8e2] text-[#0a0a0a] dark:text-[#f4f2ee] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#6e6d6a]" />
                  <span>{OWNER_EMAIL}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Metadata Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[#6e6d6a] dark:text-[#a3a29e]">
          <div className="flex items-center gap-3">
            <RobotLogo size={18} />
            <span>K.F.C. CODE CHASER — JIHOON BAE</span>
            <span>·</span>
            <span>DAEJEON, KR</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={DEFAULT_CHANNEL_INFO.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0a0a0a] dark:hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>YouTube @Wrocospace</span>
            </a>
            <span>© 2026 ARCHIVES</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
