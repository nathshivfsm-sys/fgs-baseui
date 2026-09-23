import { useStore } from 'zustand';
import type { LocalePreferences, LocaleStoreState } from './locale-preferences.types';
import { localeStore } from './locale-store';

export const useLocaleStore = <Selected>(
  selector: (state: LocaleStoreState) => Selected,
): Selected => useStore(localeStore, selector);

export const useLocalePreferences = (): LocalePreferences =>
  useLocaleStore((state) => state.preferences);
