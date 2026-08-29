import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = '삭제 확인',
  message,
  itemName,
  confirmText = '삭제하기',
  cancelText = '취소',
  isDangerous = true,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
    >
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
          theme === 'light'
            ? 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
            : 'bg-[#081224] border-white/10 text-zinc-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            theme === 'light'
              ? 'bg-zinc-50 border-zinc-200 text-rose-600'
              : 'bg-[#060c18] border-white/10 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2 font-display font-black uppercase text-base tracking-tight">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>{title}</span>
          </div>
          <button
            onClick={onCancel}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              theme === 'light' ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className={`text-sm leading-relaxed whitespace-pre-line ${theme === 'light' ? 'text-zinc-700' : 'text-zinc-300'}`}>
            {message}
          </p>

          {itemName && (
            <div
              className={`p-3 rounded-2xl border text-xs font-mono font-bold ${
                theme === 'light'
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-900'
                  : 'bg-zinc-950 border-white/10 text-cyan-300'
              }`}
            >
              <span className="text-zinc-500 mr-1.5 font-normal">대상 항목:</span>
              <strong className="text-zinc-950 dark:text-white">{itemName}</strong>
            </div>
          )}

          <p className="text-xs text-rose-600 dark:text-rose-400 font-mono font-medium">
            * 삭제된 데이터는 복구할 수 없으며 즉시 제거됩니다.
          </p>
        </div>

        {/* Actions */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${
            theme === 'light'
              ? 'bg-zinc-50 border-zinc-200'
              : 'bg-[#050b16] border-white/10'
          }`}
        >
          <button
            type="button"
            onClick={onCancel}
            className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              theme === 'light'
                ? 'text-zinc-700 bg-zinc-200 hover:bg-zinc-300'
                : 'text-zinc-300 bg-zinc-800 hover:bg-zinc-700'
            }`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-xs'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
