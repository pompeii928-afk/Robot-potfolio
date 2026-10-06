import React, { useState, useEffect } from 'react';
import { Lock, FileCode, Download, Eye, EyeOff, AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface AdminDownloadModalProps {
  isOpen: boolean;
  fileName: string;
  filePath: string;
  onClose: () => void;
  isAdmin?: boolean;
}

export const AdminDownloadModal: React.FC<AdminDownloadModalProps> = ({
  isOpen,
  fileName,
  filePath,
  onClose,
  isAdmin = false,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(null);
      setIsSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim() && !isAdmin) {
      setError('관리자 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check stored admin token if exists
      const storedToken = localStorage.getItem('admin_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }

      const res = await fetch('/api/files/download', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          password: password.trim(),
          filePath,
        }),
      });

      if (!res.ok) {
        let errMessage = '관리자 비밀번호가 올바르지 않습니다.';
        try {
          const data = await res.json();
          if (data && data.error) {
            errMessage = data.error;
          }
        } catch {
          // ignore json parse error
        }
        setError(errMessage);
        setIsLoading(false);
        return;
      }

      // Successful verification and file transfer
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError('다운로드 중 네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e3e2de] overflow-hidden text-[#37352f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#f1f0ee]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#37352f] leading-tight">
                보안 파일 다운로드
              </h3>
              <p className="text-xs text-[#787774]">
                관리자 비밀번호 인증 필요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#787774] hover:text-[#37352f] hover:bg-[#f1f0ee] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <form onSubmit={handleDownload} className="p-6 space-y-4">
          {/* Target File Info Card */}
          <div className="p-3.5 bg-[#f7f6f3] border border-[#e3e2de] rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-mono text-[#787774] block uppercase tracking-wider">
                Target File
              </span>
              <p className="text-xs sm:text-sm font-mono font-bold text-[#37352f] truncate">
                {fileName}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#787774] leading-relaxed">
            해당 소스코드 파일은 비인가 다운로드가 제한되어 있습니다. 사이트 관리자 비밀번호를 입력하셔야 다운로드할 수 있습니다.
          </p>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#37352f] flex items-center justify-between">
              <span>관리자 비밀번호</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="비밀번호 입력"
                className="w-full px-3.5 py-2.5 bg-white border border-[#d3d2ce] focus:border-[#2383e2] focus:ring-2 focus:ring-[#2383e2]/20 rounded-xl text-sm font-sans outline-none transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#37352f] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-700 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>비밀번호가 확인되었습니다. 다운로드를 시작합니다.</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#787774] hover:text-[#37352f] hover:bg-[#f1f0ee] transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 bg-[#1a1a18] hover:bg-[#2e2e2a] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>다운로드</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
