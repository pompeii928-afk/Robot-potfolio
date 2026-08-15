import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div
        className="relative w-full max-w-md bg-[#081224] border border-rose-500/40 rounded-2xl shadow-[0_0_50px_rgba(244,63,94,0.25)] overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/20 bg-[#060c18]">
          <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>{title}</span>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {message}
          </p>

          {itemName && (
            <div className="p-3 rounded-xl bg-slate-950/70 border border-rose-500/30 text-xs font-mono text-cyan-300">
              <span className="text-slate-400 mr-1.5">대상 항목:</span>
              <strong className="text-white">{itemName}</strong>
            </div>
          )}

          <p className="text-xs text-rose-400/80 font-mono">
            * 삭제된 데이터는 복구할 수 없으며 Firestore 데이터베이스에서 즉시 제거됩니다.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-[#050b16] border-t border-rose-500/20 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 bg-slate-800/80 hover:bg-slate-700 transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
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
