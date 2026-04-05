'use client';

import { useEffect, useCallback, createContext, useContext, useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  createToast,
  TOAST_AUTO_DISMISS_MS,
  type ToastMessage,
  type ToastType,
} from '@/lib/feedback/toast';

// ----------------------------------------------------------------
// Context
// ----------------------------------------------------------------
interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast は ToastProvider 内で使用してください');
  return ctx;
}

// ----------------------------------------------------------------
// Provider
// ----------------------------------------------------------------
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const toast = createToast(type, message);
    setToasts((prev) => [...prev, toast]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* aria-live で変更をスクリーンリーダーに通知 */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ----------------------------------------------------------------
// ToastItem
// ----------------------------------------------------------------
const ICON_MAP: Record<ToastType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  info: InformationCircleIcon,
};

const COLOR_MAP: Record<ToastType, string> = {
  success: 'border-l-4 border-success bg-surface text-success-dark',
  error: 'border-l-4 border-error bg-surface text-error-dark',
  info: 'border-l-4 border-primary bg-surface text-primary',
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), TOAST_AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const Icon = ICON_MAP[toast.type];

  return (
    <div
      role="status"
      className={[
        'flex items-start gap-3 p-4 rounded-lg shadow-dropdown',
        COLOR_MAP[toast.type],
      ].join(' ')}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
      <p className="flex-1 text-base font-normal leading-[1.7] text-text-body">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="通知を閉じる"
        className="shrink-0 text-text-secondary hover:text-text-body
                   focus-visible:outline-2 focus-visible:outline-[#0877d7] rounded"
      >
        <XMarkIcon className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
