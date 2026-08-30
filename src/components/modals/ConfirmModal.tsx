import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ModalBackdrop } from './ModalBackdrop';

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
  return (
    <ModalBackdrop
      isOpen={isOpen}
      onClose={onCancel}
      maxWidthClass="max-w-md"
      zIndexClass="z-[9999]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-[#fbfbfa] border-[#e3e2de] text-rose-600">
        <div className="flex items-center gap-2 font-sans font-bold text-sm text-[#37352f] tracking-tight">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>{title}</span>
        </div>
        <button
          onClick={onCancel}
          className="p-1 rounded-md text-[#787774] hover:text-[#37352f] hover:bg-[#efefed] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4 bg-white">
        <p className="text-xs sm:text-sm text-[#37352f] leading-relaxed whitespace-pre-line font-sans">
          {message}
        </p>

        {itemName && (
          <div className="p-3 rounded-lg border border-[#e3e2de] bg-[#f7f6f3] text-xs font-mono">
            <span className="text-[#787774] mr-1.5 font-normal">대상 항목:</span>
            <strong className="text-[#37352f] font-semibold">{itemName}</strong>
          </div>
        )}

        <p className="text-[11px] text-rose-600 font-mono">
          * 삭제된 데이터는 복구할 수 없으며 즉시 제거됩니다.
        </p>
      </div>

      {/* Actions */}
      <div className="px-6 py-3.5 border-t border-[#e3e2de] bg-[#fbfbfa] flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-1.5 rounded-md text-xs font-sans font-medium text-[#37352f] bg-white hover:bg-[#efefed] border border-[#e3e2de] transition-colors cursor-pointer"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`px-3.5 py-1.5 rounded-md text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isDangerous
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs'
              : 'bg-[#37352f] hover:bg-[#222] text-white shadow-2xs'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{confirmText}</span>
        </button>
      </div>
    </ModalBackdrop>
  );
};

