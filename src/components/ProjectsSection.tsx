import React, { useState } from 'react';
import {
  Plus,
  ArrowUpRight,
  Edit3,
  Trash2,
  FileCode,
  LayoutGrid,
  List,
} from 'lucide-react';
import { ProjectItem } from '../types';
import { ProjectModal } from './ProjectModal';
import { ConfirmModal } from './modals/ConfirmModal';
import { useLanguage } from '../context/ThemeContext';
import { getLocalizedProject } from '../utils/translationHelper';
import { PROJECTS_DATA } from '../data/portfolioData';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  isAdmin?: boolean;
  onAddProject?: () => void;
  onEditProject?: (project: ProjectItem) => void;
  onDeleteProject?: (id: string) => Promise<void>;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  isAdmin = false,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) => {
  const { lang, t } = useLanguage();

  const localizedProjects = projects.map((p) => getLocalizedProject(p, lang));

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleConfirmDelete = async () => {
    if (!projectToDelete || !onDeleteProject) return;
    setIsDeleting(true);
    try {
      await onDeleteProject(projectToDelete.id);
      setProjectToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter categories
  const categories = [
    { id: 'all', label: lang === 'ko' ? '전체 (All)' : 'All Work' },
    { id: 'autonomous', label: lang === 'ko' ? '자율주행 (Autonomous)' : 'Autonomous' },
    { id: 'manipulator', label: lang === 'ko' ? '매니퓰레이터 (Manipulator)' : 'Manipulator' },
    { id: 'embedded', label: lang === 'ko' ? '제어 & 임베디드 (Embedded)' : 'Embedded & Hardware' },
  ];

  const filteredProjects = localizedProjects.filter((project) => {
    if (activeFilter === 'all') return true;
    const textToMatch = `${project.title} ${project.summary} ${project.tags.join(' ')}`.toLowerCase();
    if (activeFilter === 'autonomous') {
      return textToMatch.includes('라인') || textToMatch.includes('자율') || textToMatch.includes('navigation') || textToMatch.includes('autonomous') || textToMatch.includes('pid');
    }
    if (activeFilter === 'manipulator') {
      return textToMatch.includes('manipulator') || textToMatch.includes('매니퓰레이터') || textToMatch.includes('로봇팔') || textToMatch.includes('arm');
    }
    if (activeFilter === 'embedded') {
      return textToMatch.includes('stm32') || textToMatch.includes('embedded') || textToMatch.includes('제어') || textToMatch.includes('hardware') || textToMatch.includes('control');
    }
    return true;
  });

  return (
    <section id="experience" className="relative py-12 sm:py-20 border-t border-[#e2e0da] dark:border-white/10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stokt Signature Section Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-[#6e6d6a] dark:text-[#a3a29e] tracking-wider uppercase">
              ( works &amp; ARCHIVES )
            </span>
            <span className="h-px flex-1 bg-[#e2e0da] dark:bg-white/10 max-w-[80px]" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-black tracking-[-0.035em] text-[#0a0a0a] dark:text-[#f4f2ee] leading-[1.05]">
                {lang === 'ko' ? 'Every Project across era & disciplines' : 'Every Project across era & disciplines'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#6e6d6a] dark:text-[#a3a29e] max-w-2xl font-sans leading-relaxed">
                {t('projects.subtitle', '직접 설계하고 제작한 자율주행 알고리즘, 임베디드 제어기 및 정밀 로보틱스 하드웨어 실전 아카이브입니다.')}
              </p>
            </div>

            {/* Admin Action */}
            {isAdmin && onAddProject && (
              <button
                onClick={onAddProject}
                id="add-project-btn"
                className="px-4 py-2 rounded-full text-xs font-mono font-medium flex items-center gap-2 bg-[#0a0a0a] text-white hover:bg-black dark:bg-[#f4f2ee] dark:text-[#0a0a0a] transition-all cursor-pointer shrink-0 self-start lg:self-auto shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Register Project</span>
              </button>
            )}
          </div>

          {/* Stokt Filter & View Switcher Bar */}
          <div className="mt-8 pt-4 pb-3 border-y border-[#e2e0da] dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === cat.id
                      ? 'bg-[#0a0a0a] text-white dark:bg-[#f4f2ee] dark:text-[#0a0a0a] font-semibold'
                      : 'text-[#6e6d6a] dark:text-[#a3a29e] hover:text-[#0a0a0a] dark:hover:text-white bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle: Grid vs Archive Table */}
            <div className="flex items-center gap-1 border border-[#e2e0da] dark:border-white/10 rounded-lg p-0.5 bg-white/70 dark:bg-white/[0.04]">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0a0a0a] text-white dark:bg-[#f4f2ee] dark:text-[#0a0a0a] font-semibold'
                    : 'text-[#6e6d6a] dark:text-[#a3a29e] hover:text-[#0a0a0a] dark:hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-wider font-medium">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#0a0a0a] text-white dark:bg-[#f4f2ee] dark:text-[#0a0a0a] font-semibold'
                    : 'text-[#6e6d6a] dark:text-[#a3a29e] hover:text-[#0a0a0a] dark:hover:text-white'
                }`}
                title="Archive Index List"
              >
                <List className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-wider font-medium">Index</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: STOKT VISUAL EDITORIAL GRID */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredProjects.map((project, idx) => {
              const rawProject = projects.find((p) => p.id === project.id) || project;
              const defaultProj = PROJECTS_DATA.find((p) => p.id === project.id);
              const codeFiles =
                project.codeFiles && project.codeFiles.length > 0
                  ? project.codeFiles
                  : defaultProj?.codeFiles || [];

              if (project.status === 'AWAITING') {
                if (!isAdmin) return null;
                return (
                  <div
                    key={project.id}
                    onClick={() => onAddProject && onAddProject()}
                    className="rounded-2xl border border-dashed border-[#e2e0da] dark:border-white/15 bg-white/40 dark:bg-white/[0.02] p-10 flex flex-col items-center justify-center text-center space-y-3 transition-colors hover:bg-white dark:hover:bg-white/[0.04] cursor-pointer min-h-[360px]"
                  >
                    <div className="w-10 h-10 rounded-full border border-[#e2e0da] dark:border-white/20 flex items-center justify-center text-[#6e6d6a]">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-sans font-bold text-[#0a0a0a] dark:text-[#f4f2ee] mb-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#6e6d6a] dark:text-[#a3a29e]">
                        {project.summary}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 underline underline-offset-4">
                      {t('projects.addPlaceholder', '새 프로젝트 등록하기')}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={project.id}
                  data-cursor="view"
                  data-cursor-label="VIEW ↗"
                  className="group relative rounded-2xl border border-[#e2e0da] dark:border-white/10 bg-white dark:bg-[#121318] hover:border-[#0a0a0a]/40 dark:hover:border-white/30 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-xl cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Admin Item Controls */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                      {onEditProject && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditProject(rawProject);
                          }}
                          className="px-2.5 py-1 rounded text-xs font-mono bg-white/95 dark:bg-black/90 hover:bg-white border border-[#e2e0da] dark:border-white/20 text-[#0a0a0a] dark:text-white flex items-center gap-1 cursor-pointer shadow-xs backdrop-blur-xs"
                          title="Edit Project"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      )}
                      {onDeleteProject && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToDelete(rawProject);
                          }}
                          className="p-1.5 rounded text-xs bg-white/95 dark:bg-black/90 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 cursor-pointer shadow-xs backdrop-blur-xs"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Cinematic Framed Media Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#eae8e2] dark:bg-black/50 border-b border-[#e2e0da] dark:border-white/10">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#9b9a97]">
                        NO MEDIA ATTACHED
                      </div>
                    )}

                    {/* Corner Technical Monospace Tags */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <div className="font-mono text-[11px] font-bold text-[#0a0a0a] dark:text-[#f4f2ee] bg-white/90 dark:bg-black/85 backdrop-blur-xs px-2.5 py-0.5 rounded border border-[#e2e0da] dark:border-white/15 shadow-2xs">
                        ( {project.projectId.replace('PROJECT_ID: ', '')} )
                      </div>
                      {codeFiles.length > 0 && (
                        <div className="font-mono text-[11px] text-cyan-800 dark:text-cyan-300 bg-white/95 dark:bg-cyan-950/80 backdrop-blur-xs px-2 py-0.5 rounded border border-cyan-200/90 dark:border-cyan-800/50 shadow-2xs flex items-center gap-1">
                          <FileCode className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                          <span>{codeFiles.length} files</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Editorial Details */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-xl sm:text-2xl font-sans font-bold tracking-tight text-[#0a0a0a] dark:text-[#f4f2ee] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                          {project.title}
                        </h3>
                        <div className="p-1 text-[#6e6d6a] dark:text-[#a3a29e] group-hover:text-[#0a0a0a] dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Stokt Slash Metadata Line */}
                      <p className="text-xs sm:text-sm font-mono text-[#6e6d6a] dark:text-[#a3a29e] mb-3">
                        {project.tags.join(' / ')} {codeFiles.length > 0 && ` / ${codeFiles.length} Code Files`}
                      </p>

                      <p className="text-xs sm:text-sm font-sans text-[#4a4946] dark:text-[#b4b3ae] leading-relaxed line-clamp-3">
                        {project.summary}
                      </p>
                    </div>

                    {/* Bottom Action Line */}
                    <div className="pt-4 border-t border-[#e2e0da] dark:border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#6e6d6a] dark:text-[#a3a29e]">
                        STATUS / {project.status}
                      </span>
                      <span className="font-semibold text-[#0a0a0a] dark:text-[#f4f2ee] flex items-center gap-1 group-hover:underline underline-offset-4">
                        {t('projects.details', '상세 보기')} ↗
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Mode 2: STOKT ARCHIVE INDEX TABLE */}
        {viewMode === 'list' && (
          <div className="border border-[#e2e0da] dark:border-white/10 rounded-2xl bg-white dark:bg-[#121318] divide-y divide-[#e2e0da] dark:divide-white/10 overflow-hidden shadow-2xs">
            {filteredProjects.map((project, idx) => {
              const defaultProj = PROJECTS_DATA.find((p) => p.id === project.id);
              const codeFiles =
                project.codeFiles && project.codeFiles.length > 0
                  ? project.codeFiles
                  : defaultProj?.codeFiles || [];

              return (
                <div
                  key={project.id}
                  data-cursor="view"
                  data-cursor-label="OPEN ↗"
                  onClick={() => setSelectedProject(project)}
                  className="group p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#faf9f6] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-baseline gap-4 sm:gap-6 min-w-0">
                    <span className="font-mono text-xs text-[#6e6d6a] dark:text-[#8e8d89] shrink-0">
                      ( {String(idx + 1).padStart(2, '0')} )
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-lg sm:text-xl font-sans font-bold text-[#0a0a0a] dark:text-[#f4f2ee] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                        {project.title}
                      </h4>
                      <p className="text-xs font-mono text-[#6e6d6a] dark:text-[#a3a29e] mt-1">
                        {project.projectId.replace('PROJECT_ID: ', '')} / {project.tags.join(' / ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-8 self-end md:self-auto shrink-0 font-mono text-xs">
                    <span className="text-[#6e6d6a] dark:text-[#a3a29e]">
                      {project.status}
                    </span>
                    {codeFiles.length > 0 && (
                      <span className="flex items-center gap-1 text-cyan-700 dark:text-cyan-300">
                        <FileCode className="w-3.5 h-3.5" />
                        <span>{codeFiles.length} files</span>
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-[#0a0a0a] dark:text-[#f4f2ee] font-semibold group-hover:translate-x-1 transition-transform">
                      <span>{t('projects.details', '상세 보기')}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Project Inspector Modal with Auto-Focus */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!projectToDelete}
        title={t('projects.delete', '프로젝트 삭제')}
        message={t('projects.deleteConfirm', '이 프로젝트를 삭제하시겠습니까?')}
        itemName={projectToDelete ? `${projectToDelete.projectId} - ${projectToDelete.title}` : ''}
        confirmText={
          isDeleting
            ? t('youtube.deleting', '삭제 중...')
            : t('projects.delete', '삭제')
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />
    </section>
  );
};
