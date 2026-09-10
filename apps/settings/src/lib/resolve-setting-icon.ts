import type { FigmaIconProps, SettingCardTone } from '@cms/ui';
import { SettingsIcon } from '@cms/ui';
import type { ComponentType } from 'react';
import {
  COMPANY_TONE_MAP,
  SETTING_ICON_MAP,
  TONE_CYCLE,
} from '../constants/setting-icons';

/** Resolves a `settings.ts` `icon` name to its `@cms/ui` component, falling back to `SettingsIcon`. */
export function resolveSettingIcon(
  iconName: string,
): ComponentType<FigmaIconProps> {
  return SETTING_ICON_MAP[iconName] ?? SettingsIcon;
}

/** Resolves a card's icon-tile tone: the exact Company-tab value, or a positional cycle. */
export function resolveSettingTone(
  iconName: string,
  index: number,
): SettingCardTone {
  return COMPANY_TONE_MAP[iconName] ?? TONE_CYCLE[index % TONE_CYCLE.length];
}
