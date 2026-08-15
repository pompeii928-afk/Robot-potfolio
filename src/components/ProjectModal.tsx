import React, { useState } from 'react';
import { X, ExternalLink, Cpu, Layers, Wrench, CheckCircle2, ChevronRight, Activity, Zap } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'blueprint'>('overview');
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

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

        {/* Modal Tab Navigation */}
        <div className="px-6 py-2 bg-[#060e1f] border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'specs'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SPECS & HARDWARE
          </button>
          {project.blueprintAnnotations && (
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'blueprint'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BLUEPRINT SCHEMATIC
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[calc(90vh-140px)]">
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

              {/* Interactive blueprint hotspot pins if in blueprint tab */}
              {activeTab === 'blueprint' &&
                project.blueprintAnnotations?.map((annot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveAnnotation(activeAnnotation === idx ? null : idx)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ left: `${annot.x}%`, top: `${annot.y}%` }}
                  >
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border border-white" />
                    </span>

                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 rounded-lg bg-[#060c1a]/95 border border-cyan-400 text-left text-xs font-sans text-white shadow-xl pointer-events-none">
                      <div className="font-bold text-cyan-300 font-mono text-[11px]">{annot.title}</div>
                      <div className="text-[10px] text-slate-300">{annot.detail}</div>
                    </div>
                  </button>
                ))}
            </div>
          )}

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-mono uppercase text-cyan-400 tracking-wider mb-2">
                  System Abstract
                </h4>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {project.detailedDescription}
                </p>
              </div>

              {/* Highlights */}
              {project.highlights && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-cyan-400 tracking-wider mb-3">
                    Key Innovations & Breakthroughs
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.highlights.map((hl, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#050c18] border border-cyan-500/20 flex items-start gap-2.5 text-xs text-slate-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Specs & Hardware */}
          {activeTab === 'specs' && project.specs && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#050c18] border border-cyan-500/20">
                  <div className="text-xs font-mono text-cyan-400 mb-1">MAIN CONTROLLER</div>
                  <div className="text-sm font-semibold text-white">{project.specs.microcontroller}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#050c18] border border-cyan-500/20">
                  <div className="text-xs font-mono text-cyan-400 mb-1">PHYSICAL SPECS</div>
                  <div className="text-sm text-slate-300">
                    <div>Dimensions: {project.specs.dimensions}</div>
                    <div>Weight: {project.specs.weight}</div>
                    <div>Max Velocity: {project.specs.speed}</div>
                  </div>
                </div>
              </div>

              {project.specs.sensors && (
                <div className="p-4 rounded-xl bg-[#050c18] border border-cyan-500/20">
                  <div className="text-xs font-mono text-cyan-400 mb-2">SENSOR PERCEPTION ARRAY</div>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {project.specs.sensors.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.specs.actuators && (
                <div className="p-4 rounded-xl bg-[#050c18] border border-cyan-500/20">
                  <div className="text-xs font-mono text-cyan-400 mb-2">ACTUATION & MOTORS</div>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {project.specs.actuators.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.specs.softwareStack && (
                <div className="p-4 rounded-xl bg-[#050c18] border border-cyan-500/20">
                  <div className="text-xs font-mono text-cyan-400 mb-2">SOFTWARE & FIRMWARE STACK</div>
                  <div className="flex flex-wrap gap-2">
                    {project.specs.softwareStack.map((st, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Blueprint Schematics */}
          {activeTab === 'blueprint' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-mono">
                Click any glowing hotspot pin on the diagram above to inspect component annotations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.blueprintAnnotations?.map((annot, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveAnnotation(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      activeAnnotation === idx
                        ? 'bg-cyan-950/80 border-cyan-400 box-glow-cyan'
                        : 'bg-[#050c18] border-slate-800 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold text-cyan-300">{annot.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{annot.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#050c1a] border-t border-cyan-500/20 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>STATUS: VERIFIED_SYSTEM_DATA</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
