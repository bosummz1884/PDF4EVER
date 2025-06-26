import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { HistoryState } from '@/types';

interface HistoryStore {
  // State
  history: HistoryState[];
  currentIndex: number;
  maxHistorySize: number;
  
  // Actions
  addHistoryState: (action: string, data: any) => void;
  undo: () => HistoryState | null;
  redo: () => HistoryState | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  setMaxHistorySize: (size: number) => void;
  
  // Getters
  getCurrentState: () => HistoryState | null;
  getHistorySize: () => number;
}

export const useHistoryStore = create<HistoryStore>()(
  devtools(
    (set, get) => ({
      history: [],
      currentIndex: -1,
      maxHistorySize: 50,

      addHistoryState: (action, data) => set((state) => {
        const newState: HistoryState = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          action,
          data,
          timestamp: new Date(),
        };

        // Remove any redo states if we're not at the end
        const newHistory = state.history.slice(0, state.currentIndex + 1);
        newHistory.push(newState);

        // Limit history size
        if (newHistory.length > state.maxHistorySize) {
          newHistory.shift();
          return {
            history: newHistory,
            currentIndex: newHistory.length - 1,
          };
        }

        return {
          history: newHistory,
          currentIndex: newHistory.length - 1,
        };
      }),

      undo: () => {
        const state = get();
        if (!state.canUndo()) return null;

        const newIndex = state.currentIndex - 1;
        set({ currentIndex: newIndex });
        return state.history[newIndex] || null;
      },

      redo: () => {
        const state = get();
        if (!state.canRedo()) return null;

        const newIndex = state.currentIndex + 1;
        set({ currentIndex: newIndex });
        return state.history[newIndex];
      },

      canUndo: () => {
        const { currentIndex } = get();
        return currentIndex > 0;
      },

      canRedo: () => {
        const { history, currentIndex } = get();
        return currentIndex < history.length - 1;
      },

      clearHistory: () => set({
        history: [],
        currentIndex: -1,
      }),

      setMaxHistorySize: (size) => set((state) => {
        if (state.history.length > size) {
          const trimmedHistory = state.history.slice(-size);
          return {
            maxHistorySize: size,
            history: trimmedHistory,
            currentIndex: Math.min(state.currentIndex, trimmedHistory.length - 1),
          };
        }
        return { maxHistorySize: size };
      }),

      getCurrentState: () => {
        const { history, currentIndex } = get();
        return history[currentIndex] || null;
      },

      getHistorySize: () => {
        const { history } = get();
        return history.length;
      },
    }),
    {
      name: 'history-store',
    }
  )
);