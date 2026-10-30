export const countPriceBooks = (
  records: readonly { isActive: boolean }[],
): { activeCount: number; inactiveCount: number } => {
  let activeCount = 0;
  for (const record of records) {
    if (record.isActive) activeCount += 1;
  }
  return { activeCount, inactiveCount: records.length - activeCount };
};
