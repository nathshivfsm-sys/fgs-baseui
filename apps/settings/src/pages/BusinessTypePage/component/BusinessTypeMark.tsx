import { HomeIcon, SettingsBusinessTypeIcon } from '@cms/ui';
import {
  airVentIconUrl,
  bugIconUrl,
  categoryIconUrl,
  leafIconUrl,
  pipeIconUrl,
  smartphoneChargingIconUrl,
} from '../asset';
import type { BusinessTypeMarkProps } from '../types';

interface SvgMark {
  height: number;
  src: string;
  wellClassName: string;
  width: number;
}

const SVG_MARKS: Record<string, SvgMark> = {
  hvac: {
    height: 24,
    src: airVentIconUrl,
    wellClassName: 'bg-[#dbeafe]',
    width: 24,
  },
  plumbing: {
    height: 24,
    src: pipeIconUrl,
    wellClassName: 'bg-[#fee2e2]',
    width: 24,
  },
  'pest control': {
    height: 24,
    src: bugIconUrl,
    wellClassName: 'bg-[#d1fae5]',
    width: 24,
  },
  electrical: {
    height: 24,
    src: smartphoneChargingIconUrl,
    wellClassName: 'bg-[#fef3c7]',
    width: 24,
  },
  'home cleaning': {
    height: 18,
    src: categoryIconUrl,
    wellClassName: 'bg-[#e0e7ff]',
    width: 18,
  },
  'garden management': {
    height: 16,
    src: leafIconUrl,
    wellClassName: 'bg-[#fef3c7]',
    width: 16,
  },
};

const JUNK_REMOVAL_KEY = 'junk removal';

const normalizeMarkKey = (value: string | null | undefined) =>
  (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

const markFor = (
  name: string | null | undefined,
  code: string | null | undefined,
) => {
  const nameKey = normalizeMarkKey(name);
  const codeKey = normalizeMarkKey(code);
  if (nameKey === JUNK_REMOVAL_KEY || codeKey === JUNK_REMOVAL_KEY) {
    return 'home' as const;
  }
  return SVG_MARKS[nameKey] ?? SVG_MARKS[codeKey] ?? null;
};

export const BusinessTypeMark = ({ code, name }: BusinessTypeMarkProps) => {
  const mark = markFor(name, code);

  if (mark === 'home') {
    return (
      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-[#fce7f3]">
        <HomeIcon className="size-[18px] text-[#db2777]" />
      </span>
    );
  }

  if (mark) {
    return (
      <span
        className={`flex size-[34px] shrink-0 items-center justify-center rounded-lg ${mark.wellClassName}`}
      >
        <img alt="" height={mark.height} src={mark.src} width={mark.width} />
      </span>
    );
  }

  return (
    <span className="flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground-subtle">
      <SettingsBusinessTypeIcon className="size-6" />
    </span>
  );
};
