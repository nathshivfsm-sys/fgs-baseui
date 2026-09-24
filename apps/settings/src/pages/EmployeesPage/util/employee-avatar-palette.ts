/** Figma Employees listing avatar tints (node 2196:10592). */
const EMPLOYEE_AVATAR_PALETTE = [
  { surface: 'bg-[#d1fae5]', foreground: 'text-[#065f46]' },
  { surface: 'bg-[#ffedd5]', foreground: 'text-[#9a3412]' },
  { surface: 'bg-[#fef3c7]', foreground: 'text-[#92400e]' },
  { surface: 'bg-[#fce7f3]', foreground: 'text-[#9d174d]' },
  { surface: 'bg-[#dbeafe]', foreground: 'text-[#1e40af]' },
  { surface: 'bg-[#e0e7ff]', foreground: 'text-[#4338ca]' },
] as const;

const hashString = (value: string): number => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const employeeAvatarClassNames = (
  seed: string | null | undefined,
): { surface: string; foreground: string } => {
  const key = (seed ?? '').trim() || '?';
  const paletteIndex = hashString(key) % EMPLOYEE_AVATAR_PALETTE.length;
  return EMPLOYEE_AVATAR_PALETTE[paletteIndex]!;
};
