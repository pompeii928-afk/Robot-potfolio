import React from 'react';
import { Flag, Edit3 } from 'lucide-react';
import { AboutConfig } from '../types';
import { useTheme, useLanguage } from '../context/ThemeContext';

interface HeroSectionProps {
  aboutData: AboutConfig;
  isAdmin?: boolean;
  onEditAbout?: () => void;
  onExploreProjects?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  aboutData,
  isAdmin = false,
  onEditAbout,
}) => {
  const { theme } = useTheme();
  const { lang, t } = useLanguage();

  // Smart English fallback for default text
  const isDefaultBio = aboutData.bio?.includes('여러 로봇 대회에 참가하며');
  const isDefaultQuote = aboutData.quote?.includes('결과 뿐만 아니라');
  const isDefaultGoal = aboutData.goal?.includes('로봇을 직접 창작할 수 있도록');

  const displayQuote =
    lang === 'en' && isDefaultQuote
      ? '"Demonstrating not only the final outcomes, but also the growth, trials, and iterative breakthroughs throughout the journey."'
      : aboutData.quote;

  const displayBio =
    lang === 'en' && isDefaultBio
      ? 'Accumulating extensive engineering expertise and coding knowledge through active participation in competitive robotics olympiads. Conducting in-depth mechanical and algorithmic research to design, build, and deploy custom autonomous robots.'
      : aboutData.bio;

  const displaySubBio =
    lang === 'en' && aboutData.subBio?.includes('로봇 공학에 열정을 품고')
      ? 'An ambitious robotics enthusiast architecting autonomous systems, precision motor controls, and intelligent navigation algorithms for next-generation platforms.'
      : aboutData.subBio;

  const displayGoal =
    lang === 'en' && isDefaultGoal
      ? 'Gaining deep engineering experience to independently design and deploy autonomous robotic innovations'
      : aboutData.goal;

  return (
    <section id="about" className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      {/* Background ambient lighting effects */}
      <div
        className={`absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          theme === 'light' ? 'bg-sky-400/15' : 'bg-cyan-500/10'
        }`}
      />
      <div
        className={`absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          theme === 'light' ? 'bg-indigo-400/10' : 'bg-purple-600/10'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bio & Intro */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            {/* Top Admin Toolbar */}
            {isAdmin && onEditAbout && (
              <div className="flex items-center justify-end">
                <button
                  onClick={onEditAbout}
                  id="edit-about-btn"
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white hover:bg-slate-50 border border-sky-300 text-sky-700 shadow-sm'
                      : 'bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t('hero.editAbout')}</span>
                </button>
              </div>
            )}

            {/* Main Title */}
            <div>
              <h1
                className={`font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              >
                {aboutData.title || 'MY ROBOT'}
              </h1>
              <h1
                className={`font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600'
                    : 'bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                }`}
              >
                {aboutData.subtitle || 'PORTFOLIO'}
              </h1>
            </div>

            {/* Quote & Description Card */}
            <div
              className={`p-6 sm:p-7 rounded-xl backdrop-blur-md relative overflow-hidden transition-all ${
                theme === 'light'
                  ? 'bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:border-sky-300'
                  : 'bg-[#0a1224]/80 border border-cyan-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-cyan-500/40'
              }`}
            >
              {/* Corner accent markers */}
              <div
                className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${
                  theme === 'light' ? 'border-sky-500' : 'border-cyan-400'
                }`}
              />
              <div
                className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${
                  theme === 'light' ? 'border-sky-500' : 'border-cyan-400'
                }`}
              />
              <div
                className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${
                  theme === 'light' ? 'border-sky-500' : 'border-cyan-400'
                }`}
              />
              <div
                className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${
                  theme === 'light' ? 'border-sky-500' : 'border-cyan-400'
                }`}
              />

              {/* Quote */}
              <blockquote
                className={`text-base sm:text-lg font-medium leading-relaxed mb-4 pl-3 italic border-l-2 ${
                  theme === 'light'
                    ? 'text-sky-900 border-sky-500 bg-sky-50/50 py-1 rounded-r'
                    : 'text-cyan-100/90 border-cyan-400/60'
                }`}
              >
                {displayQuote}
              </blockquote>

              {/* Bio Paragraphs */}
              <p
                className={`text-sm sm:text-base leading-relaxed mb-3 whitespace-pre-line ${
                  theme === 'light' ? 'text-slate-700 font-normal' : 'text-slate-300'
                }`}
              >
                {displayBio}
              </p>

              {displaySubBio && (
                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-5 whitespace-pre-line ${
                    theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {displaySubBio}
                </p>
              )}

              {/* Goal Box */}
              <div
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium ${
                  theme === 'light'
                    ? 'bg-sky-50 border border-sky-200 text-sky-800'
                    : 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-300'
                }`}
              >
                <Flag className={`w-4 h-4 shrink-0 ${theme === 'light' ? 'text-sky-600' : 'text-cyan-400'}`} />
                <span>
                  <strong className={theme === 'light' ? 'text-sky-950' : 'text-cyan-200'}>
                    {t('hero.goalLabel')}:
                  </strong>{' '}
                  {displayGoal}
                </span>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div
                className={`p-2.5 rounded-lg flex flex-col ${
                  theme === 'light'
                    ? 'bg-white border border-slate-200 shadow-sm'
                    : 'bg-[#081020]/60 border border-slate-800'
                }`}
              >
                <span className={theme === 'light' ? 'text-slate-500 text-[10px]' : 'text-slate-500 text-[10px]'}>
                  {t('hero.focusLabel')}
                </span>
                <span
                  className={`font-semibold ${
                    theme === 'light' ? 'text-sky-700' : 'text-cyan-400'
                  }`}
                >
                  {aboutData.currentFocus || 'WRO 2026'}
                </span>
              </div>
              <div
                className={`p-2.5 rounded-lg flex flex-col ${
                  theme === 'light'
                    ? 'bg-white border border-slate-200 shadow-sm'
                    : 'bg-[#081020]/60 border border-slate-800'
                }`}
              >
                <span className={theme === 'light' ? 'text-slate-500 text-[10px]' : 'text-slate-500 text-[10px]'}>
                  {t('hero.domainLabel')}
                </span>
                <span
                  className={`font-semibold ${
                    theme === 'light' ? 'text-slate-800' : 'text-slate-200'
                  }`}
                >
                  {aboutData.coreDomain || 'Robotics & AI'}
                </span>
              </div>
              <div
                className={`p-2.5 rounded-lg flex flex-col ${
                  theme === 'light'
                    ? 'bg-white border border-slate-200 shadow-sm'
                    : 'bg-[#081020]/60 border border-slate-800'
                }`}
              >
                <span className={theme === 'light' ? 'text-slate-500 text-[10px]' : 'text-slate-500 text-[10px]'}>
                  {t('hero.roleLabel')}
                </span>
                <span
                  className={`font-semibold ${
                    theme === 'light' ? 'text-purple-700' : 'text-purple-400'
                  }`}
                >
                  {aboutData.teamRole || 'Lead & Dev'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Robot System Image Frame */}
          <div className="lg:col-span-6">
            <div
              className={`relative rounded-2xl overflow-hidden group transition-all ${
                theme === 'light'
                  ? 'bg-white border border-sky-300 shadow-[0_10px_35px_rgba(2,132,199,0.15)]'
                  : 'bg-[#081022] border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.25)]'
              }`}
            >
              {/* Window Titlebar */}
              <div
                className={`px-4 py-3 border-b flex items-center justify-between ${
                  theme === 'light'
                    ? 'bg-slate-100/90 border-slate-200 text-slate-700'
                    : 'bg-[#060c1a] border-cyan-500/20 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      theme === 'light' ? 'bg-sky-500 shadow-[0_0_6px_#0284c7]' : 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
                    }`}
                  />
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      theme === 'light' ? 'bg-purple-500 shadow-[0_0_6px_#a855f7]' : 'bg-purple-400 shadow-[0_0_8px_#c084fc]'
                    }`}
                  />
                  <span className="text-xs font-mono font-semibold ml-2">ROBOT_SYS_VIEWER</span>
                </div>
                <div
                  className={`text-[11px] font-mono flex items-center gap-1.5 ${
                    theme === 'light' ? 'text-sky-700 font-semibold' : 'text-cyan-400/80'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      theme === 'light' ? 'bg-sky-600' : 'bg-cyan-400'
                    }`}
                  />
                  <span>{t('nav.online')}</span>
                </div>
              </div>

              {/* Main Visual Image Area */}
              <div
                className={`relative aspect-square sm:aspect-[4/3] w-full overflow-hidden ${
                  theme === 'light' ? 'bg-slate-100' : 'bg-slate-950'
                }`}
              >
                <img
                  src={aboutData.heroImage || '/src/assets/images/hero_robot_arm_1786764552106.jpg'}
                  alt="Robotic System"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle bottom gradient to blend frame */}
                <div
                  className={`absolute inset-0 pointer-events-none ${
                    theme === 'light'
                      ? 'bg-gradient-to-t from-slate-900/30 via-transparent to-transparent'
                      : 'bg-gradient-to-t from-[#060c1a]/60 via-transparent to-transparent'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
