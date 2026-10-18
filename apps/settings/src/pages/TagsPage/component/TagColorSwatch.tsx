import type { TagColorSwatchProps } from '../types';

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

export const TagColorSwatch = ({ color, fallback }: TagColorSwatchProps) => {
  const fill = color && HEX_COLOR.test(color) ? color : fallback;

  return (
    <span
      aria-hidden
      className="inline-block size-6 rounded border border-border-subtle"
      style={{ backgroundColor: fill }}
    />
  );
};
