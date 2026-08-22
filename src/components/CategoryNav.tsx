import React from 'react';
import { LayoutGrid, Bot, TrendingUp, Trophy, Cpu, FolderGit2, Youtube } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme, useLanguage } from '../context/ThemeContext';

interface CategoryCounts {
  journeys?: number;
  awards?: number;
  skills?: number;
  projects?: number;
  videos?: number;
}

interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  counts?: CategoryCounts;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  const { theme } = useTheme();
  const { lang } = useLanguage();

  const safeCounts: CategoryCounts = counts || {};

  const categories = [
    {
      id: 'all',
      labelEn: 'Overview',
      labelKo: '전체 보기',
      icon: LayoutGrid,
      badge: null,
      descEn: 'Full portfolio overview',
      descKo: '전체 내용 한눈에 보기',
    },
    {
      id: 'about',
      labelEn: 'About & Robot',
      labelKo: '소개 & 비전',
      icon: Bot,
      badge: 'PROT V4',
      descEn: 'Bio, mission & robot system',
      descKo: '엔지니어 소개 및 핵심 목표',
    },
    {
      id: 'journey',
      labelEn: 'Competition Journey',
      labelKo: '대회 여정',
      icon: TrendingUp,
      badge: safeCounts.journeys ? `${safeCounts.journeys} Stages` : 'WRO',
      descEn: 'Milestones & lessons learned',
      descKo: '대회 단계별 분석 및 인사이트',
    },
    {
      id: 'awards',
      labelEn: 'Awards & Honors',
      labelKo: '수상 내역',
      icon: Trophy,
      badge: safeCounts.awards ? `${safeCounts.awards} Wins` : 'Top Award',
      descEn: 'Accreditations & trophies',
      descKo: '수상 트로피 및 순위 기록',
    },
    {
      id: 'skills',
      labelEn: 'Core Tech Skills',
      labelKo: '핵심 역량',
      icon: Cpu,
      badge: safeCounts.skills ? `${safeCounts.skills} Domains` : 'Hardware/SW',
      descEn: 'Hardware, ROS2 & control logic',
      descKo: '하드웨어/소프트웨어 기술 스택',
    },
    {
      id: 'experience',
      labelEn: 'Robots & Projects',
      labelKo: '로봇 시스템',
      icon: FolderGit2,
      badge: safeCounts.projects ? `${safeCounts.projects} Systems` : 'Engineering',
      descEn: 'Autonomous platforms & CAD specs',
      descKo: '자율주행 플랫폼 및 엔지니어링',
    },
    {
      id: 'youtube',
      labelEn: 'YouTube Channel',
      labelKo: '유튜브 채널',
      icon: Youtube,
      badge: '@Wrocospace',
      descEn: 'Official YouTube Channel & Match Videos',
      descKo: '공식 유튜브 채널 및 실전 주행 영상',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 my-2">
      <div
        className={`p-1.5 sm:p-2 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
          theme === 'light'
            ? 'bg-white/80 border-slate-200/90 shadow-[0_8px_25px_rgba(15,23,42,0.06)]'
            : 'bg-[#081224]/85 border-cyan-500/25 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
        }`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            const label = lang === 'en' ? cat.labelEn : cat.labelKo;
            const isYouTube = cat.id === 'youtube';

            return (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative group shrink-0 flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-tech font-semibold transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? theme === 'light'
                      ? 'text-sky-950 font-bold'
                      : 'text-white font-bold'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-sky-800 hover:bg-slate-100/80'
                      : 'text-slate-400 hover:text-cyan-200 hover:bg-cyan-950/30'
                }`}
              >
                {/* Active Indicator Background with smooth spring transition */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className={`absolute inset-0 rounded-xl border ${
                      isYouTube
                        ? 'bg-gradient-to-r from-red-600/20 to-rose-600/20 border-red-500/60 shadow-[0_0_18px_rgba(220,38,38,0.35)]'
                        : theme === 'light'
                          ? 'bg-gradient-to-r from-sky-100/90 to-blue-50/90 border-sky-300 shadow-sm'
                          : 'bg-gradient-to-r from-cyan-950/90 to-[#0c1f3d]/90 border-cyan-400/60 shadow-[0_0_18px_rgba(6,182,212,0.35)]'
                    }`}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isYouTube
                        ? 'text-red-600 dark:text-red-400'
                        : isActive
                          ? theme === 'light'
                            ? 'text-sky-600'
                            : 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]'
                          : theme === 'light'
                            ? 'text-slate-500 group-hover:text-sky-600'
                            : 'text-slate-500 group-hover:text-cyan-300'
                    }`}
                  />
                  <span>{label}</span>

                  {cat.badge && (
                    <span
                      className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono tracking-tight transition-colors ${
                        isYouTube
                          ? 'bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/40 font-bold'
                          : isActive
                            ? theme === 'light'
                              ? 'bg-sky-200/80 text-sky-900 font-bold'
                              : 'bg-cyan-900/80 text-cyan-200 border border-cyan-400/40'
                            : theme === 'light'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-slate-900/80 text-slate-400'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
