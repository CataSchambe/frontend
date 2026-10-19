import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Guardar',
  confirmVariant = 'gradient',
  confirmLoading = false,
  cancelText = 'Cancelar',
  maxWidth = 'max-w-lg',
  showFooter = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full ${maxWidth} bg-bg-card text-text-main rounded-xl border border-border-subtle shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="font-headline font-bold text-lg text-text-main">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-text-muted hover:text-text-main p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-subtle bg-bg-surface/50">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={confirmLoading}
            >
              {cancelText}
            </Button>
            {onConfirm && (
              <Button
                type="button"
                variant={confirmVariant}
                onClick={onConfirm}
                isLoading={confirmLoading}
              >
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
