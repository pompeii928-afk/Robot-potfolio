import React, { useState } from 'react';
import {
  Cpu,
  Code2,
  Wrench,
  Radio,
  SearchCode,
  Users2,
  CircuitBoard,
  Binary,
  Crosshair,
  Eye,
  Layers,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  Zap,
} from 'lucide-react';
import { SkillItem } from '../types';
import { ConfirmModal } from './modals/ConfirmModal';
import { useLanguage } from '../context/ThemeContext';
import { getLocalizedSkill } from '../utils/translationHelper';

interface SkillsSectionProps {
  skills: SkillItem[];
  isAdmin?: boolean;
  onAddSkill?: () => void;
  onEditSkill?: (skill: SkillItem) => void;
  onDeleteSkill?: (id: string) => Promise<void>;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  isAdmin = false,
  onAddSkill,
  onEditSkill,
  onDeleteSkill,
}) => {
  const { lang, t } = useLanguage();

  const localizedSkills = skills.map((s) => getLocalizedSkill(s, lang));

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [skillToDelete, setSkillToDelete] = useState<SkillItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const renderIcon = (name: string, className: string = 'w-4 h-4') => {
    switch (name) {
      case 'Code2':
        return <Code2 className={className} />;
      case 'Wrench':
        return <Wrench className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Radio':
        return <Radio className={className} />;
      case 'CircuitBoard':
        return <CircuitBoard className={className} />;
      case 'Binary':
        return <Binary className={className} />;
      case 'Crosshair':
        return <Crosshair className={className} />;
      case 'Eye':
        return <Eye className={className} />;
      case 'SearchCode':
        return <SearchCode className={className} />;
      case 'Users2':
        return <Users2 className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  const rawCategories = Array.from(new Set(skills.map((s) => s.category)));
  const categories = ['ALL', ...rawCategories];

  const filteredSkills =
    selectedCategory === 'ALL'
      ? localizedSkills
      : localizedSkills.filter((s, idx) => {
          const raw = skills[idx] || s;
          return raw.category === selectedCategory || s.category === selectedCategory;
        });

  const handleConfirmDelete = async () => {
    if (!skillToDelete || !onDeleteSkill) return;
    setIsDeleting(true);
    try {
      await onDeleteSkill(skillToDelete.id);
      setSkillToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryLabel = (cat: string) => {
    if (cat === 'ALL') return t('skills.all', '전체 역량');
    return t(`skills.cat.${cat}`, cat);
  };

  // Color mapper for Notion category tag
  const getCategoryTagStyle = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('hardware') || lower.includes('하드웨어')) {
      return 'bg-[#faece6] text-[#733e2b] border-[#f1d5ca]';
    }
    if (lower.includes('software') || lower.includes('소프트웨어') || lower.includes('coding')) {
      return 'bg-[#e7f3f8] text-[#1b587a] border-[#cce4ef]';
    }
    if (lower.includes('algorithm') || lower.includes('알고리즘') || lower.includes('ai')) {
      return 'bg-[#f4f0f7] text-[#5e4184] border-[#e4dbe9]';
    }
    if (lower.includes('sensor') || lower.includes('센서') || lower.includes('control')) {
      return 'bg-[#edf3ec] text-[#2b593f] border-[#d3e5d0]';
    }
    return 'bg-[#f1f1ef] text-[#37352f] border-[#e3e2de]';
  };

  return (
    <section id="skills" className="relative py-12 sm:py-20 border-t border-[#e2e0da] dark:border-white/10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stokt Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-[#6e6d6a] dark:text-[#a3a29e] tracking-wider uppercase">
              ( 04 / DISCIPLINES &amp; CAPABILITIES )
            </span>
            <span className="h-px flex-1 bg-[#e2e0da] dark:bg-white/10 max-w-[80px]" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-orange-500/15 border border-amber-500/25 text-amber-500 shadow-2xs shrink-0 select-none transition-all duration-300 hover:scale-105 hover:border-amber-500/40">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500/20 stroke-[2.2]" />
              </span>
              <div>
                <h2 className="text-2xl sm:text-4xl font-sans font-black text-[#0a0a0a] dark:text-[#f4f2ee] tracking-tight">
                  {t('skills.title', '기술 스택 및 핵심 역량')}
                </h2>
                <p className="text-xs sm:text-sm text-[#6e6d6a] dark:text-[#a3a29e] mt-0.5 font-sans">
                  {t('skills.subtitle', '하드웨어 설계, 펌웨어 제어, 알고리즘 구현 역량입니다.')}
                </p>
              </div>
            </div>

            {/* Admin Action: Add Skill */}
            {isAdmin && onAddSkill && (
              <button
                onClick={onAddSkill}
                id="add-skill-btn"
                className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 bg-[#0a0a0a] text-white dark:bg-[#f4f2ee] dark:text-[#0a0a0a] transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Capability</span>
              </button>
            )}
          </div>
        </div>

        {/* Stokt Category Filter Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#0a0a0a] text-white dark:bg-[#f4f2ee] dark:text-[#0a0a0a] font-semibold shadow-2xs'
                    : 'text-[#6e6d6a] dark:text-[#a3a29e] hover:text-[#0a0a0a] dark:hover:text-white bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            );
          })}
        </div>

        {filteredSkills.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[#e2e0da] dark:border-white/10 bg-white/40 dark:bg-white/[0.02] text-sm text-[#6e6d6a] dark:text-[#a3a29e]">
            {t('skills.empty', '해당 카테고리에 등록된 기술 역량이 없습니다.')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredSkills.map((skill) => {
              const rawSkill = skills.find((s) => s.id === skill.id) || skill;

              return (
                <div
                  key={skill.id}
                  className="relative p-6 rounded-2xl border border-[#e2e0da] dark:border-white/10 bg-white dark:bg-[#121318] hover:border-[#0a0a0a]/30 dark:hover:border-white/30 transition-all duration-200 flex flex-col justify-between group shadow-2xs hover:shadow-lg"
                >
                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
                      {onEditSkill && (
                        <button
                          onClick={() => onEditSkill(rawSkill)}
                          className="p-1 rounded text-xs bg-white/90 dark:bg-black/80 hover:bg-[#eae8e2] text-[#6e6d6a] dark:text-[#a3a29e] border border-[#e2e0da] dark:border-white/20 cursor-pointer shadow-xs"
                          title="Edit"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                      {onDeleteSkill && (
                        <button
                          onClick={() => setSkillToDelete(rawSkill)}
                          className="p-1 rounded text-xs bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 cursor-pointer shadow-xs"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  <div>
                    {/* Category & Proficiency (Clean unboxed Stokt metadata) */}
                    <div className="flex items-center justify-between gap-2 mb-3 pr-12 text-xs font-mono">
                      <span className="text-[#6e6d6a] dark:text-[#a3a29e] uppercase tracking-wider text-[11px]">
                        ( {skill.category} )
                      </span>
                      {skill.proficiency !== undefined && (
                        <span className="font-semibold text-[#0a0a0a] dark:text-[#f4f2ee]">
                          {skill.proficiency}%
                        </span>
                      )}
                    </div>

                    {/* Skill Name */}
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#f5f0e9] dark:bg-white/[0.06] border border-[#e2e0da] dark:border-white/10 flex items-center justify-center text-[#0a0a0a] dark:text-[#f4f2ee] shrink-0 group-hover:scale-105 transition-transform">
                        {renderIcon(skill.iconName || 'Cpu')}
                      </div>
                      <h4 className="text-base font-sans font-bold text-[#0a0a0a] dark:text-[#f4f2ee] tracking-tight">
                        {skill.name}
                      </h4>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm font-sans text-[#4a4946] dark:text-[#b4b3ae] leading-relaxed mb-4 whitespace-pre-line">
                      {skill.description}
                    </p>
                  </div>

                  {/* Proficiency Bar (Minimalist Stokt Track) */}
                  {skill.proficiency !== undefined && (
                    <div className="space-y-1.5 pt-3 border-t border-[#e2e0da] dark:border-white/10">
                      <div className="h-1 w-full rounded-full bg-[#eae8e2] dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0a0a0a] dark:bg-[#f4f2ee] group-hover:bg-[#ff6a37] transition-all duration-300"
                          style={{ width: `${Math.min(Math.max(skill.proficiency, 5), 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!skillToDelete}
        title={t('skills.delete', '역량 삭제')}
        message={t('skills.deleteConfirm', '이 기술 역량 항목을 삭제하시겠습니까?')}
        itemName={skillToDelete ? `${skillToDelete.name} (${skillToDelete.category})` : ''}
        confirmText={
          isDeleting
            ? t('youtube.deleting', '삭제 중...')
            : t('skills.delete', '삭제')
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setSkillToDelete(null)}
      />
    </section>
  );
};
