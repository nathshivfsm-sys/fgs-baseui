import type { ReactNode } from 'react';
import { RESOLUTION_TYPE_OPTIONS } from '../constant';

export const findResolutionTypeLabel = (typeId: number): ReactNode =>
  RESOLUTION_TYPE_OPTIONS.find((option) => option.value === String(typeId))
    ?.label ?? '—';
