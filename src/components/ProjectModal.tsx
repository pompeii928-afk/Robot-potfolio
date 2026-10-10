import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  Cpu,
  Wrench,
  Layers,
  FileCode,
  Download,
  Copy,
  Check,
  Code2,
  ChevronDown,
  ChevronUp,
  Terminal,
} from 'lucide-react';
import { ProjectItem } from '../types';
import { useTheme, useLanguage } from '../context/ThemeContext';
import { getLocalizedProject } from '../utils/translationHelper';
import { PROJECTS_DATA } from '../data/portfolioData';
import {
  downloadCodeFile,
  formatFileSize,
  getLanguageLabel,
  getLanguageStyle,
} from '../utils/codeFileHelper';
import { useToast } from './Toast';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project: rawProject, onClose }) => {
  const { theme } = useTheme();
  const { lang, t } = useLanguage();
  const { showToast } = useToast();

  const [expandedCodeId, setExpandedCodeId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const project = rawProject ? getLocalizedProject(rawProject, lang) : null;

  // Auto focus and keyboard accessibility trap when modal opens
  useEffect(() => {
    if (project) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus modal container and ensure top scroll
      const timer = setTimeout(() => {
        if (modalContainerRef.current) {
          modalContainerRef.current.focus();
        } else if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        }
        if (modalBodyRef.current) {
          modalBodyRef.current.scrollTop = 0;
        }
      }, 30);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
          return;
        }

        // Trap Tab focus inside modal
        if (e.key === 'Tab' && modalContainerRef.current) {
          const focusableElements = modalContainerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement || document.activeElement === modalContainerRef.current) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
        if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [project, onClose]);

  if (!project || project.status === 'AWAITING') return null;

  // Resolve code files: check item's own codeFiles, fallback to default if not yet populated
  const defaultProj = PROJECTS_DATA.find((p) => p.id === project.id);
  const effectiveCodeFiles =
    project.codeFiles && project.codeFiles.length > 0
      ? project.codeFiles
      : defaultProj?.codeFiles || [];

  const handleCopyCode = async (id: string, codeContent: string) => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopiedCodeId(id);
      showToast('코드가 클립보드에 복사되었습니다.', 'success', '복사 완료');
      setTimeout(() => setCopiedCodeId(null), 2500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
      showToast('코드 복사에 실패했습니다.', 'error', '오류');
    }
  };

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalContainerRef}
        id="project-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        tabIndex={-1}
        className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden outline-none focus:outline-none focus:ring-1 ${
          theme === 'light'
            ? 'bg-white border-zinc-200 text-zinc-900 shadow-2xl focus:ring-zinc-400/40'
            : 'bg-[#0b1120] border-white/10 text-zinc-200 shadow-[0_0_50px_rgba(6,182,212,0.3)] focus:ring-cyan-500/40'
        } animate-in zoom-in-95 duration-200`}
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
              id="project-modal-title"
              className={`font-display text-lg sm:text-xl font-black uppercase tracking-tight ${
                theme === 'light' ? 'text-zinc-950' : 'text-white'
              }`}
            >
              {project.title}
            </h3>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className={`p-2 rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 ${
              theme === 'light'
                ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 focus:ring-zinc-400'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800 focus:ring-cyan-400'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          ref={modalBodyRef}
          tabIndex={0}
          className="p-6 sm:p-8 overflow-y-auto space-y-6 max-h-[calc(90vh-130px)] scrollbar-thin outline-none focus:outline-none"
        >
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

          {/* Source Code & Engineering Files Section */}
          {effectiveCodeFiles.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4
                  className={`text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 ${
                    theme === 'light' ? 'text-red-600' : 'text-cyan-400'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span>{t('projects.codeFiles', '소스 코드 및 첨부 파일 (Source Code & Files)')}</span>
                </h4>
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                    theme === 'light'
                      ? 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  {effectiveCodeFiles.length} {lang === 'en' ? 'files attached' : '개 파일 첨부'}
                </span>
              </div>

              <div className="space-y-2.5">
                {effectiveCodeFiles.map((file) => {
                  const style = getLanguageStyle(file.language);
                  const label = getLanguageLabel(file.language);
                  const isExpanded = expandedCodeId === file.id;
                  const isCopied = copiedCodeId === file.id;

                  return (
                    <div
                      key={file.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        theme === 'light'
                          ? 'bg-zinc-50 border-zinc-200 shadow-2xs'
                          : 'bg-[#060c18] border-white/10'
                      }`}
                    >
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3 min-w-0">
                          <div
                            className={`p-2.5 rounded-xl border shrink-0 ${
                              theme === 'light'
                                ? 'bg-white border-zinc-200 text-zinc-800'
                                : 'bg-slate-900 border-slate-700 text-cyan-400'
                            }`}
                          >
                            <FileCode className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`font-mono text-sm font-bold truncate ${
                                  theme === 'light' ? 'text-zinc-950' : 'text-white'
                                }`}
                              >
                                {file.name}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${style.badgeBg}`}
                              >
                                {label}
                              </span>
                              <span className="text-[11px] font-mono text-zinc-500">
                                {formatFileSize(file.size)}
                              </span>
                            </div>
                            {file.description && (
                              <p
                                className={`text-xs mt-1 leading-snug line-clamp-2 ${
                                  theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'
                                }`}
                              >
                                {file.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {file.content && (
                            <button
                              type="button"
                              onClick={() => setExpandedCodeId(isExpanded ? null : file.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isExpanded
                                  ? theme === 'light'
                                    ? 'bg-zinc-200 border-zinc-300 text-zinc-900'
                                    : 'bg-cyan-950 border-cyan-500/50 text-cyan-300'
                                  : theme === 'light'
                                  ? 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                              }`}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-3.5 h-3.5" />
                                  <span>{t('projects.collapseCode', '접기')}</span>
                                </>
                              ) : (
                                <>
                                  <Code2 className="w-3.5 h-3.5" />
                                  <span>{t('projects.viewCode', '코드 보기')}</span>
                                </>
                              )}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => downloadCodeFile(file)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                              theme === 'light'
                                ? 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                            }`}
                            title="파일 다운로드"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{t('projects.downloadFile', '다운로드')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Expanded Interactive Code Viewer with Line Numbers & Copy Button */}
                      {isExpanded && file.content && (
                        <div className="border-t border-zinc-200 dark:border-white/10 bg-[#070d19] text-slate-200 animate-in fade-in duration-150">
                          <div className="px-4 py-2.5 bg-[#040813] border-b border-white/5 flex items-center justify-between">
                            <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="font-semibold">{file.name}</span>
                              <span className="text-slate-500">
                                ({file.content.split('\n').length} lines)
                              </span>
                            </span>

                            <button
                              type="button"
                              onClick={() => handleCopyCode(file.id, file.content!)}
                              className="px-2.5 py-1 rounded text-xs font-mono bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-semibold">{t('projects.copied', '복사됨!')}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{t('projects.copyCode', '코드 복사')}</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="p-4 overflow-x-auto max-h-96 font-mono text-xs leading-relaxed scrollbar-thin">
                            <table className="w-full border-collapse">
                              <tbody>
                                {file.content.split('\n').map((line, lIdx) => (
                                  <tr key={lIdx} className="hover:bg-white/[0.04]">
                                    <td className="pr-4 select-none text-right text-slate-600 text-[11px] font-mono w-10">
                                      {lIdx + 1}
                                    </td>
                                    <td className="text-slate-200 whitespace-pre font-mono selection:bg-cyan-500/30">
                                      {line || ' '}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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
