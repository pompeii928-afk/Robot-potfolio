import React from 'react';
import { X, CheckCircle2, Cpu, Wrench, Layers } from 'lucide-react';
import { ProjectItem } from '../types';
import { useTheme, useLanguage } from '../context/ThemeContext';
import { getLocalizedProject } from '../utils/translationHelper';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project: rawProject, onClose }) => {
  const { theme } = useTheme();
  const { lang, t } = useLanguage();

  const project = rawProject ? getLocalizedProject(rawProject, lang) : null;

  if (!project || project.status === 'AWAITING') return null;

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="project-modal-container"
        className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
          theme === 'light'
            ? 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
            : 'bg-[#0b1120] border-white/10 text-zinc-200 shadow-[0_0_50px_rgba(6,182,212,0.3)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`px-6 sm:px-8 py-5 border-b flex items-center justify-between ${
            theme === 'light'
              ? 'bg-white border-zinc-200 text-zinc-950'
              : 'bg-[#070b14] border-white/10 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                theme === 'light'
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-900'
                  : 'bg-cyan-950/70 border-cyan-500/30 text-cyan-400'
              }`}
            >
              {project.projectId}
            </span>
            <h3
              className={`font-display text-lg sm:text-xl font-black uppercase tracking-tight ${
                theme === 'light' ? 'text-zinc-950' : 'text-white'
              }`}
            >
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              theme === 'light'
                ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 max-h-[calc(90vh-130px)] scrollbar-thin">
          {/* Main Visual Banner */}
          {project.image && (
            <div
              className={`relative aspect-video w-full rounded-2xl overflow-hidden border ${
                theme === 'light'
                  ? 'border-zinc-200 bg-zinc-100 shadow-xs'
                  : 'border-white/10 bg-zinc-950'
              }`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div
                className={`absolute inset-0 pointer-events-none opacity-60 ${
                  theme === 'light'
                    ? 'bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent'
                    : 'bg-gradient-to-t from-[#081224] via-transparent to-transparent'
                }`}
              />
            </div>
          )}

          {/* Description / System Abstract */}
          <div className="space-y-2">
            <h4
              className={`text-xs font-mono uppercase tracking-wider font-bold ${
                theme === 'light' ? 'text-red-600' : 'text-cyan-400'
              }`}
            >
              {t('modal.abstract')}
            </h4>
            <p
              className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                theme === 'light' ? 'text-zinc-700' : 'text-zinc-300'
              }`}
            >
              {project.detailedDescription || project.summary}
            </p>
          </div>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-3">
              <h4
                className={`text-xs font-mono uppercase tracking-wider font-bold ${
                  theme === 'light' ? 'text-red-600' : 'text-cyan-400'
                }`}
              >
                {t('modal.breakthroughs')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.highlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm ${
                      theme === 'light'
                        ? 'bg-zinc-50 border-zinc-200 text-zinc-800'
                        : 'bg-[#060c18] border-white/10 text-zinc-300'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        theme === 'light' ? 'text-red-600' : 'text-cyan-400'
                      }`}
                    />
                    <span className="leading-snug">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hardware & Specifications if present */}
          {project.specs && (
            <div className="space-y-3">
              <h4
                className={`text-xs font-mono uppercase tracking-wider font-bold ${
                  theme === 'light' ? 'text-red-600' : 'text-cyan-400'
                }`}
              >
                {t('modal.specs')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.specs.microcontroller && (
                  <div
                    className={`p-4 rounded-xl border ${
                      theme === 'light'
                        ? 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        : 'bg-[#060c18] border-white/10'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 text-xs font-mono mb-1.5 font-bold ${
                        theme === 'light' ? 'text-red-600' : 'text-cyan-400'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>CONTROLLER</span>
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-bold ${
                        theme === 'light' ? 'text-zinc-950' : 'text-white'
                      }`}
                    >
                      {project.specs.microcontroller}
                    </div>
                  </div>
                )}

                {(project.specs.dimensions || project.specs.weight || project.specs.speed) && (
                  <div
                    className={`p-4 rounded-xl border ${
                      theme === 'light'
                        ? 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        : 'bg-[#060c18] border-white/10'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 text-xs font-mono mb-1.5 font-bold ${
                        theme === 'light' ? 'text-red-600' : 'text-cyan-400'
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>PHYSICAL SPECS</span>
                    </div>
                    <div
                      className={`text-xs sm:text-sm space-y-1 ${
                        theme === 'light' ? 'text-zinc-600' : 'text-zinc-300'
                      }`}
                    >
                      {project.specs.dimensions && (
                        <div>
                          <span className="text-[#787774] mr-1">{t('modal.dimensions', 'Dimensions')}:</span>
                          <span className="font-semibold text-zinc-900 dark:text-white">{project.specs.dimensions}</span>
                        </div>
                      )}
                      {project.specs.weight && (
                        <div>
                          <span className="text-[#787774] mr-1">{t('modal.weight', 'Weight')}:</span>
                          <span className="font-semibold text-zinc-900 dark:text-white">{project.specs.weight}</span>
                        </div>
                      )}
                      {project.specs.speed && (
                        <div>
                          <span className="text-[#787774] mr-1">{t('modal.speed', 'Max Speed')}:</span>
                          <span className="font-semibold text-zinc-900 dark:text-white">{project.specs.speed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {project.specs.softwareStack && project.specs.softwareStack.length > 0 && (
                <div
                  className={`p-4 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-zinc-50 border-zinc-200'
                      : 'bg-[#060c18] border-white/10'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 text-xs font-mono mb-2.5 font-bold ${
                      theme === 'light' ? 'text-red-600' : 'text-cyan-400'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>SOFTWARE & FIRMWARE STACK</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.specs.softwareStack.map((st, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase ${
                          theme === 'light'
                            ? 'bg-white border-zinc-200 text-zinc-900'
                            : 'bg-zinc-900 border-white/10 text-cyan-300'
                        }`}
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tag badges */}
          {project.tags && project.tags.length > 0 && (
            <div
              className={`flex flex-wrap gap-2 pt-3 border-t ${
                theme === 'light' ? 'border-zinc-200' : 'border-white/10'
              }`}
            >
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                    theme === 'light'
                      ? 'bg-zinc-100 border-zinc-200 text-zinc-800'
                      : 'bg-cyan-950/80 border-cyan-500/30 text-cyan-300'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 sm:px-8 py-4 border-t flex items-center justify-between text-xs font-mono ${
            theme === 'light'
              ? 'bg-zinc-50 border-zinc-200 text-zinc-600'
              : 'bg-[#070b14] border-white/10 text-zinc-400'
          }`}
        >
          <span className="font-bold uppercase">STATUS: VERIFIED_DATA</span>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-full font-bold uppercase transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-xs'
                : 'bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900'
            }`}
          >
            {t('modal.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
