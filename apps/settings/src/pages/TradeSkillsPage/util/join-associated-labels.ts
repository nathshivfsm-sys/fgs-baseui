export const joinLabelsByIds = (
  ids: readonly number[] | null | undefined,
  labelsById: ReadonlyMap<number, string>,
): string => {
  if (!ids?.length) {
    return '—';
  }
  const labels = ids
    .map((id) => labelsById.get(id)?.trim())
    .filter((label): label is string => Boolean(label));
  return labels.length > 0 ? labels.join(', ') : '—';
};

export const uniqueTradeCodesForSkill = (
  skillId: number,
  trades: readonly {
    skillIds?: readonly number[] | null;
    tradeCode?: string | null;
  }[],
): string => {
  const codes = [
    ...new Set(
      trades
        .filter((trade) => (trade.skillIds ?? []).includes(skillId))
        .map((trade) => trade.tradeCode?.trim())
        .filter((code): code is string => Boolean(code)),
    ),
  ];
  return codes.length > 0 ? codes.join(', ') : '—';
};
