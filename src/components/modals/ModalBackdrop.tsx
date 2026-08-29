import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalBackdropProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
  className?: string;
  zIndexClass?: string;
}

export const ModalBackdrop: React.FC<ModalBackdropProps> = ({
  isOpen,
  onClose,
  children,
  maxWidthClass = 'max-w-2xl',
  className = '',
  zIndexClass = 'z-[9999]',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and handle Esc key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Auto-focus container on open
    setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed inset-0 ${zIndexClass} flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150`}
      onClick={onClose}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        className={`relative w-full ${maxWidthClass} max-h-[92vh] flex flex-col my-auto rounded-2xl bg-white border border-[#e3e2de] shadow-2xl overflow-hidden text-[#37352f] animate-in zoom-in-95 duration-150 outline-none ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
