import React from "react";

interface ToastProps {
  open: boolean;
  message?: string | null;
  duration?: number; // ms
  onClose?: () => void;
}

export default function Toast({
  open,
  message = "",
  duration = 4000,
  onClose,
}: ToastProps) {
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open || !message) return null;

  return (
    <div className="fixed left-1/2 bottom-6 -translate-x-1/2 z-50">
      <div className="max-w-xl w-full bg-red-700 text-white px-4 py-3 rounded-lg shadow-lg border border-red-600 flex items-start gap-3">
        <div className="flex-1 text-sm">{message}</div>
        <button
          aria-label="close"
          onClick={() => onClose?.()}
          className="text-white/80 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}
