'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Ensure we only render on client side (avoid hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === 'undefined') {
    return null;
  }

  const container = (
    <div
      className="fixed top-4 right-4 left-4 md:left-auto z-[100] flex flex-col gap-sm pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <div className="flex flex-col gap-sm pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </div>
  );

  return createPortal(container, document.body);
}
