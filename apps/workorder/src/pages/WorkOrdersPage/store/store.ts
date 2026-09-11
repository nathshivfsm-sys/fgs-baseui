import { createStore } from 'zustand/vanilla';
import { DEFAULT_WORKORDER_VIEW_DENSITY } from './constants';
import type { WorkorderUiState, WorkorderViewDensity } from './types';

/** Creates state owned by one mounted Work Order MFE instance. */
export function createWorkorderUiStore(
  initialViewDensity: WorkorderViewDensity = DEFAULT_WORKORDER_VIEW_DENSITY,
) {
  return createStore<WorkorderUiState>()((set) => ({
    viewDensity: initialViewDensity,
    toggleViewDensity: () =>
      set((state) => ({
        viewDensity:
          state.viewDensity === 'comfortable' ? 'compact' : 'comfortable',
      })),
  }));
}
