import React, { useState, useEffect, useRef } from 'react';
import { Upload, Link2, X, Check, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { optimizeImageFile, formatBytes } from '../utils/imageOptimizer';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(effectiveImage);
    setPreview(effectiveImage);
  }, [effectiveImage]);

  const handleUrlSubmit = () => {
    setError(null);
    setCompressionInfo(null);
    setPreview(urlInput);
    triggerChange(urlInput);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setCompressionInfo(null);
    setIsProcessing(true);

    try {
      // Automatically optimize & compress to < 200KB for fast Firestore sync
      const result = await optimizeImageFile(file, 1200, 1200, 0.8);

      setPreview(result.dataUrl);
      setUrlInput(result.dataUrl);
      triggerChange(result.dataUrl);

      setCompressionInfo(
        `최적화 완료 (${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)}, ${result.width}x${result.height}px)`
      );
    } catch (err: any) {
      console.error('Image compression error:', err);
      setError(err?.message || '이미지 압축 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setPreview('');
    setUrlInput('');
    setCompressionInfo(null);
    setError(null);
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

      {error && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[11px] font-mono">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {compressionInfo && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
          <span>{compressionInfo}</span>
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
            disabled={isProcessing}
          />
          <label
            htmlFor="image-file-input"
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-cyan-500/30 bg-[#060e1f]/60 hover:bg-cyan-950/30 hover:border-cyan-400/60 transition-all text-xs font-mono text-slate-300 ${
              isProcessing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>이미지 최적화 및 압축 중...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>로컬 기기에서 로봇/대회 사진 업로드하기 (자동 최적화)</span>
              </>
            )}
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
        <div className="relative mt-2 aspect-video max-h-48 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950 flex items-center justify-center group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-rose-400 hover:text-rose-300 border border-rose-500/40 transition-all cursor-pointer shadow-lg"
            title="이미지 제거"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
