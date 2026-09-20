export const labelForId = (
  id: number | null | undefined,
  labelsById: ReadonlyMap<number, string>,
): string => {
  if (id == null) return '—';
  const label = labelsById.get(id)?.trim();
  return label ? label : '—';
};
