import React, { useState } from 'react';
import { Bot, Plus, ArrowUpRight, Edit3, Trash2 } from 'lucide-react';
import { ProjectItem } from '../types';
import { ProjectModal } from './ProjectModal';
import { ConfirmModal } from './modals/ConfirmModal';
import { useTheme, useLanguage } from '../context/ThemeContext';

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
  const { theme } = useTheme();
  const { lang, t } = useLanguage();

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
    <section
      id="experience"
      className={`relative py-16 sm:py-24 border-t scroll-mt-20 sm:scroll-mt-24 ${
        theme === 'light' ? 'border-slate-200' : 'border-cyan-500/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2.5 font-display text-2xl sm:text-3xl font-bold tracking-wide ${
                theme === 'light'
                  ? 'text-sky-700'
                  : 'text-cyan-400 text-glow-cyan'
              }`}
            >
              <Bot className={`w-7 h-7 ${theme === 'light' ? 'text-sky-600' : 'text-cyan-400'}`} />
              <span>{t('projects.title')}</span>
            </div>
            <div
              className={`hidden sm:block w-32 h-[1px] ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-sky-400/50 via-sky-300/20 to-transparent'
                  : 'bg-gradient-to-r from-cyan-500/40 via-cyan-500/10 to-transparent'
              }`}
            />
          </div>

          {/* Admin Action: Add Project */}
          {isAdmin && onAddProject && (
            <button
              onClick={onAddProject}
              id="add-project-btn"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-700 shadow-sm'
                  : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{t('projects.addBtn')}</span>
            </button>
          )}
        </div>

        {/* Projects 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project) => {
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
                  className={`rounded-2xl border border-dashed p-8 flex flex-col items-center justify-center text-center space-y-4 transition-colors group cursor-pointer min-h-[360px] ${
                    theme === 'light'
                      ? 'border-sky-300 bg-sky-50/40 hover:border-sky-500 hover:bg-sky-50/80'
                      : 'border-cyan-500/30 bg-[#061022]/40 hover:border-cyan-400/60'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-full border flex items-center justify-center group-hover:scale-110 transition-transform ${
                      theme === 'light'
                        ? 'bg-sky-100 border-sky-300 text-sky-600 shadow-sm'
                        : 'bg-cyan-950/80 border-cyan-500/30 text-cyan-400'
                    }`}
                  >
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3
                      className={`font-display text-lg font-bold mb-1 ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p
                      className={`text-xs font-mono ${
                        theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {project.summary}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-mono underline ${
                      theme === 'light' ? 'text-sky-700' : 'text-cyan-400'
                    }`}
                  >
                    {lang === 'en' ? 'Click to register a new project' : '클릭하여 새 프로젝트 등록하기'}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={project.id}
                className={`group relative rounded-2xl backdrop-blur-xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  theme === 'light'
                    ? 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-[0_12px_40px_rgba(2,132,199,0.12)]'
                    : 'bg-[#081224]/80 border-cyan-500/20 hover:border-cyan-400/60 hover:shadow-[0_10px_35px_rgba(0,240,255,0.12)]'
                }`}
              >
                {/* Admin Item Controls */}
                {isAdmin && (
                  <div
                    className={`absolute top-3 right-3 flex items-center gap-1 z-20 p-1 rounded-lg border ${
                      theme === 'light'
                        ? 'bg-white/95 border-slate-300 shadow-md'
                        : 'bg-[#060c18]/90 border-cyan-500/40'
                    }`}
                  >
                    {onEditProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProject(project);
                        }}
                        className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 cursor-pointer ${
                          theme === 'light'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                            : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300'
                        }`}
                        title="Edit Project"
                      >
                        <Edit3 className="w-3 h-3" /> {t('journey.edit')}
                      </button>
                    )}
                    {onDeleteProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(project);
                        }}
                        className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 cursor-pointer ${
                          theme === 'light'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                            : 'bg-rose-950 hover:bg-rose-900 text-rose-300'
                        }`}
                        title="Delete Project"
                      >
                        <Trash2 className="w-3 h-3" /> {t('journey.delete')}
                      </button>
                    )}
                  </div>
                )}

                {/* Project Image Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 font-mono text-xs">
                      No Image Configured
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 pointer-events-none opacity-80 ${
                      theme === 'light'
                        ? 'bg-gradient-to-t from-slate-900/60 via-transparent to-transparent'
                        : 'bg-gradient-to-t from-[#081224] via-transparent to-transparent'
                    }`}
                  />

                  {/* Project ID Tag */}
                  <div className="absolute top-3 left-3 font-mono text-[11px] text-cyan-300 bg-[#060c1a]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-500/30">
                    {project.projectId}
                  </div>

                  {/* Top Right Quick Badge (e.g. ROS2, C++) if not admin */}
                  {!isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {project.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] text-cyan-300 bg-cyan-950/90 border border-cyan-400/40 px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3
                        className={`font-display text-xl sm:text-2xl font-bold transition-colors ${
                          theme === 'light'
                            ? 'text-slate-900 group-hover:text-sky-700'
                            : 'text-white group-hover:text-cyan-300'
                        }`}
                      >
                        {project.title}
                      </h3>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className={`p-1 cursor-pointer transition-colors ${
                          theme === 'light'
                            ? 'text-slate-400 hover:text-sky-600'
                            : 'text-slate-400 hover:text-cyan-300'
                        }`}
                        aria-label="View project details"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </button>
                    </div>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed line-clamp-3 whitespace-pre-line ${
                        theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                      }`}
                    >
                      {project.summary}
                    </p>
                  </div>

                  {/* Bottom Action Area */}
                  <div
                    className={`pt-3 border-t flex items-center justify-between ${
                      theme === 'light' ? 'border-slate-200' : 'border-cyan-500/15'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {project.tags[0] && (
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-mono border ${
                            theme === 'light'
                              ? 'bg-sky-50 border-sky-200 text-sky-800'
                              : 'text-cyan-300 bg-cyan-950/70 border-cyan-500/30'
                          }`}
                        >
                          {project.tags[0]}
                        </span>
                      )}
                    </div>

                    <button
                      id={`project-btn-${project.id}`}
                      onClick={() => setSelectedProject(project)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
                          : 'text-cyan-300 bg-cyan-950/80 border border-cyan-400/50 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_#00f0ff]'
                      }`}
                    >
                      {t('projects.details')}
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
        title={t('projects.deleteConfirm')}
        message={
          lang === 'en'
            ? 'Are you sure you want to permanently delete this project?'
            : '선택하신 프로젝트를 정말 삭제하시겠습니까?'
        }
        itemName={projectToDelete ? `${projectToDelete.projectId} - ${projectToDelete.title}` : ''}
        confirmText={
          isDeleting
            ? lang === 'en'
              ? 'Deleting...'
              : '삭제 중...'
            : lang === 'en'
              ? 'Delete'
              : '삭제하기'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />
    </section>
  );
};
