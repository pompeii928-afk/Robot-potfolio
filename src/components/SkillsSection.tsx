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
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [skillToDelete, setSkillToDelete] = useState<SkillItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const renderIcon = (name: string, className: string = 'w-5 h-5 text-cyan-400') => {
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

  const categories = ['ALL', ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills =
    selectedCategory === 'ALL'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

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

  return (
    <section id="skills" className="relative py-16 sm:py-24 border-t border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-cyan-400 font-display text-2xl sm:text-3xl font-bold tracking-wide text-glow-cyan">
              <Cpu className="w-7 h-7 text-cyan-400" />
              <span>Core Skills & Capabilities</span>
            </div>
            <div className="hidden sm:block w-32 h-[1px] bg-gradient-to-r from-cyan-500/40 via-cyan-500/10 to-transparent" />
          </div>

          {/* Admin Action: Add Skill */}
          {isAdmin && onAddSkill && (
            <button
              onClick={onAddSkill}
              id="add-skill-btn"
              className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>역량 항목 추가</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-[#081224]/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-cyan-500/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {filteredSkills.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#081224]/50 border border-dashed border-cyan-500/20 text-slate-400 font-mono text-sm">
            해당 카테고리의 역량 항목이 없습니다. 관리자 모드에서 새로운 스킬을 추가해 보세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className={`relative p-5 rounded-2xl bg-[#0a152d]/85 backdrop-blur-xl border transition-all flex flex-col justify-between group ${
                  skill.highlighted
                    ? 'border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-gradient-to-b from-[#0e1e3d] to-[#0a152d]'
                    : 'border-cyan-500/20 hover:border-cyan-400/50 hover:bg-[#0c1a36]'
                }`}
              >
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                    {onEditSkill && (
                      <button
                        onClick={() => onEditSkill(skill)}
                        className="p-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 cursor-pointer"
                        title="수정"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                    {onDeleteSkill && (
                      <button
                        onClick={() => setSkillToDelete(skill)}
                        className="p-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-mono border border-rose-500/30 cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                <div>
                  {/* Top Bar: Icon & Category */}
                  <div className="flex items-center justify-between mb-3.5 pr-14">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center box-glow-cyan">
                      {renderIcon(skill.iconName, 'w-5 h-5 text-cyan-300')}
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 uppercase">
                      {skill.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5 flex items-center gap-2">
                    <span>{skill.name}</span>
                    {skill.highlighted && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 whitespace-pre-line">
                    {skill.description}
                  </p>
                </div>

                {/* Proficiency Gauge */}
                {typeof skill.proficiency === 'number' && skill.proficiency > 0 && (
                  <div className="pt-3 border-t border-cyan-500/15">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                      <span className="text-slate-400">Proficiency</span>
                      <span className="text-cyan-300 font-bold">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 transition-all duration-700"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!skillToDelete}
        title="역량 항목 삭제"
        message="선택하신 기술 역량 항목을 정말 삭제하시겠습니까?"
        itemName={skillToDelete ? `[${skillToDelete.category}] ${skillToDelete.name}` : ''}
        confirmText={isDeleting ? '삭제 중...' : '삭제하기'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSkillToDelete(null)}
      />
    </section>
  );
};
