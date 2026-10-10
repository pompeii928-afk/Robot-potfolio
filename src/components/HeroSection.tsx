import React, { useState } from 'react';
import { Flag, Edit3, Sparkles, BookOpen, Compass, Terminal, Lightbulb, Target, Box, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { AboutConfig } from '../types';
import { useLanguage } from '../context/ThemeContext';
import { getLocalizedAbout } from '../utils/translationHelper';
import { Hero3DLogo } from './Hero3DLogo';

interface HeroSectionProps {
  aboutData: AboutConfig;
  isAdmin?: boolean;
  onEditAbout?: () => void;
  onExploreProjects?: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  aboutData,
  isAdmin = false,
  onEditAbout,
  onExploreProjects,
  onNavigate,
}) => {
  const { lang, t } = useLanguage();
  const [imageZoomed, setImageZoomed] = useState(false);
  const [heroMediaMode, setHeroMediaMode] = useState<'3d' | 'photo'>('3d');

  const localizedAbout = getLocalizedAbout(aboutData, lang);

  const displayQuote = localizedAbout.quote;
  const displayBio = localizedAbout.bio;
  const displaySubBio = localizedAbout.subBio;
  const displayGoal = localizedAbout.goal;

  return (
    <section id="about" className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 scroll-mt-20 flex-1 flex flex-col justify-start overflow-hidden">
      {/* Subtle soft ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,0,0,0.02),transparent)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-start">
        {/* Alche Studio Section Index Kicker */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-zinc-600 tracking-widest uppercase font-semibold">
            01 // MISSION &amp; PHILOSOPHY
          </span>
          <span className="h-px flex-1 bg-zinc-200 max-w-[120px]" />
          <span className="font-mono text-[11px] text-zinc-400 tracking-widest hidden sm:inline">
            [ ARCHITECTING AUTONOMOUS WORLDS ]
          </span>
        </div>

        {/* Main Grid: Editorial & System Media Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Alche High-Concept Editorial Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Title Block with Admin Edit Button */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-xs tracking-wider text-zinc-500 uppercase mb-2">
                  // K.F.C. CODE CHASER ROBOTICS LAB
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-black text-zinc-900 tracking-[-0.035em] leading-[1.06]">
                  {aboutData.title || 'K.F.C. CODE CHASER'}
                </h1>
                <p className="mt-3 text-sm sm:text-lg font-mono text-zinc-600 tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
                  <span>{aboutData.subtitle || 'Autonomous Robotics & Precision Systems Engineering'}</span>
                </p>
              </div>

              {isAdmin && onEditAbout && (
                <button
                  onClick={onEditAbout}
                  id="edit-about-btn"
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 bg-black text-white hover:bg-zinc-800 transition-all cursor-pointer shrink-0 mt-1 shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Vision Statement: Core Philosophy */}
            <div className="p-6 sm:p-7 rounded-2xl bg-zinc-50/90 backdrop-blur-xl border border-zinc-200 hover:border-zinc-300 flex gap-4 sm:gap-5 items-start shadow-xs transition-all duration-300 group">
              <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-200 text-zinc-800 shadow-2xs shrink-0 select-none group-hover:scale-105 transition-transform mt-0.5">
                <Lightbulb className="w-4 h-4 text-zinc-800 stroke-[2.2]" />
              </span>
              <div className="space-y-1.5 min-w-0">
                <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
                  // VISION &amp; CORE PHILOSOPHY
                </div>
                <p className="text-base sm:text-xl font-sans font-bold text-zinc-900 leading-relaxed tracking-tight">
                  "{displayQuote}"
                </p>
              </div>
            </div>

            {/* Editorial Bio Text */}
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700 font-sans">
              <p className="whitespace-pre-line text-zinc-900 font-medium text-base sm:text-lg">
                {displayBio}
              </p>
              {displaySubBio && (
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line font-mono bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  {displaySubBio}
                </p>
              )}
            </div>

            {/* Target / Goal Banner */}
            <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-4 shadow-2xs">
              <span className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 shadow-2xs shrink-0 select-none">
                <Target className="w-4 h-4 text-rose-600 stroke-[2.2]" />
              </span>
              <div className="text-xs sm:text-sm text-zinc-800 font-mono">
                <strong className="font-bold text-rose-600 mr-2 uppercase tracking-wider">
                  [ TARGET GOAL ] :
                </strong>
                <span>{displayGoal}</span>
              </div>
            </div>

            {/* Quick Exploration CTA */}
            {onExploreProjects && (
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={onExploreProjects}
                  className="px-5 py-2.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 bg-black text-white hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
                >
                  <span>EXPLORE ROBOT SYSTEMS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Active System Photo & Specification Viewport */}
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-3xl border border-zinc-200 bg-white p-3.5 shadow-sm">
              <div className="flex items-center justify-between pb-3 px-1 border-b border-zinc-100 mb-3">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-zinc-800">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>ACTIVE SYSTEM VIEWPORT</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:inline">
                  [ SPECIFICATION ]
                </span>
              </div>

              {/* Viewport Display Container */}
              <div
                onClick={() => setImageZoomed(!imageZoomed)}
                data-cursor="view"
                data-cursor-label="ZOOM ±"
                className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center cursor-pointer group"
                title={lang === 'ko' ? '클릭하여 이미지 확대/축소' : 'Click to toggle zoom'}
              >
                <img
                  src={aboutData.heroImage || '/src/assets/images/hero_robot_arm_1786764552106.jpg'}
                  alt="Robotic System"
                  className={`w-full h-full object-cover object-center rounded-2xl transition-all duration-500 ease-out ${
                    imageZoomed ? 'scale-105' : 'group-hover:scale-103'
                  }`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 font-mono text-[11px] text-white bg-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/20">
                  ( FIG. 01 — ACTIVE SYSTEM )
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
