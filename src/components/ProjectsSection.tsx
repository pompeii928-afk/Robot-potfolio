import React, { useState } from 'react';
import { Bot, Plus, ArrowUpRight, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { ProjectItem } from '../types';
import { ProjectModal } from './ProjectModal';
import { ConfirmModal } from './modals/ConfirmModal';
import { useLanguage } from '../context/ThemeContext';
import { getLocalizedProject } from '../utils/translationHelper';

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

  return (
    <section id="experience" className="relative py-10 sm:py-14 border-t border-[#e3e2de] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notion Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none">📦</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#37352f] tracking-tight">
                {t('projects.title', '로봇 시스템 및 프로젝트')}
              </h2>
              <p className="text-xs sm:text-sm text-[#787774] mt-0.5">
                {t('projects.subtitle', '직접 설계하고 제작한 자율주행 및 하드웨어 시스템입니다.')}
              </p>
            </div>
          </div>

          {/* Admin Action: Add Project */}
          {isAdmin && onAddProject && (
            <button
              onClick={onAddProject}
              id="add-project-btn"
              className="px-3 py-1.5 rounded-md text-xs font-sans font-medium flex items-center gap-1.5 bg-[#f7f6f3] hover:bg-[#efefed] text-[#37352f] border border-[#e3e2de] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#787774]" />
              <span>{t('projects.addBtn', '새 프로젝트 추가')}</span>
            </button>
          )}
        </div>

        {/* Projects 2-Column Notion Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {localizedProjects.map((project, idx) => {
            const rawProject = projects[idx] || project;
            if (project.status === 'AWAITING') {
              if (!isAdmin) return null;
              return (
                <div
                  key={project.id}
                  onClick={() => {
                    if (onAddProject) {
                      onAddProject();
                    }
                  }}
                  className="rounded-xl border border-dashed border-[#e3e2de] bg-[#f7f6f3] p-8 flex flex-col items-center justify-center text-center space-y-3 transition-colors hover:bg-[#efefed] cursor-pointer min-h-[300px]"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-[#e3e2de] flex items-center justify-center text-[#787774]">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-bold text-[#37352f] mb-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#787774]">
                      {project.summary}
                    </p>
                  </div>
                  <span className="text-xs font-sans font-medium text-[#2383e2] underline">
                    {t('projects.addPlaceholder', '새 프로젝트 등록하기')}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={project.id}
                className="group relative rounded-xl border border-[#e3e2de] bg-white hover:bg-[#fbfbfa] transition-colors overflow-hidden flex flex-col justify-between shadow-2xs"
              >
                {/* Admin Item Controls */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
                    {onEditProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProject(rawProject);
                        }}
                        className="px-2.5 py-1 rounded text-xs font-sans bg-white hover:bg-[#efefed] border border-[#e3e2de] text-[#37352f] flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3 h-3" /> {t('journey.edit', '수정')}
                      </button>
                    )}
                    {onDeleteProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(rawProject);
                        }}
                        className="p-1.5 rounded text-xs bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 cursor-pointer shadow-2xs"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* Project Image Header */}
                <div
                  onClick={() => setSelectedProject(project)}
                  className="relative aspect-video w-full overflow-hidden bg-[#f7f6f3] border-b border-[#e3e2de] cursor-pointer"
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#9b9a97]">
                      No Image Attached
                    </div>
                  )}

                  {/* Project ID Tag */}
                  <div className="absolute top-3 left-3 font-mono font-semibold text-[11px] text-[#37352f] bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded border border-[#e3e2de] shadow-2xs">
                    {project.projectId}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3
                        onClick={() => setSelectedProject(project)}
                        className="text-lg font-sans font-bold text-[#37352f] group-hover:text-[#2383e2] transition-colors cursor-pointer"
                      >
                        {project.title}
                      </h3>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-[#9b9a97] hover:text-[#37352f] cursor-pointer p-1"
                        aria-label="View project details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm font-sans text-[#787774] leading-relaxed line-clamp-3 whitespace-pre-line">
                      {project.summary}
                    </p>
                  </div>

                  {/* Bottom Tags & Button */}
                  <div className="pt-3 border-t border-[#e3e2de] flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {project.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#f1f1ef] text-[#37352f] border border-[#e3e2de]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      id={`project-btn-${project.id}`}
                      onClick={() => setSelectedProject(project)}
                      className="px-3 py-1 rounded text-xs font-sans font-medium text-[#37352f] bg-[#f7f6f3] hover:bg-[#efefed] border border-[#e3e2de] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {t('projects.details', '상세 보기')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Project Inspector Modal */}
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
