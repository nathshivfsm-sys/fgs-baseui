export const formatClockLabel = (span: string | null | undefined): string => {
  const match = /^(\d{2}):(\d{2})/.exec(span ?? '');
  if (!match?.[1] || !match[2]) return '—';
  const hours = Number(match[1]);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${String(hour12).padStart(2, '0')}:${match[2]} ${period}`;
};

export const formatDurationLabel = (
  span: string | null | undefined,
): string => {
  const match = /^(\d{2}):(\d{2})/.exec(span ?? '');
  if (!match?.[1] || !match[2]) return '—';
  const total = Number(match[1]) * 60 + Number(match[2]);
  if (total <= 0) return '—';
  return `${total} min`;
};
