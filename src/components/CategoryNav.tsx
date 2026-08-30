import React, { useRef, useEffect } from 'react';
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
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  const safeCounts: CategoryCounts = counts || {};

  const categories = [
    {
      id: 'all',
      key: 'nav.overview',
      fallback: 'Overview',
      icon: LayoutGrid,
      badge: null,
    },
    {
      id: 'about',
      key: 'nav.about',
      fallback: 'About & Robot',
      icon: Bot,
      badge: 'PROT V4',
    },
    {
      id: 'journey',
      key: 'nav.journey',
      fallback: 'Journey',
      icon: TrendingUp,
      badge: safeCounts.journeys ? `${safeCounts.journeys}` : 'WRO',
    },
    {
      id: 'awards',
      key: 'nav.awards',
      fallback: 'Awards',
      icon: Trophy,
      badge: safeCounts.awards ? `${safeCounts.awards}` : 'Wins',
    },
    {
      id: 'skills',
      key: 'nav.skills',
      fallback: 'Skills',
      icon: Cpu,
      badge: safeCounts.skills ? `${safeCounts.skills}` : 'Matrix',
    },
    {
      id: 'experience',
      key: 'nav.experience',
      fallback: 'Projects',
      icon: FolderGit2,
      badge: safeCounts.projects ? `${safeCounts.projects}` : 'Robots',
    },
    {
      id: 'youtube',
      key: 'nav.youtube',
      fallback: 'YouTube',
      icon: Youtube,
      badge: '@Wrocospace',
    },
  ];

  // Auto-scroll category bar so the selected/active button is smoothly visible in view
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      // Calculate target scroll position to center the active category tab
      const scrollOffset =
        tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollOffset),
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-[61px] sm:top-[69px] z-40 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 my-1">
      <div
        className={`p-1.5 rounded-full border transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white/95 border-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-md'
            : 'bg-[#0a0f1d]/95 border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.5)] backdrop-blur-md'
        }`}
      >
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            const label = t(cat.key, cat.fallback);
            const isYouTube = cat.id === 'youtube';

            return (
              <button
                key={cat.id}
                ref={isActive ? (el) => { activeTabRef.current = el; } : null}
                id={`cat-tab-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative group shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-tech font-bold uppercase tracking-tight transition-all duration-150 cursor-pointer select-none ${
                  isActive
                    ? theme === 'light'
                      ? 'text-white'
                      : 'text-white'
                    : theme === 'light'
                      ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active Indicator Background with smooth spring transition */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                    className={`absolute inset-0 rounded-full ${
                      isYouTube
                        ? 'bg-red-600 shadow-[0_2px_12px_rgba(220,38,38,0.35)]'
                        : theme === 'light'
                          ? 'bg-zinc-950 shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
                          : 'bg-gradient-to-r from-cyan-950 to-zinc-900 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    }`}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${
                      isActive
                        ? isYouTube || theme === 'light'
                          ? 'text-white'
                          : 'text-cyan-400'
                        : isYouTube
                          ? 'text-red-600 dark:text-red-400'
                          : theme === 'light'
                            ? 'text-zinc-500 group-hover:text-zinc-950'
                            : 'text-zinc-400 group-hover:text-white'
                    }`}
                  />
                  <span className="whitespace-nowrap font-bold">{label}</span>

                  {cat.badge && (
                    <span
                      className={`hidden md:inline-block px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight whitespace-nowrap shrink-0 transition-colors ${
                        isActive
                          ? isYouTube
                            ? 'bg-white/20 text-white'
                            : theme === 'light'
                              ? 'bg-white/20 text-zinc-100'
                              : 'bg-cyan-900/60 text-cyan-200'
                          : theme === 'light'
                            ? 'bg-zinc-100 text-zinc-600'
                            : 'bg-zinc-900 text-zinc-400'
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
