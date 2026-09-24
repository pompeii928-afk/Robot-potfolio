import React, { useState } from 'react';
import { Flag, Edit3, Sparkles, BookOpen, Compass, Terminal } from 'lucide-react';
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
    <section id="about" className="relative pt-6 pb-12 sm:pt-8 sm:pb-14 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Document & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Notion Page Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title Block with Admin Edit Button */}
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-sans font-bold text-[#37352f] tracking-tight leading-tight">
                {aboutData.title || 'MY ROBOT'} {aboutData.subtitle || 'PORTFOLIO'}
              </h1>

              {isAdmin && onEditAbout && (
                <button
                  onClick={onEditAbout}
                  id="edit-about-btn"
                  className="px-3 py-1.5 rounded-md text-xs font-sans font-medium flex items-center gap-1.5 bg-[#f7f6f3] hover:bg-[#efefed] text-[#37352f] border border-[#e3e2de] transition-colors cursor-pointer shrink-0 mt-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#787774]" />
                  <span>{t('hero.editAbout', '소개 수정')}</span>
                </button>
              )}
            </div>

            {/* Notion Callout: Quote */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#f7f6f3] border border-[#e3e2de] flex gap-3.5 items-start">
              <span className="text-xl shrink-0 select-none">💡</span>
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-[#787774] font-bold">
                  {t('hero.corePhilosophy', 'CORE PHILOSOPHY')}
                </div>
                <p className="text-sm sm:text-base font-sans font-medium text-[#37352f] leading-relaxed italic">
                  {displayQuote}
                </p>
              </div>
            </div>

            {/* Notion Document Text: Bio */}
            <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-[#37352f] font-sans">
              <p className="whitespace-pre-line text-[#37352f]">
                {displayBio}
              </p>
              {displaySubBio && (
                <p className="text-sm text-[#787774] leading-relaxed whitespace-pre-line">
                  {displaySubBio}
                </p>
              )}
            </div>

            {/* Notion Callout: Goal */}
            <div className="p-4 rounded-lg bg-[#fdfaf2] border border-[#f5e9d3] flex items-start gap-3">
              <span className="text-lg shrink-0 select-none">🎯</span>
              <div className="text-xs sm:text-sm text-[#37352f]">
                <strong className="font-semibold text-[#8f5b1d] mr-1.5">
                  {t('hero.goalLabel', '목표')}:
                </strong>
                <span>{displayGoal}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Media Frame with Soft Rounded Corners */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#e3e2de] bg-white p-2.5 sm:p-3 shadow-md shadow-zinc-200/50 hover:shadow-lg transition-shadow duration-300">
              {/* Image Frame with Rounded Borders */}
              <div
                onClick={() => setImageZoomed(!imageZoomed)}
                className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-[#f7f6f3] border border-[#e3e2de]/70 flex items-center justify-center cursor-pointer group"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
