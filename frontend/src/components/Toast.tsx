import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      bg: 'bg-emerald-600',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-rose-600',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-indigo-600',
      icon: Info,
    },
  }[toast.type];

  const Icon = config.icon;

  return (
    <div className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-lg text-white font-medium text-xs bg-slate-900 border border-slate-700 animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-2.5">
        <div className={`p-1 rounded-lg ${config.bg}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="leading-snug">{toast.message}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
