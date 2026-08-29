import React, { useState, useEffect, useRef } from 'react';
import { Upload, Link2, X, Check, AlertTriangle, Sparkles, Loader2, Youtube, Image as ImageIcon } from 'lucide-react';
import { optimizeImageFile, formatBytes } from '../utils/imageOptimizer';
import { extractVideoId, getYouTubeThumbnail } from '../utils/youtubeHelper';

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

  const [mode, setMode] = useState<'upload' | 'url'>('upload');
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

  const handleUrlInputChange = (val: string) => {
    setUrlInput(val);
    setError(null);
    setCompressionInfo(null);

    const trimmed = val.trim();
    if (!trimmed) {
      setPreview('');
      triggerChange('');
      return;
    }

    // Smart YouTube thumbnail extraction: if user pastes a YouTube URL
    const ytVideoId = extractVideoId(trimmed);
    if (ytVideoId) {
      const ytThumb = getYouTubeThumbnail(ytVideoId);
      setPreview(ytThumb);
      triggerChange(ytThumb);
      setCompressionInfo('YouTube 영상 썸네일이 자동으로 연동되었습니다.');
    } else {
      setPreview(trimmed);
      triggerChange(trimmed);
    }
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
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs font-sans text-[#37352f] font-semibold">
        <span className="flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#787774]" />
          <span>{label}</span>
        </span>
        <div className="flex items-center gap-1 bg-[#f7f6f3] p-0.5 rounded-md border border-[#e3e2de]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-sans font-medium transition-colors cursor-pointer ${
              mode === 'upload' ? 'bg-white text-[#37352f] shadow-2xs border border-[#e3e2de]' : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            파일 업로드
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-sans font-medium transition-colors cursor-pointer ${
              mode === 'url' ? 'bg-white text-[#37352f] shadow-2xs border border-[#e3e2de]' : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            URL / 유튜브 연동
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {compressionInfo && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#edf6ec] border border-[#d2ebd0] text-[#2c6e3b] text-xs font-sans">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
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
            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-[#e3e2de] bg-[#f7f6f3] hover:bg-[#efefed] hover:border-[#787774] transition-colors text-xs font-sans text-[#37352f] ${
              isProcessing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 text-[#787774] animate-spin" />
                <span>이미지 최적화 및 압축 중...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#787774]" />
                <span>로컬 기기에서 사진/도면 업로드 (자동 압축 및 저장)</span>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="relative">
            <Link2 className="absolute left-3 top-2.5 w-4 h-4 text-[#787774]" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => handleUrlInputChange(e.target.value)}
              placeholder="이미지 주소 또는 유튜브 링크 (예: https://www.youtube.com/watch?v=...)"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#e3e2de] focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] text-xs font-mono text-[#37352f] outline-none"
            />
          </div>
          <p className="text-[11px] text-[#787774] font-sans flex items-center gap-1">
            <Youtube className="w-3 h-3 text-red-600" />
            <span>유튜브 영상 링크를 입력하면 영상의 고화질 썸네일이 자동으로 추출되어 적용됩니다.</span>
          </p>
        </div>
      )}

      {/* Preview Box */}
      {preview && (
        <div className="relative mt-2 aspect-video max-h-48 rounded-xl overflow-hidden border border-[#e3e2de] bg-[#f7f6f3] flex items-center justify-center group shadow-2xs">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'https://img.youtube.com/vi/y4K_5A4wNrw/hqdefault.jpg';
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-white/90 hover:bg-rose-50 text-[#787774] hover:text-rose-600 border border-[#e3e2de] transition-colors cursor-pointer shadow-xs"
            title="이미지 제거"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
