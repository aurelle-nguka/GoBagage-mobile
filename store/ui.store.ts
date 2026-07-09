
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UiState {
  isGlobalLoading: boolean;
  toasts: Toast[];

  setGlobalLoading: (loading: boolean) => void;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isGlobalLoading: false,
  toasts: [],

  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),

  showToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3500);
  },

  hideToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
