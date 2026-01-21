import React, { useEffect, useRef } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

/**
 * ConfirmationModal - Accessible confirmation dialog
 * 
 * Features:
 * - Keyboard navigation (Enter to confirm, Escape to cancel)
 * - Focus trap
 * - ARIA labels for accessibility
 * - Dark mode support
 * - Backdrop click to cancel
 * - Dangerous action styling (red for delete, etc.)
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonClass = 'bg-primary hover:bg-opacity-90',
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the confirm button when modal opens
      setTimeout(() => {
        if (isDangerous) {
          // For dangerous actions, don't auto-focus confirm to prevent accidents
          modalRef.current?.focus();
        } else {
          confirmButtonRef.current?.focus();
        }
      }, 100);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Add keyboard listener
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel();
        } else if (e.key === 'Enter' && !isDangerous) {
          // Only allow Enter for non-dangerous actions
          onConfirm();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onCancel, onConfirm, isDangerous]);

  if (!isOpen) return null;

  const buttonClass = isDangerous
    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    : confirmButtonClass;

  return (
    <div
      className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="relative max-w-md w-full rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3
            id="modal-title"
            className="text-xl font-semibold text-black dark:text-white"
          >
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6">
          <p
            id="modal-description"
            className="text-black dark:text-white"
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-stroke px-6 py-2.5 text-center font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            aria-label={cancelText}
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className={`inline-flex min-h-[44px] items-center justify-center rounded-md px-6 py-2.5 text-center font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonClass}`}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
