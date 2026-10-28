import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  inputPrompt?: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    required?: boolean;
  };
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  inputPrompt
}) => {
  const isInputInvalid = inputPrompt?.required && !inputPrompt.value.trim();

  const handleConfirm = () => {
    if (isInputInvalid) return;
    onConfirm();
    onClose();
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500';
      case 'primary':
      default:
        return 'bg-[#7866E8] hover:bg-[#6855d9] text-white focus:ring-[#7866E8]';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'primary':
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#7866E8] shrink-0" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-stone-100 shrink-0">
            {getIcon()}
          </div>
          <p className="text-sm text-stone-600 leading-relaxed pt-0.5">
            {description}
          </p>
        </div>

        {inputPrompt && (
          <div className="mt-3">
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {inputPrompt.label} {inputPrompt.required && <span className="text-rose-500">*</span>}
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7866E8]/30 focus:border-[#7866E8] resize-none"
              placeholder={inputPrompt.placeholder}
              value={inputPrompt.value}
              onChange={(e) => inputPrompt.onChange(e.target.value)}
              required={inputPrompt.required}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isInputInvalid}
            onClick={handleConfirm}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyles()}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
