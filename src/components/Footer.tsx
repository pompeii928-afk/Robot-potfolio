import React, { useState } from 'react';
import { Mail, Check, Copy, ExternalLink } from 'lucide-react';
import { RobotLogo } from './RobotLogo';

export const Footer: React.FC = () => {
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
      className="relative mt-20 border-t border-cyan-500/20 bg-[#040813] py-12 text-slate-400 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Brand info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
            <div className="flex items-center gap-2.5">
              <RobotLogo size={24} />
              <span className="font-display font-bold text-white text-base tracking-wide text-glow-cyan">
                K.F.C.Code Chaser
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              © 2026 Jihoon Bae | Robotics Engineering Portfolio
            </p>
          </div>

          {/* Right Links & Email */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <div className="flex items-center gap-5 text-xs font-mono">
              <button
                onClick={copyEmail}
                className="hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Contact</span>
              </button>
              <span className="text-slate-700">•</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Email pill */}
            <button
              onClick={copyEmail}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 transition-all cursor-pointer group"
              title="Click to copy email address"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>{email}</span>
              {copied ? (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 ml-1">
                  <Check className="w-3 h-3" /> 복사됨!
                </span>
              ) : (
                <Copy className="w-3 h-3 text-slate-500 group-hover:text-cyan-300 ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
