import { toast, type ToastOptions, type Id } from 'react-toastify';

const MAX_TOASTS = 5;
const activeToastIds: Id[] = [];

// Cleanly track active toast lifecycle using react-toastify's official listener
toast.onChange((payload) => {
  if (payload.status === 'removed') {
    const index = activeToastIds.indexOf(payload.id);
    if (index !== -1) {
      activeToastIds.splice(index, 1);
    }
  }
});

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 2000,
};

function triggerToast(
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  options?: ToastOptions
) {
  // If limit reached, dismiss oldest active toast immediately
  while (activeToastIds.length >= MAX_TOASTS) {
    const oldestId = activeToastIds.shift();
    if (oldestId !== undefined) {
      toast.dismiss(oldestId);
    }
  }

  const toastId = toast[type](message, { ...defaultOptions, ...options });
  if (toastId !== undefined && !activeToastIds.includes(toastId)) {
    activeToastIds.push(toastId);
  }
}

export const showSuccess = (message: string, options?: ToastOptions) => {
  triggerToast('success', message, options);
};

export const showError = (message: string, options?: ToastOptions) => {
  triggerToast('error', message, options);
};

export const showWarning = (message: string, options?: ToastOptions) => {
  triggerToast('warning', message, options);
};

export const showInfo = (message: string, options?: ToastOptions) => {
  triggerToast('info', message, options);
};