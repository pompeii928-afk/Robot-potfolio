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
        className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
          theme === 'light'
            ? 'bg-white border-slate-300 text-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.25)]'
            : 'bg-[#081224] border-cyan-500/40 text-slate-200 shadow-[0_0_50px_rgba(6,182,212,0.3)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-200 text-slate-900'
              : 'bg-[#050c1a] border-cyan-500/20 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-xs font-semibold px-2.5 py-1 rounded border ${
                theme === 'light'
                  ? 'bg-sky-50 border-sky-300 text-sky-800'
                  : 'bg-cyan-950/70 border-cyan-500/30 text-cyan-400'
              }`}
            >
              {project.projectId}
            </span>
            <h3
              className={`font-display text-lg sm:text-xl font-bold tracking-wide ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}
            >
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              theme === 'light'
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[calc(90vh-130px)] scrollbar-thin">
          {/* Main Visual Banner */}
          {project.image && (
            <div
              className={`relative aspect-video w-full rounded-xl overflow-hidden border ${
                theme === 'light'
                  ? 'border-slate-200 bg-slate-100 shadow-sm'
                  : 'border-cyan-500/20 bg-slate-950'
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
                    ? 'bg-gradient-to-t from-slate-900/40 via-transparent to-transparent'
                    : 'bg-gradient-to-t from-[#081224] via-transparent to-transparent'
                }`}
              />
            </div>
          )}

          {/* Description / System Abstract */}
          <div className="space-y-2">
            <h4
              className={`text-xs font-mono uppercase tracking-wider font-semibold ${
                theme === 'light' ? 'text-sky-700' : 'text-cyan-400'
              }`}
            >
              {t('modal.abstract')}
            </h4>
            <p
              className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                theme === 'light' ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              {project.detailedDescription || project.summary}
            </p>
          </div>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-3">
              <h4
                className={`text-xs font-mono uppercase tracking-wider font-semibold ${
                  theme === 'light' ? 'text-sky-700' : 'text-cyan-400'
                }`}
              >
                {t('modal.breakthroughs')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.highlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm ${
                      theme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-700'
                        : 'bg-[#050c18] border-cyan-500/20 text-slate-300'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        theme === 'light' ? 'text-emerald-600' : 'text-cyan-400'
                      }`}
                    />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hardware & Specifications if present */}
          {project.specs && (
            <div className="space-y-3">
              <h4
                className={`text-xs font-mono uppercase tracking-wider font-semibold ${
                  theme === 'light' ? 'text-sky-700' : 'text-cyan-400'
                }`}
              >
                {t('modal.specs')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.specs.microcontroller && (
                  <div
                    className={`p-3.5 rounded-xl border ${
                      theme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-[#050c18] border-cyan-500/20'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 text-xs font-mono mb-1 ${
                        theme === 'light' ? 'text-sky-700 font-semibold' : 'text-cyan-400'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>CONTROLLER</span>
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-semibold ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {project.specs.microcontroller}
                    </div>
                  </div>
                )}

                {(project.specs.dimensions || project.specs.weight || project.specs.speed) && (
                  <div
                    className={`p-3.5 rounded-xl border ${
                      theme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-[#050c18] border-cyan-500/20'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 text-xs font-mono mb-1 ${
                        theme === 'light' ? 'text-sky-700 font-semibold' : 'text-cyan-400'
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>PHYSICAL SPECS</span>
                    </div>
                    <div
                      className={`text-xs sm:text-sm space-y-0.5 ${
                        theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                      }`}
                    >
                      {project.specs.dimensions && (
                        <div>
                          {lang === 'en' ? 'Dimensions: ' : '규격: '}
                          {project.specs.dimensions}
                        </div>
                      )}
                      {project.specs.weight && (
                        <div>
                          {lang === 'en' ? 'Weight: ' : '무게: '}
                          {project.specs.weight}
                        </div>
                      )}
                      {project.specs.speed && (
                        <div>
                          {lang === 'en' ? 'Max Speed: ' : '최대 속도: '}
                          {project.specs.speed}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {project.specs.softwareStack && project.specs.softwareStack.length > 0 && (
                <div
                  className={`p-3.5 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-[#050c18] border-cyan-500/20'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 text-xs font-mono mb-2 ${
                      theme === 'light' ? 'text-sky-700 font-semibold' : 'text-cyan-400'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>SOFTWARE & FIRMWARE STACK</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.specs.softwareStack.map((st, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded border text-xs font-mono ${
                          theme === 'light'
                            ? 'bg-white border-slate-200 text-sky-800'
                            : 'bg-slate-900 border-slate-700 text-cyan-300'
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
              className={`flex flex-wrap gap-2 pt-1 border-t ${
                theme === 'light' ? 'border-slate-200' : 'border-cyan-500/10'
              }`}
            >
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-md text-xs font-mono border ${
                    theme === 'light'
                      ? 'bg-sky-50 border-sky-200 text-sky-800'
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
          className={`px-6 py-3 border-t flex items-center justify-between text-xs font-mono ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-200 text-slate-600'
              : 'bg-[#050c1a] border-cyan-500/20 text-slate-400'
          }`}
        >
          <span>STATUS: VERIFIED_DATA</span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
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
