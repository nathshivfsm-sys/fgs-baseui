export const phoneDigitsOnly = (value: string): string =>
  value.replace(/\D/g, '');

const formatUsTen = (ten: string): string =>
  `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;

const chunkInThrees = (value: string): string => {
  const parts: string[] = [];
  for (let index = 0; index < value.length; index += 3) {
    parts.push(value.slice(index, index + 3));
  }
  return parts.join(' ');
};

/** Display formatting when the field is not focused; form state stays digits-only. */
export const formatPhoneDisplay = (digits: string): string => {
  const normalized = phoneDigitsOnly(digits);
  if (!normalized) return '';

  if (normalized.length === 10) {
    return formatUsTen(normalized);
  }

  if (normalized.length === 11 && normalized.startsWith('1')) {
    return `+1 ${formatUsTen(normalized.slice(1))}`;
  }

  if (normalized.length >= 11 && normalized.startsWith('91')) {
    const national = normalized.slice(2);
    if (national.length >= 10) {
      return `+91 ${chunkInThrees(national)}`.trim();
    }
  }

  if (normalized.length > 10) {
    const countrySize = normalized.startsWith('1') ? 1 : 2;
    const country = normalized.slice(0, countrySize);
    const rest = normalized.slice(countrySize);
    return `+${country} ${chunkInThrees(rest)}`.trim();
  }

  return normalized;
};
