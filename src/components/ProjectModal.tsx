import React from 'react';
import { X, CheckCircle2, Cpu, Wrench, Layers } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project || project.status === 'AWAITING') return null;

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="project-modal-container"
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#081224] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden text-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#050c1a] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-cyan-400 font-semibold px-2.5 py-1 rounded bg-cyan-950/70 border border-cyan-500/30">
              {project.projectId}
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-wide">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[calc(90vh-130px)] scrollbar-thin">
          {/* Main Visual Banner */}
          {project.image && (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-cyan-500/20 bg-slate-950">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081224] via-transparent to-transparent opacity-60" />
            </div>
          )}

          {/* Description / System Abstract */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
              System Abstract & Overview
            </h4>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
              {project.detailedDescription || project.summary}
            </p>
          </div>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                Key Innovations & Breakthroughs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.highlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#050c18] border border-cyan-500/20 flex items-start gap-2.5 text-xs sm:text-sm text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hardware & Specifications if present */}
          {project.specs && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                Hardware & Technical Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.specs.microcontroller && (
                  <div className="p-3.5 rounded-xl bg-[#050c18] border border-cyan-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mb-1">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>CONTROLLER</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      {project.specs.microcontroller}
                    </div>
                  </div>
                )}

                {(project.specs.dimensions || project.specs.weight || project.specs.speed) && (
                  <div className="p-3.5 rounded-xl bg-[#050c18] border border-cyan-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mb-1">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>PHYSICAL SPECS</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 space-y-0.5">
                      {project.specs.dimensions && <div>규격: {project.specs.dimensions}</div>}
                      {project.specs.weight && <div>무게: {project.specs.weight}</div>}
                      {project.specs.speed && <div>최대 속도: {project.specs.speed}</div>}
                    </div>
                  </div>
                )}
              </div>

              {project.specs.softwareStack && project.specs.softwareStack.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#050c18] border border-cyan-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mb-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>SOFTWARE & FIRMWARE STACK</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.specs.softwareStack.map((st, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300"
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
            <div className="flex flex-wrap gap-2 pt-1 border-t border-cyan-500/10">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#050c1a] border-t border-cyan-500/20 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>STATUS: VERIFIED_DATA</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-all cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
