export type LeadViewDensity = 'comfortable' | 'compact';

export interface LeadUiState {
  viewDensity: LeadViewDensity;
  toggleViewDensity: () => void;
}
