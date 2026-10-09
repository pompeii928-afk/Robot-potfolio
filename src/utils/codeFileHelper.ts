import { ProjectCodeFile } from '../types';

/**
 * Detect language from file extension or file name
 */
export function detectLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'py':
    case 'python':
      return 'python';
    case 'cpp':
    case 'cxx':
    case 'cc':
    case 'hpp':
    case 'h':
      return 'cpp';
    case 'c':
      return 'c';
    case 'ino':
    case 'pde':
      return 'arduino';
    case 'json':
      return 'json';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'sh':
    case 'bash':
      return 'shell';
    case 'md':
    case 'markdown':
      return 'markdown';
    case 'urdf':
    case 'xacro':
    case 'xml':
      return 'xml';
    case 'txt':
    case 'log':
      return 'text';
    case 'zip':
    case 'tar':
    case 'gz':
      return 'archive';
    default:
      return ext || 'text';
  }
}

/**
 * Pretty language label for UI badges
 */
export function getLanguageLabel(lang?: string): string {
  if (!lang) return 'FILE';
  const l = lang.toLowerCase();
  switch (l) {
    case 'python':
      return 'PYTHON';
    case 'cpp':
      return 'C++';
    case 'c':
      return 'C';
    case 'arduino':
      return 'ARDUINO';
    case 'json':
      return 'JSON';
    case 'yaml':
      return 'YAML';
    case 'typescript':
      return 'TYPESCRIPT';
    case 'javascript':
      return 'JAVASCRIPT';
    case 'shell':
      return 'BASH / SH';
    case 'markdown':
      return 'MARKDOWN';
    case 'xml':
      return 'XML / URDF';
    case 'text':
      return 'TEXT';
    case 'archive':
      return 'ARCHIVE';
    default:
      return l.toUpperCase();
  }
}

/**
 * Visual styling theme per language
 */
export function getLanguageStyle(lang?: string): {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
} {
  const l = (lang || '').toLowerCase();
  switch (l) {
    case 'python':
      return {
        bg: 'bg-blue-950/40',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      };
    case 'cpp':
    case 'c':
      return {
        bg: 'bg-cyan-950/40',
        text: 'text-cyan-300',
        border: 'border-cyan-500/30',
        badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      };
    case 'arduino':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-300',
        border: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      };
    case 'json':
    case 'yaml':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-300',
        border: 'border-amber-500/30',
        badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      };
    case 'shell':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      };
    case 'markdown':
    case 'text':
      return {
        bg: 'bg-zinc-900',
        text: 'text-zinc-300',
        border: 'border-zinc-700',
        badgeBg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      };
    default:
      return {
        bg: 'bg-indigo-950/40',
        text: 'text-indigo-300',
        border: 'border-indigo-500/30',
        badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      };
  }
}

/**
 * Format bytes to readable size
 */
export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Trigger file download directly in browser
 */
export function downloadCodeFile(file: ProjectCodeFile) {
  try {
    let url = file.dataUrl;

    if (!url && file.content) {
      const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
      url = URL.createObjectURL(blob);
    }

    if (!url) {
      console.warn('No file content or download URL available');
      return;
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'code_file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // If temporary object url was created, revoke it after a delay
    if (!file.dataUrl && url) {
      setTimeout(() => URL.revokeObjectURL(url!), 1000);
    }
  } catch (err) {
    console.error('Download error:', err);
  }
}

/**
 * Process a user-selected File object into a ProjectCodeFile
 */
export async function processUploadedFile(
  file: File,
  description?: string
): Promise<ProjectCodeFile> {
  const isBinary = isLikelyBinary(file.name);
  const detectedLang = detectLanguage(file.name);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (isBinary) {
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          language: detectedLang,
          description: description || '',
          dataUrl: dataUrl,
          uploadedAt: new Date().toISOString(),
        });
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    } else {
      reader.onload = () => {
        const textContent = (reader.result as string) || '';
        // Also create a dataUrl so it can be downloaded directly
        const blob = new Blob([textContent], { type: file.type || 'text/plain;charset=utf-8' });
        const dataUrl = URL.createObjectURL(blob);

        resolve({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          language: detectedLang,
          description: description || '',
          content: textContent,
          dataUrl: dataUrl,
          uploadedAt: new Date().toISOString(),
        });
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    }
  });
}

function isLikelyBinary(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const binaryExtensions = ['zip', 'tar', 'gz', 'bin', 'hex', 'pdf', 'png', 'jpg', 'jpeg', 'webp', 'stl', 'step', 'obj'];
  return binaryExtensions.includes(ext);
}
