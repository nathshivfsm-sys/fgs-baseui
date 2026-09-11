import { createStore } from 'zustand/vanilla';
import { DEFAULT_LEAD_VIEW_DENSITY } from './constants';
import type { LeadUiState, LeadViewDensity } from './types';

/** Creates state owned by one mounted Lead MFE instance. */
export function createLeadUiStore(
  initialViewDensity: LeadViewDensity = DEFAULT_LEAD_VIEW_DENSITY,
) {
  return createStore<LeadUiState>()((set) => ({
    viewDensity: initialViewDensity,
    toggleViewDensity: () =>
      set((state) => ({
        viewDensity:
          state.viewDensity === 'comfortable' ? 'compact' : 'comfortable',
      })),
  }));
}
