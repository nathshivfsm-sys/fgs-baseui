export const findTradeLabel = (
  tradeId: number | null | undefined,
  tradeOptions: readonly { id: number; label: string }[],
): string => {
  if (tradeId == null) return '—';
  return (
    tradeOptions.find((option) => option.id === tradeId)?.label ??
    String(tradeId)
  );
};
