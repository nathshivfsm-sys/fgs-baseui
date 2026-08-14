export type WorkorderViewDensity = 'comfortable' | 'compact';

export interface WorkorderUiState {
  viewDensity: WorkorderViewDensity;
  toggleViewDensity: () => void;
}
