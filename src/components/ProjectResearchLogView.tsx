import React, { useState } from 'react';
import {
  FlaskConical,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Check,
  Code2,
  Target,
  Activity,
  ArrowRight,
  TrendingUp,
  X,
  FileText,
  Terminal,
} from 'lucide-react';
import { ProjectItem, ProjectResearchLog } from '../types';
import { useToast } from './Toast';

interface ProjectResearchLogViewProps {
  project: ProjectItem;
  isAdmin?: boolean;
  onUpdateProject?: (updated: ProjectItem) => Promise<void>;
  theme?: 'light' | 'dark';
}

const CATEGORY_MAP: Record<string, { label: string; bgLight: string; textLight: string; borderLight: string; bgDark: string; textDark: string; borderDark: string }> = {
  CALIBRATION: {
    label: '캘리브레이션 (Calibration)',
    bgLight: 'bg-emerald-50',
    textLight: 'text-emerald-700',
    borderLight: 'border-emerald-200',
    bgDark: 'bg-emerald-950/50',
    textDark: 'text-emerald-300',
    borderDark: 'border-emerald-800/50',
  },
  ALGORITHM: {
    label: '알고리즘 융합 (Algorithm)',
    bgLight: 'bg-cyan-50',
    textLight: 'text-cyan-700',
    borderLight: 'border-cyan-200',
    bgDark: 'bg-cyan-950/50',
    textDark: 'text-cyan-300',
    borderDark: 'border-cyan-800/50',
  },
  TROUBLESHOOTING: {
    label: '슬립 보정 & 트러블슈팅',
    bgLight: 'bg-amber-50',
    textLight: 'text-amber-700',
    borderLight: 'border-amber-200',
    bgDark: 'bg-amber-950/50',
    textDark: 'text-amber-300',
    borderDark: 'border-amber-800/50',
  },
  TEST_RUN: {
    label: '실전 주행 검증 (Test Run)',
    bgLight: 'bg-purple-50',
    textLight: 'text-purple-700',
    borderLight: 'border-purple-200',
    bgDark: 'bg-purple-950/50',
    textDark: 'text-purple-300',
    borderDark: 'border-purple-800/50',
  },
  HARDWARE: {
    label: '하드웨어 & 기구 (Hardware)',
    bgLight: 'bg-blue-50',
    textLight: 'text-blue-700',
    borderLight: 'border-blue-200',
    bgDark: 'bg-blue-950/50',
    textDark: 'text-blue-300',
    borderDark: 'border-blue-800/50',
  },
};

const getCategoryMeta = (cat?: string) => {
  if (!cat) return CATEGORY_MAP.ALGORITHM;
  return CATEGORY_MAP[cat.toUpperCase()] || {
    label: cat,
    bgLight: 'bg-zinc-100',
    textLight: 'text-zinc-700',
    borderLight: 'border-zinc-200',
    bgDark: 'bg-zinc-900',
    textDark: 'text-zinc-300',
    borderDark: 'border-zinc-800',
  };
};

export const ProjectResearchLogView: React.FC<ProjectResearchLogViewProps> = ({
  project,
  isAdmin = false,
  onUpdateProject,
  theme = 'light',
}) => {
  const { showToast } = useToast();
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  // Edit / Create Log Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [logFormData, setLogFormData] = useState<Partial<ProjectResearchLog>>({
    date: new Date().toISOString().slice(0, 10),
    title: '',
    category: 'CALIBRATION',
    status: 'COMPLETED',
    author: 'K.F.C. Robotics Lab',
    objective: '',
    process: '',
    results: '',
    nextAction: '',
    metrics: [{ label: '', value: '', unit: '' }],
    codeSnippet: '',
    codeLanguage: 'python',
  });

  const [metricLabel, setMetricLabel] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [metricUnit, setMetricUnit] = useState('');

  // Delete Confirmation State
  const [logToDelete, setLogToDelete] = useState<ProjectResearchLog | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const logs: ProjectResearchLog[] = project.researchLogs || [];

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (activeCategoryFilter === 'ALL') return true;
    return (log.category || '').toUpperCase() === activeCategoryFilter;
  });

  const handleCopyCode = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCodeId(id);
      showToast('코드가 클립보드에 복사되었습니다.', 'success', '복사 완료');
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch {
      showToast('코드 복사에 실패했습니다.', 'error', '오류');
    }
  };

  const openNewLogModal = () => {
    setEditingLogId(null);
    setLogFormData({
      id: `log-odom-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title: '',
      category: 'CALIBRATION',
      status: 'COMPLETED',
      author: '배지훈 (ODOM Lead)',
      objective: '',
      process: '',
      results: '',
      nextAction: '',
      metrics: [],
      codeSnippet: '',
      codeLanguage: 'python',
    });
    setMetricLabel('');
    setMetricValue('');
    setMetricUnit('');
    setIsEditorOpen(true);
  };

  const openEditLogModal = (log: ProjectResearchLog) => {
    setEditingLogId(log.id);
    setLogFormData({
      ...log,
      metrics: log.metrics ? [...log.metrics] : [],
    });
    setMetricLabel('');
    setMetricValue('');
    setMetricUnit('');
    setIsEditorOpen(true);
  };

  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateProject) return;
    if (!logFormData.title?.trim() || !logFormData.objective?.trim()) {
      showToast('제목과 연구 목적을 입력해주세요.', 'info', '필수 입력 누락');
      return;
    }

    setIsSaving(true);
    try {
      const targetId = editingLogId || logFormData.id || `log-odom-${Date.now()}`;
      const updatedLog: ProjectResearchLog = {
        id: targetId,
        date: logFormData.date || new Date().toISOString().slice(0, 10),
        title: logFormData.title.trim(),
        category: logFormData.category || 'CALIBRATION',
        status: (logFormData.status as any) || 'COMPLETED',
        author: logFormData.author?.trim() || 'K.F.C. Robotics Lab',
        objective: logFormData.objective.trim(),
        process: logFormData.process?.trim() || '',
        results: logFormData.results?.trim() || '',
        nextAction: logFormData.nextAction?.trim() || '',
        metrics: logFormData.metrics || [],
        codeSnippet: logFormData.codeSnippet?.trim() || '',
        codeLanguage: logFormData.codeLanguage || 'python',
        updatedAt: new Date().toISOString(),
      };

      let newLogs: ProjectResearchLog[];
      if (editingLogId) {
        newLogs = logs.map((l) => (l.id === editingLogId ? updatedLog : l));
      } else {
        newLogs = [updatedLog, ...logs];
      }

      // Sort logs chronologically descending or by date
      newLogs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      const updatedProject: ProjectItem = {
        ...project,
        projectType: 'research-log',
        researchLogs: newLogs,
        updatedAt: new Date().toISOString(),
      };

      await onUpdateProject(updatedProject);
      setIsEditorOpen(false);
      showToast(
        editingLogId ? '연구 일지가 성공적으로 수정되었습니다.' : '새 연구 일지가 등록되었습니다.',
        'success',
        '저장 완료'
      );
    } catch (err) {
      console.error(err);
      showToast('연구 일지 저장에 실패했습니다.', 'error', '오류 발생');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    if (!onUpdateProject) return;
    setIsSaving(true);
    try {
      const newLogs = logs.filter((l) => l.id !== logId);
      const updatedProject: ProjectItem = {
        ...project,
        researchLogs: newLogs,
        updatedAt: new Date().toISOString(),
      };

      await onUpdateProject(updatedProject);
      setLogToDelete(null);
      showToast('연구 일지가 삭제되었습니다.', 'info', '삭제 완료');
    } catch (err) {
      console.error(err);
      showToast('연구 일지 삭제에 실패했습니다.', 'error', '오류 발생');
    } finally {
      setIsSaving(false);
    }
  };

  const addMetricRow = () => {
    if (!metricLabel.trim() || !metricValue.trim()) return;
    setLogFormData((prev) => ({
      ...prev,
      metrics: [
        ...(prev.metrics || []),
        { label: metricLabel.trim(), value: metricValue.trim(), unit: metricUnit.trim() },
      ],
    }));
    setMetricLabel('');
    setMetricValue('');
    setMetricUnit('');
  };

  const removeMetricRow = (index: number) => {
    setLogFormData((prev) => ({
      ...prev,
      metrics: (prev.metrics || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Research Log Header & Stats Banner */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition-all ${
          theme === 'light'
            ? 'bg-gradient-to-br from-zinc-50 via-white to-cyan-50/30 border-zinc-200 text-zinc-900 shadow-xs'
            : 'bg-gradient-to-br from-[#070e1c] via-[#09152b] to-[#040813] border-cyan-500/20 text-white shadow-lg'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <FlaskConical className="w-4 h-4" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                {project.projectId?.replace('PROJECT_ID: ', '') || 'ODOM RESEARCH LAB'} // RESEARCH JOURNAL
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
              {project.title} · 연구 일지
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans">
              {project.summary || '프로젝트 연구 및 실험 과정을 날짜별 가설과 결과 데이터로 체계적으로 아카이빙합니다.'}
            </p>
          </div>

          {/* Admin Action: Add New Research Log */}
          {isAdmin && (
            <button
              onClick={openNewLogModal}
              id="admin-add-research-log-btn"
              className="px-4 py-2.5 rounded-xl bg-black dark:bg-cyan-500 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-cyan-400 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ 새 연구 일지 작성</span>
            </button>
          )}
        </div>

        {/* Dynamic Project Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-zinc-200 dark:border-white/10 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-black/30 border border-zinc-200/80 dark:border-white/10">
            <span className="text-[10px] text-zinc-500 block uppercase">총 기록된 일지</span>
            <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
              {logs.length} <span className="text-xs font-normal text-zinc-500">Entries</span>
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-black/30 border border-zinc-200/80 dark:border-white/10">
            <span className="text-[10px] text-zinc-500 block uppercase">최신 연구 일자</span>
            <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
              {logs[0]?.date || '미작성'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-black/30 border border-zinc-200/80 dark:border-white/10">
            <span className="text-[10px] text-zinc-500 block uppercase">프로젝트 상태</span>
            <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
              {project.status || 'COMPLETED'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-black/30 border border-zinc-200/80 dark:border-white/10">
            <span className="text-[10px] text-zinc-500 block uppercase">일지 편집 권한</span>
            <span className="text-sm sm:text-base font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
              {isAdmin ? 'ADMIN (작성/수정 가능)' : 'VIEW ONLY'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
        <button
          onClick={() => setActiveCategoryFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeCategoryFilter === 'ALL'
              ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs'
              : 'bg-zinc-100 text-zinc-600 hover:text-black dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          전체 보기 ({logs.length})
        </button>
        {Object.entries(CATEGORY_MAP).map(([key, meta]) => {
          const count = logs.filter((l) => (l.category || '').toUpperCase() === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveCategoryFilter(key)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeCategoryFilter === key
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-black dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Research Logs Chronological Timeline */}
      <div className="relative pl-4 sm:pl-6 border-l-2 border-zinc-200 dark:border-white/10 space-y-6 sm:space-y-8 my-6">
        {filteredLogs.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-black/20 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-white">
              {activeCategoryFilter === 'ALL'
                ? '연구 일지 형식이 준비되었습니다.'
                : '선택한 카테고리의 연구 일지가 아직 없습니다.'}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              임의의 가짜 데이터 없이 처음부터 직접 연구 내용을 작성할 수 있는 클린 템플릿입니다.
              실험 목적, 주행 및 알고리즘 과정, 측정 오차 수치, 코드를 어드민에서 자유롭게 기록해보세요.
            </p>
            {isAdmin && (
              <div className="pt-2">
                <button
                  onClick={openNewLogModal}
                  className="px-5 py-2.5 rounded-xl bg-black dark:bg-cyan-500 text-white dark:text-black font-mono text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ 첫 번째 연구 일지 작성하기</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const catMeta = getCategoryMeta(log.category);
            const isCompleted = log.status === 'COMPLETED';
            const isInProgress = log.status === 'IN_PROGRESS';

            return (
              <div key={log.id} className="relative group">
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute -left-[23px] sm:-left-[31px] top-4 w-3.5 h-3.5 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-emerald-500 border-white dark:border-zinc-950 ring-2 ring-emerald-500/20'
                      : isInProgress
                      ? 'bg-cyan-500 border-white dark:border-zinc-950 ring-2 ring-cyan-500/40 animate-pulse'
                      : 'bg-zinc-400 border-white dark:border-zinc-950'
                  }`}
                />

                {/* Main Card Container */}
                <div
                  className={`rounded-2xl border p-5 sm:p-7 transition-all duration-300 ${
                    theme === 'light'
                      ? 'bg-white border-zinc-200/90 text-zinc-900 shadow-xs hover:border-zinc-400/80 hover:shadow-md'
                      : 'bg-[#081224] border-white/10 text-zinc-200 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                  }`}
                >
                  {/* Card Header: Date, Category, Status, Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-white/10">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Date Badge */}
                      <span className="font-mono text-xs font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-white/10">
                        <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>{log.date}</span>
                      </span>

                      {/* Category Tag */}
                      <span
                        className={`font-mono text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                          theme === 'light'
                            ? `${catMeta.bgLight} ${catMeta.textLight} ${catMeta.borderLight}`
                            : `${catMeta.bgDark} ${catMeta.textDark} ${catMeta.borderDark}`
                        }`}
                      >
                        {catMeta.label}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : isInProgress
                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> 완료
                          </>
                        ) : isInProgress ? (
                          <>
                            <Clock className="w-3 h-3 animate-spin" /> 실험 진행 중
                          </>
                        ) : (
                          '검증 대기'
                        )}
                      </span>
                    </div>

                    {/* Admin Action Controls (Edit / Delete) */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditLogModal(log)}
                          className="px-2.5 py-1 rounded-md text-xs font-mono font-bold flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                          title="일지 수정"
                        >
                          <Edit3 className="w-3 h-3" /> 수정
                        </button>
                        <button
                          onClick={() => setLogToDelete(log)}
                          className="p-1.5 rounded-md text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="일지 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title & Author */}
                  <div className="mt-3.5 mb-4">
                    <h4 className="text-base sm:text-lg font-black font-sans tracking-tight text-zinc-950 dark:text-white">
                      {log.title}
                    </h4>
                    {log.author && (
                      <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 block">
                        연구 담당: {log.author}
                      </span>
                    )}
                  </div>

                  {/* Structured Research Sections */}
                  <div className="space-y-4 text-xs sm:text-sm font-sans leading-relaxed">
                    {/* 1. Objective & Hypothesis */}
                    <div
                      className={`p-3.5 rounded-xl border ${
                        theme === 'light'
                          ? 'bg-zinc-50/70 border-zinc-200/80'
                          : 'bg-[#050c18] border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>[ 연구 목적 및 가설 // OBJECTIVE ]</span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line pl-1">
                        {log.objective}
                      </p>
                    </div>

                    {/* 2. Process & Implementation */}
                    {log.process && (
                      <div
                        className={`p-3.5 rounded-xl border ${
                          theme === 'light'
                            ? 'bg-zinc-50/70 border-zinc-200/80'
                            : 'bg-[#050c18] border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-1.5">
                          <Activity className="w-3.5 h-3.5" />
                          <span>[ 실험 및 구현 과정 // METHOD &amp; PROCESS ]</span>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line pl-1">
                          {log.process}
                        </p>
                      </div>
                    )}

                    {/* 3. Findings & Results */}
                    {log.results && (
                      <div
                        className={`p-3.5 rounded-xl border ${
                          theme === 'light'
                            ? 'bg-zinc-50/70 border-zinc-200/80'
                            : 'bg-[#050c18] border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>[ 측정 결과 및 데이터 분석 // FINDINGS &amp; RESULTS ]</span>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line pl-1">
                          {log.results}
                        </p>
                      </div>
                    )}

                    {/* Key Metrics Grid */}
                    {log.metrics && log.metrics.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase block mb-2">
                          실험 측정 데이터 (Key Metrics):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {log.metrics.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className={`p-3 rounded-xl border text-center font-mono ${
                                theme === 'light'
                                  ? 'bg-white border-zinc-200 text-zinc-900 shadow-2xs'
                                  : 'bg-black/40 border-cyan-500/20 text-white'
                              }`}
                            >
                              <span className="text-[10px] text-zinc-500 block truncate">
                                {m.label}
                              </span>
                              <span className="text-base sm:text-lg font-black text-cyan-600 dark:text-cyan-400">
                                {m.value}{' '}
                                {m.unit && <span className="text-xs font-normal text-zinc-500">{m.unit}</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Code Snippet Box */}
                    {log.codeSnippet && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-[#070b14] text-white">
                        <div className="px-3.5 py-2 bg-black/60 border-b border-white/10 flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>CODE / TELEMETRY LOG ({log.codeLanguage || 'cpp'})</span>
                          </div>
                          <button
                            onClick={() => handleCopyCode(log.id, log.codeSnippet || '')}
                            className="px-2 py-0.5 rounded text-[11px] bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            {copiedCodeId === log.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" /> 복사됨
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> 코드 복사
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3.5 font-mono text-xs overflow-x-auto text-zinc-300 leading-relaxed max-h-56 scrollbar-thin">
                          <code>{log.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* Next Action / Lessons */}
                    {log.nextAction && (
                      <div className="pt-2 flex items-start gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-black/20 p-3 rounded-xl border border-zinc-200/60 dark:border-white/5">
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-zinc-900 dark:text-white mr-1.5">후속 조치:</span>
                          <span>{log.nextAction}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Admin Log Editor Modal */}
      {isEditorOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsEditorOpen(false)}
        >
          <div
            className={`w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden outline-none ${
              theme === 'light'
                ? 'bg-white border-zinc-200 text-zinc-900'
                : 'bg-[#070e1c] border-cyan-500/30 text-white'
            } animate-in zoom-in-95 duration-150`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-500" />
                <h3 className="font-sans font-black text-base sm:text-lg">
                  {editingLogId ? '연구 일지 수정' : '새 연구 일지 작성 (Admin Only)'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveLog} className="p-6 overflow-y-auto space-y-4 max-h-[calc(92vh-130px)]">
              {/* Date & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                    실험 일자 (Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={logFormData.date}
                    onChange={(e) => setLogFormData({ ...logFormData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-black/40 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                    일지 제목 (Title) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 휠 직경 오차 측정 및 엔코더 펄스(CPR) 보정 캘리브레이션"
                    value={logFormData.title}
                    onChange={(e) => setLogFormData({ ...logFormData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-black/40 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Category, Status, Author */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                    연구 분류 (Category)
                  </label>
                  <select
                    value={logFormData.category}
                    onChange={(e) => setLogFormData({ ...logFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-black/40 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="CALIBRATION">캘리브레이션 (Calibration)</option>
                    <option value="ALGORITHM">알고리즘 융합 (Algorithm)</option>
                    <option value="TROUBLESHOOTING">슬립 보정 &amp; 트러블슈팅</option>
                    <option value="TEST_RUN">실전 주행 검증 (Test Run)</option>
                    <option value="HARDWARE">하드웨어 &amp; 기구 (Hardware)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                    진행 상태 (Status)
                  </label>
                  <select
                    value={logFormData.status}
                    onChange={(e) => setLogFormData({ ...logFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-black/40 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="COMPLETED">완료 (Completed)</option>
                    <option value="IN_PROGRESS">실험 진행 중 (In Progress)</option>
                    <option value="PENDING">검증 대기 (Pending)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                    연구 담당 (Author)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 배지훈 (ODOM Lead)"
                    value={logFormData.author}
                    onChange={(e) => setLogFormData({ ...logFormData, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-black/40 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Objective */}
              <div>
                <label className="block text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                  1. 연구 목적 및 가설 (Objective &amp; Hypothesis) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="실험을 진행하는 이유, 달성하고자 하는 목표치 및 사전 가설을 작성하세요."
                  value={logFormData.objective}
                  onChange={(e) => setLogFormData({ ...logFormData, objective: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-black/40 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                />
              </div>

              {/* Process */}
              <div>
                <label className="block text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                  2. 실험 및 구현 과정 (Method &amp; Implementation)
                </label>
                <textarea
                  rows={3}
                  placeholder="실험 진행 절차, 센서 셋업, 적용된 수식 또는 알고리즘 로직을 작성하세요."
                  value={logFormData.process}
                  onChange={(e) => setLogFormData({ ...logFormData, process: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-black/40 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                />
              </div>

              {/* Results */}
              <div>
                <label className="block text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                  3. 측정 결과 및 데이터 분석 (Findings &amp; Results)
                </label>
                <textarea
                  rows={2}
                  placeholder="실험 결과 도출된 수치, 오차율, 기존 방식 대비 개선점 등을 작성하세요."
                  value={logFormData.results}
                  onChange={(e) => setLogFormData({ ...logFormData, results: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-black/40 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                />
              </div>

              {/* Dynamic Metrics Builder */}
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-black/20 space-y-2">
                <span className="block text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  핵심 측정 지표 추가 (Key Metrics)
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="라벨 (예: 10m 누적 오차)"
                    value={metricLabel}
                    onChange={(e) => setMetricLabel(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-white/15 bg-white dark:bg-black/40 text-xs font-mono"
                  />
                  <input
                    type="text"
                    placeholder="수치 (예: 1.8cm)"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-white/15 bg-white dark:bg-black/40 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={addMetricRow}
                    className="px-3 py-1.5 rounded-lg bg-black text-white dark:bg-cyan-500 dark:text-black font-mono text-xs font-bold cursor-pointer"
                  >
                    + 추가
                  </button>
                </div>
                {logFormData.metrics && logFormData.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {logFormData.metrics.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-zinc-200 dark:bg-zinc-800 text-xs font-mono flex items-center gap-1.5"
                      >
                        <span className="text-zinc-600 dark:text-zinc-400">{m.label}:</span>
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">{m.value}</span>
                        <button
                          type="button"
                          onClick={() => removeMetricRow(idx)}
                          className="hover:text-rose-500 ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Code Snippet */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    관련 알고리즘 코드 / 로그 스니펫 (선택)
                  </label>
                  <select
                    value={logFormData.codeLanguage}
                    onChange={(e) => setLogFormData({ ...logFormData, codeLanguage: e.target.value })}
                    className="text-[11px] font-mono px-2 py-0.5 rounded border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-black/40"
                  >
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="arduino">Arduino</option>
                    <option value="bash">Bash / ROS</option>
                    <option value="json">JSON / Log</option>
                  </select>
                </div>
                <textarea
                  rows={4}
                  placeholder="// 핵심 알고리즘 계산 수식 또는 텔레메트리 로그를 붙여넣으세요"
                  value={logFormData.codeSnippet}
                  onChange={(e) => setLogFormData({ ...logFormData, codeSnippet: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-white/15 bg-[#050c18] text-zinc-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none font-mono"
                />
              </div>

              {/* Next Action */}
              <div>
                <label className="block text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                  4. 후속 조치 및 차기 실험 과제 (Next Action)
                </label>
                <input
                  type="text"
                  placeholder="예: 2026 시즌 자율주행 라인트레이서 및 메카넘 4WD 차체로 오도메트리 펌웨어 포팅."
                  value={logFormData.nextAction}
                  onChange={(e) => setLogFormData({ ...logFormData, nextAction: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-black/40 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-white/20 text-xs font-mono hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-black dark:bg-cyan-500 text-white dark:text-black font-mono text-xs font-bold hover:bg-zinc-800 dark:hover:bg-cyan-400 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : editingLogId ? '수정 내용 저장' : '연구 일지 발행'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {logToDelete && (
        <div
          className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLogToDelete(null)}
        >
          <div
            className={`w-full max-w-sm p-6 rounded-2xl border shadow-2xl ${
              theme === 'light' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#0b1320] border-white/10 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-sans font-bold text-base mb-2">연구 일지 삭제</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-5 leading-relaxed">
              정말로 <span className="font-bold text-rose-500">"{logToDelete.title}"</span> 일지를 삭제하시겠습니까? 삭제된 일지는 복구할 수 없습니다.
            </p>
            <div className="flex items-center justify-end gap-2.5 font-mono text-xs">
              <button
                onClick={() => setLogToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => handleDeleteLog(logToDelete.id)}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors cursor-pointer"
              >
                {isSaving ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
