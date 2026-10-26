import type { TagLookupDto } from '@cms/shared-contract';

export type CustomerTagBadgeTone = 'action' | 'info' | 'neutral' | 'success';

export const resolveCustomerTagLabel = (
  tagId: number,
  lookup: readonly TagLookupDto[] | undefined,
): string => {
  const match = lookup?.find((row) => row.id === tagId);
  return match?.name?.trim() || match?.tagCode?.trim() || `Tag ${tagId}`;
};

export const resolveCustomerTagLabels = (
  tagIds: readonly number[] | null | undefined,
  lookup: readonly TagLookupDto[] | undefined,
): string[] => {
  if (!tagIds?.length) return [];
  return tagIds.map((tagId) => resolveCustomerTagLabel(tagId, lookup));
};

export const customerTagBadgeTone = (
  label: string,
  index: number,
): CustomerTagBadgeTone => {
  const normalized = label.trim().toLowerCase();
  if (normalized.includes('high value')) return 'success';
  if (normalized.includes('top tier')) return 'action';
  return index % 2 === 0 ? 'action' : 'success';
};

export const resolveCustomerTagBadges = (
  tagIds: readonly number[] | null | undefined,
  lookup: readonly TagLookupDto[] | undefined,
): { label: string; tone: CustomerTagBadgeTone }[] =>
  resolveCustomerTagLabels(tagIds, lookup).map((label, index) => ({
    label,
    tone: customerTagBadgeTone(label, index),
  }));
