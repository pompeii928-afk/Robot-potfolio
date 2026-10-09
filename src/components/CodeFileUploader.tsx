import React, { useState, useRef } from 'react';
import {
  FileCode,
  Upload,
  Plus,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Code2,
  AlertCircle,
  FileText,
  X,
  Check,
} from 'lucide-react';
import { ProjectCodeFile } from '../types';
import {
  detectLanguage,
  formatFileSize,
  getLanguageLabel,
  getLanguageStyle,
  downloadCodeFile,
  processUploadedFile,
} from '../utils/codeFileHelper';

interface CodeFileUploaderProps {
  files: ProjectCodeFile[];
  onChange: (files: ProjectCodeFile[]) => void;
  maxFiles?: number;
}

export const CodeFileUploader: React.FC<CodeFileUploaderProps> = ({
  files = [],
  onChange,
  maxFiles = 10,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualFileName, setManualFileName] = useState('');
  const [manualLanguage, setManualLanguage] = useState('python');
  const [manualDescription, setManualDescription] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const newFiles: ProjectCodeFile[] = [...files];

    for (let i = 0; i < fileList.length; i++) {
      if (newFiles.length >= maxFiles) {
        setError(`최대 ${maxFiles}개의 파일까지 등록할 수 있습니다.`);
        break;
      }
      const file = fileList[i];
      if (file.size > 2 * 1024 * 1024) {
        setError(`파일 크기가 2MB를 초과했습니다: ${file.name}`);
        continue;
      }

      try {
        const processed = await processUploadedFile(file);
        newFiles.push(processed);
      } catch (err) {
        console.error('Failed to process file:', err);
        setError(`파일 읽기 실패: ${file.name}`);
      }
    }

    onChange(newFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = (id: string) => {
    onChange(files.filter((f) => f.id !== id));
    if (previewingId === id) setPreviewingId(null);
  };

  const handleAddManualFile = () => {
    if (!manualFileName.trim()) {
      setError('파일 이름을 입력해주세요 (예: main.py).');
      return;
    }

    const detectedLang = manualLanguage || detectLanguage(manualFileName);
    const blob = new Blob([manualContent], { type: 'text/plain;charset=utf-8' });
    const dataUrl = URL.createObjectURL(blob);

    const newFile: ProjectCodeFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: manualFileName.trim(),
      language: detectedLang,
      description: manualDescription.trim(),
      content: manualContent,
      size: new Blob([manualContent]).size,
      dataUrl,
      uploadedAt: new Date().toISOString(),
    };

    onChange([...files, newFile]);

    // Reset manual form
    setManualFileName('');
    setManualDescription('');
    setManualContent('');
    setShowManualForm(false);
    setError(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 font-semibold">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>소스 코드 및 첨부 파일 (Code & Engineering Files)</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300">
            {files.length}개
          </span>
        </label>

        <button
          type="button"
          onClick={() => setShowManualForm(!showManualForm)}
          className="text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/30 cursor-pointer transition-colors"
        >
          {showManualForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{showManualForm ? '작성 닫기' : '직접 코드 작성'}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Manual Code Input Panel */}
      {showManualForm && (
        <div className="p-4 rounded-xl bg-[#030814] border border-cyan-500/40 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>새 코드 파일 직접 작성 / 붙여넣기</span>
            </span>
            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                파일 이름 (File Name) *
              </label>
              <input
                type="text"
                value={manualFileName}
                onChange={(e) => {
                  setManualFileName(e.target.value);
                  const l = detectLanguage(e.target.value);
                  if (l) setManualLanguage(l);
                }}
                placeholder="예: pid_controller.py"
                className="w-full px-3 py-1.5 rounded-lg bg-[#081224] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                언어 / 포맷 (Language)
              </label>
              <select
                value={manualLanguage}
                onChange={(e) => setManualLanguage(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#081224] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="python">Python (.py)</option>
                <option value="cpp">C++ (.cpp / .hpp)</option>
                <option value="c">C (.c / .h)</option>
                <option value="arduino">Arduino (.ino)</option>
                <option value="json">JSON (.json)</option>
                <option value="yaml">YAML (.yaml / .yml)</option>
                <option value="shell">Shell / Bash (.sh)</option>
                <option value="typescript">TypeScript (.ts / .tsx)</option>
                <option value="javascript">JavaScript (.js)</option>
                <option value="markdown">Markdown (.md)</option>
                <option value="xml">XML / URDF (.urdf / .xml)</option>
                <option value="text">Text (.txt)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              파일 설명 / 역할 (Description - Optional)
            </label>
            <input
              type="text"
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
              placeholder="예: 듀얼 컬러 센서 샘플링 및 PID 제어 루프"
              className="w-full px-3 py-1.5 rounded-lg bg-[#081224] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              소스 코드 내용 (Code Content)
            </label>
            <textarea
              rows={8}
              value={manualContent}
              onChange={(e) => setManualContent(e.target.value)}
              placeholder="# 여기에 소스 코드를 입력하거나 붙여넣으세요..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050c1a] border border-slate-700 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-cyan-400 resize-y"
              spellCheck={false}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:text-white"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleAddManualFile}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> 코드 파일 등록
            </button>
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 scale-[0.99]'
            : 'border-cyan-500/30 hover:border-cyan-400/70 bg-[#050c1a]/80 hover:bg-[#07132a] text-slate-400'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={(e) => handleFilesSelected(e.target.files)}
          accept=".py,.cpp,.c,.h,.hpp,.ino,.json,.yaml,.yml,.txt,.md,.sh,.urdf,.xml,.zip,.csv,.ts,.js"
          className="hidden"
        />

        <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Upload className="w-5 h-5" />
        </div>

        <div>
          <p className="text-xs font-mono text-cyan-300 font-semibold">
            코드 파일 클릭하여 선택 또는 여기로 드래그 앤 드롭
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            지원 형식: Python (.py), C/C++ (.cpp, .h), Arduino (.ino), JSON, YAML, Shell (.sh), ZIP 등
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-mono text-slate-400">
            등록된 파일 목록 ({files.length}개)
          </div>
          <div className="space-y-2">
            {files.map((file) => {
              const style = getLanguageStyle(file.language);
              const label = getLanguageLabel(file.language);
              const isPreviewOpen = previewingId === file.id;

              return (
                <div
                  key={file.id}
                  className="rounded-xl bg-[#050c1a] border border-cyan-500/25 overflow-hidden transition-colors"
                >
                  <div className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 shrink-0">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-white truncate max-w-[200px] sm:max-w-[320px]">
                            {file.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${style.badgeBg}`}
                          >
                            {label}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                        {file.description && (
                          <p className="text-[11px] text-slate-300 truncate mt-0.5">
                            {file.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {file.content && (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewingId(isPreviewOpen ? null : file.id)
                          }
                          className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                          title={isPreviewOpen ? '코드 접기' : '코드 미리보기'}
                        >
                          {isPreviewOpen ? (
                            <EyeOff className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => downloadCodeFile(file)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="파일 다운로드"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 transition-colors cursor-pointer"
                        title="파일 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Code Preview */}
                  {isPreviewOpen && file.content && (
                    <div className="border-t border-cyan-500/20 bg-[#02050e] p-3 text-xs font-mono max-h-56 overflow-y-auto">
                      <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {file.content}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
