import React, { useState, useEffect, useRef } from 'react';
import { Upload, Link2, X, Check, AlertTriangle } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string;
  value?: string;
  onImageChange?: (imageUrl: string) => void;
  onChange?: (imageUrl: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  value,
  onImageChange,
  onChange,
  label = '이미지 설정 (Image Source)',
}) => {
  const effectiveImage = value !== undefined ? value : currentImage || '';
  const triggerChange = (newVal: string) => {
    if (onChange) onChange(newVal);
    if (onImageChange) onImageChange(newVal);
  };

  const [mode, setMode] = useState<'url' | 'upload'>('upload');
  const [urlInput, setUrlInput] = useState(effectiveImage);
  const [preview, setPreview] = useState(effectiveImage);
  const [warning, setWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(effectiveImage);
    setPreview(effectiveImage);
  }, [effectiveImage]);

  const handleUrlSubmit = () => {
    setWarning(null);
    setPreview(urlInput);
    triggerChange(urlInput);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setWarning(null);
    if (file.size > 2 * 1024 * 1024) {
      setWarning('이미지 파일 크기가 2MB를 초과하여 로딩 속도가 느려질 수 있습니다.');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreview(dataUrl);
      setUrlInput(dataUrl);
      triggerChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview('');
    setUrlInput('');
    setWarning(null);
    triggerChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
        <span>{label}</span>
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
              mode === 'upload' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            파일 업로드
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
              mode === 'url' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            이미지 URL
          </button>
        </div>
      </div>

      {warning && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[11px] font-mono">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      {mode === 'upload' ? (
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
            id="image-file-input"
          />
          <label
            htmlFor="image-file-input"
            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-cyan-500/30 bg-[#060e1f]/60 hover:bg-cyan-950/30 hover:border-cyan-400/60 cursor-pointer transition-all text-xs font-mono text-slate-300"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>로컬 기기에서 로봇/대회 사진 업로드하기</span>
          </label>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/robot-image.jpg"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060e1f] border border-cyan-500/30 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:bg-cyan-900 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> 적용
          </button>
        </div>
      )}

      {/* Preview Box */}
      {preview && (
        <div className="relative mt-2 aspect-video max-h-40 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950 flex items-center justify-center">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-rose-400 hover:text-rose-300 border border-rose-500/40 transition-all cursor-pointer"
            title="이미지 제거"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
