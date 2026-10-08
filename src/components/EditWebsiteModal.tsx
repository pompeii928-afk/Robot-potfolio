import React, { useState, useEffect } from 'react';
import { Globe, X, Plus, AlertCircle, Save, ExternalLink } from 'lucide-react';
import { ExternalSiteItem } from '../types';
import { useLanguage } from '../context/ThemeContext';

interface EditWebsiteModalProps {
  isOpen: boolean;
  initialData?: ExternalSiteItem | null;
  onClose: () => void;
  onSave: (site: Partial<ExternalSiteItem> & { title: string; url: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const EditWebsiteModal: React.FC<EditWebsiteModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
  onDelete,
}) => {
  const { lang, t } = useLanguage();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('STORE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setUrl(initialData.url || '');
        setDescription(initialData.description || '');
        setCategory(initialData.category || 'STORE');
      } else {
        setTitle('');
        setUrl('');
        setDescription('');
        setCategory('STORE');
      }
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('웹사이트 이름을 입력해주세요.');
      return;
    }

    let cleanUrl = url.trim();
    if (!cleanUrl) {
      setError('웹사이트 URL 주소를 입력해주세요.');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        ...(initialData ? { id: initialData.id } : {}),
        title: title.trim(),
        url: cleanUrl,
        description: description.trim(),
        category: category.trim() || 'STORE',
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e3e2de] overflow-hidden text-[#37352f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#f1f0ee]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#37352f] leading-tight">
                {initialData ? '웹사이트 정보 수정' : '새 웹사이트 추가'}
              </h3>
              <p className="text-xs text-[#787774]">
                '다른 왭사이트' 카테고리에 표시될 웹사이트 링크 관리
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#787774] hover:text-[#37352f] hover:bg-[#f1f0ee] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#37352f]">
              웹사이트 이름 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: ROBO STORE, CoSpace 공식 허브"
              className="w-full px-3.5 py-2.5 bg-white border border-[#d3d2ce] focus:border-[#2383e2] focus:ring-2 focus:ring-[#2383e2]/20 rounded-xl text-sm font-sans outline-none transition-all"
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#37352f]">
              웹사이트 URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://wro-2026-selling-site.vercel.app/"
              className="w-full px-3.5 py-2.5 bg-white border border-[#d3d2ce] focus:border-[#2383e2] focus:ring-2 focus:ring-[#2383e2]/20 rounded-xl text-sm font-mono outline-none transition-all text-[#37352f]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#37352f]">
              간단 설명
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: WRO & CoSpace Robotics 공식 스토어 및 리소스"
              className="w-full px-3.5 py-2.5 bg-white border border-[#d3d2ce] focus:border-[#2383e2] focus:ring-2 focus:ring-[#2383e2]/20 rounded-xl text-sm font-sans outline-none transition-all"
            />
          </div>

          {/* Category Tag */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#37352f]">
              카테고리 구분 (태그)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {['STORE', 'COMMUNITY', 'RESOURCE', 'ROBOTICS', 'BLOG'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
                    category === cat
                      ? 'bg-[#1a1a18] text-white border-[#1a1a18]'
                      : 'bg-[#f7f6f3] text-[#787774] border-[#e3e2de] hover:bg-[#efefed]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#f1f0ee] flex items-center justify-between">
            {initialData && onDelete ? (
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm(`'${initialData.title}' 사이트를 삭제하시겠습니까?`)) {
                    setIsSubmitting(true);
                    try {
                      await onDelete(initialData.id);
                      onClose();
                    } catch (err: any) {
                      setError(err?.message || '삭제에 실패했습니다.');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }
                }}
                disabled={isSubmitting}
                className="px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                삭제하기
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#787774] hover:text-[#37352f] hover:bg-[#f1f0ee] transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 bg-[#1a1a18] hover:bg-[#2e2e2a] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{initialData ? '수정 완료' : '추가하기'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
