import type { TagLookupDto } from '@cms/shared-contract';
import {
  resolveCustomerTagLabel,
  resolveCustomerTagLabels,
} from '../../../shared';

export const formatCustomerTagLabel = (
  tagId: number,
  lookup?: readonly TagLookupDto[],
) => resolveCustomerTagLabel(tagId, lookup);

export const formatCustomerTags = (
  tagIds: readonly number[] | null | undefined,
  lookup?: readonly TagLookupDto[],
): string => {
  const labels = resolveCustomerTagLabels(tagIds, lookup);
  if (!labels.length) return '—';
  return labels.join(', ');
};
