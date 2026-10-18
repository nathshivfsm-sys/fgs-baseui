import { TAG_ENTITY_OPTIONS } from '../constant';

const ENTITY_LABELS = new Map(
  TAG_ENTITY_OPTIONS.map((option) => [option.value, String(option.label)]),
);

export const formatTagEntityCell = (
  entities: readonly string[] | null | undefined,
): string => {
  if (!entities?.length) return '—';
  return entities.map((value) => ENTITY_LABELS.get(value) ?? value).join(', ');
};

export const formatTagEntityLabel = (value: string): string =>
  ENTITY_LABELS.get(value) ?? value;
