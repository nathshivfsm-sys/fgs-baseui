/**
 * Keys sit under the `['gl-break']` root that Settings' GL break mutations
 * invalidate, so a create/update/patch there still refreshes these lookups.
 */
export const glBreakLookupKeys = {
  all: ['gl-break', 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...glBreakLookupKeys.all, { activeOnly }] as const,
} as const;
