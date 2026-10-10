import React, { useState } from 'react';
import { Flag, Edit3, Sparkles, BookOpen, Compass, Terminal, Lightbulb, Target } from 'lucide-react';
import { AboutConfig } from '../types';
import { useLanguage } from '../context/ThemeContext';
import { getLocalizedAbout } from '../utils/translationHelper';

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

  const localizedAbout = getLocalizedAbout(aboutData, lang);

  const displayQuote = localizedAbout.quote;
  const displayBio = localizedAbout.bio;
  const displaySubBio = localizedAbout.subBio;
  const displayGoal = localizedAbout.goal;

  return (
    <section id="about" className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 scroll-mt-20 flex-1 flex flex-col justify-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-start">
        {/* Stokt Section Kicker */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs text-[#6e6d6a] dark:text-[#a3a29e] tracking-wider uppercase">
            ( 00 / PHILOSOPHY &amp; PROFILE )
          </span>
          <span className="h-px flex-1 bg-[#e2e0da] dark:bg-white/10 max-w-[80px]" />
        </div>

        {/* Main Grid: Document & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Editorial Page Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Title Block with Admin Edit Button */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-black text-[#0a0a0a] dark:text-[#f4f2ee] tracking-[-0.035em] leading-[1.08]">
                  {aboutData.title || 'K.F.C. CODE CHASER'}
                </h1>
                <p className="mt-2 text-base sm:text-lg font-mono text-[#6e6d6a] dark:text-[#a3a29e] tracking-tight">
                  {aboutData.subtitle || 'Autonomous Robotics & Systems Engineering'}
                </p>
              </div>

              {isAdmin && onEditAbout && (
                <button
                  onClick={onEditAbout}
                  id="edit-about-btn"
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 bg-[#0a0a0a] text-white dark:bg-[#f4f2ee] dark:text-[#0a0a0a] transition-all cursor-pointer shrink-0 mt-1 shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Stokt Quote: Philosophy */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121318] border border-[#e2e0da] dark:border-white/10 flex gap-4 items-start shadow-2xs">
              <span className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-600 shadow-2xs shrink-0 select-none transition-transform duration-200 hover:scale-105 mt-0.5">
                <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500/20 stroke-[2.2]" />
              </span>
              <div className="space-y-1.5 min-w-0">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#6e6d6a] dark:text-[#a3a29e] font-semibold">
                  ( CORE PHILOSOPHY )
                </div>
                <p className="text-base sm:text-lg font-sans font-medium text-[#0a0a0a] dark:text-[#f4f2ee] leading-relaxed italic">
                  "{displayQuote}"
                </p>
              </div>
            </div>

            {/* Editorial Bio Text */}
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#4a4946] dark:text-[#b4b3ae] font-sans">
              <p className="whitespace-pre-line text-[#0a0a0a] dark:text-[#f4f2ee] font-medium text-base sm:text-lg">
                {displayBio}
              </p>
              {displaySubBio && (
                <p className="text-sm text-[#6e6d6a] dark:text-[#a3a29e] leading-relaxed whitespace-pre-line font-mono">
                  {displaySubBio}
                </p>
              )}
            </div>

            {/* Editorial Goal Banner */}
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#121318] border border-[#e2e0da] dark:border-white/10 flex items-center gap-3.5 shadow-2xs">
              <span className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-600 shadow-2xs shrink-0 select-none transition-transform duration-200 hover:scale-105">
                <Target className="w-3.5 h-3.5 text-rose-600 stroke-[2.2]" />
              </span>
              <div className="text-xs sm:text-sm text-[#0a0a0a] dark:text-[#f4f2ee] font-mono">
                <strong className="font-semibold text-rose-600 dark:text-rose-400 mr-2 uppercase">
                  ( GOAL ) :
                </strong>
                <span>{displayGoal}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Stokt Clean Editorial Framed Media */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#e2e0da] dark:border-white/10 bg-white dark:bg-[#121318] p-3 shadow-md hover:shadow-xl transition-all duration-300">
              {/* Image Frame */}
              <div
                onClick={() => setImageZoomed(!imageZoomed)}
                data-cursor="view"
                data-cursor-label="ZOOM ±"
                className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-[#eae8e2] dark:bg-black/40 border border-[#e2e0da]/80 dark:border-white/10 flex items-center justify-center cursor-pointer group"
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
                
                {/* Technical Corner Indicator */}
                <div className="absolute bottom-3 left-3 font-mono text-[11px] text-[#0a0a0a] dark:text-white bg-white/90 dark:bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded border border-[#e2e0da] dark:border-white/20">
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
