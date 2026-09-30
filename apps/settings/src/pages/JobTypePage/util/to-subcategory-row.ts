import type { SubcategorySummaryDto } from '@cms/settings-contract';
import type { SubcategoryRow } from '../types';

export const formatEstimatedTime = (hours: number): string => {
  if (!Number.isFinite(hours) || hours < 0) return '';
  const totalMinutes = Math.round(hours * 60);
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${wholeHours}h ${String(minutes).padStart(2, '0')}m`;
};

export const priorityLabel = (priority: number): string => {
  if (priority === 1) return 'High';
  if (priority === 2) return 'Medium';
  if (priority === 3) return 'Low';
  return String(priority);
};

export const toSubcategoryRow = (
  record: SubcategorySummaryDto,
  names: {
    skillName?: string;
    tradeName?: string;
  },
): SubcategoryRow => ({
  id: String(record.id),
  categoryId: String(record.jobCategoryId),
  subcategory: record.name?.trim() || 'Untitled subcategory',
  trade: names.tradeName ?? '',
  estimatedTime: formatEstimatedTime(record.estimatedHours),
  skill: names.skillName ?? '',
  priority: priorityLabel(record.priority),
  taskName: record.taskName ?? '',
  isActive: record.isActive,
});
