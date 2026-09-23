import { createStore } from 'zustand/vanilla';
import { createInitialLocalePreferences } from './create-initial-locale-preferences';
import type { LocaleStoreState } from './locale-preferences.types';
import { mergeLocalePreferences } from './merge-locale-preferences';

/** Shared across shell and federated remotes (Module Federation singleton). */
export const localeStore = createStore<LocaleStoreState>()((set) => ({
  preferences: createInitialLocalePreferences(),
  setPreferences: (patch) =>
    set((state) => ({
      preferences: mergeLocalePreferences(state.preferences, patch),
    })),
  replacePreferences: (preferences) => set({ preferences }),
  resetPreferences: () =>
    set({ preferences: createInitialLocalePreferences() }),
}));

export const getLocalePreferences = () => localeStore.getState().preferences;
