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
    <section id="skills" className="relative py-10 sm:py-14 border-t border-[#e3e2de] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notion Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none">⚡</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#37352f] tracking-tight">
                {t('skills.title', '기술 스택 및 핵심 역량')}
              </h2>
              <p className="text-xs sm:text-sm text-[#787774] mt-0.5">
                {t('skills.subtitle', '하드웨어 설계, 펌웨어 제어, 알고리즘 구현 역량입니다.')}
              </p>
            </div>
          </div>

          {/* Admin Action: Add Skill */}
          {isAdmin && onAddSkill && (
            <button
              onClick={onAddSkill}
              id="add-skill-btn"
              className="px-3 py-1.5 rounded-md text-xs font-sans font-medium flex items-center gap-1.5 bg-[#f7f6f3] hover:bg-[#efefed] text-[#37352f] border border-[#e3e2de] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#787774]" />
              <span>{t('skills.addBtn', '새 역량 추가')}</span>
            </button>
          )}
        </div>

        {/* Notion Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-sans font-medium transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-[#37352f] text-white border-[#37352f]'
                    : 'bg-[#f7f6f3] text-[#787774] border-[#e3e2de] hover:bg-[#efefed] hover:text-[#37352f]'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            );
          })}
        </div>

        {filteredSkills.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-[#e3e2de] bg-[#f7f6f3] text-sm text-[#787774]">
            {t('skills.empty', '해당 카테고리에 등록된 기술 역량이 없습니다.')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => {
              const rawSkill = skills.find((s) => s.id === skill.id) || skill;

              return (
                <div
                  key={skill.id}
                  className="relative p-5 rounded-xl border border-[#e3e2de] bg-white hover:bg-[#fbfbfa] transition-colors flex flex-col justify-between group shadow-2xs"
                >
                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                      {onEditSkill && (
                        <button
                          onClick={() => onEditSkill(rawSkill)}
                          className="p-1 rounded text-xs bg-[#f7f6f3] hover:bg-[#efefed] text-[#787774] border border-[#e3e2de] cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                      {onDeleteSkill && (
                        <button
                          onClick={() => setSkillToDelete(rawSkill)}
                          className="p-1 rounded text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  <div>
                    {/* Category & Proficiency */}
                    <div className="flex items-center justify-between gap-2 mb-2.5 pr-12">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${getCategoryTagStyle(
                          skill.category
                        )}`}
                      >
                        {skill.category}
                      </span>
                      {skill.proficiency !== undefined && (
                        <span className="text-xs font-mono font-semibold text-[#787774]">
                          {skill.proficiency}%
                        </span>
                      )}
                    </div>

                    {/* Skill Name */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-md bg-[#f7f6f3] border border-[#e3e2de] flex items-center justify-center text-[#37352f]">
                        {renderIcon(skill.iconName || 'Cpu')}
                      </div>
                      <h4 className="text-base font-sans font-bold text-[#37352f]">
                        {skill.name}
                      </h4>
                    </div>

                    {/* Description */}
                    <p className="text-xs font-sans text-[#5a5854] leading-relaxed mb-4 whitespace-pre-line">
                      {skill.description}
                    </p>
                  </div>

                  {/* Proficiency Bar (Notion Progress) */}
                  {skill.proficiency !== undefined && (
                    <div className="space-y-1 pt-2 border-t border-[#e3e2de]">
                      <div className="h-1.5 w-full rounded-full bg-[#f1f1ef] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#37352f]"
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
