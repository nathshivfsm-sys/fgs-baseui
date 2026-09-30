import type {
  JobTypeDetailDto,
  SubcategorySummaryDto,
} from '@cms/settings-contract';
import { usedForLabel } from '@cms/settings-data-access';
import type { JobTypeGroupRow, SubcategoryRow } from '../types';
import { toSubcategoryRow } from './to-subcategory-row';

const categoryLabel = (
  links: NonNullable<JobTypeDetailDto['subCategories']>,
): string => {
  const names = new Set<string>();
  for (const link of links) {
    const name = link.categoryName?.trim();
    if (name) names.add(name);
  }
  return [...names].join(', ');
};

const fallbackSubcategoryRow = (
  link: NonNullable<JobTypeDetailDto['subCategories']>[number],
): SubcategoryRow => ({
  id: String(link.jobTypeTaskId),
  categoryId: String(link.categoryId),
  subcategory: link.name?.trim() || 'Untitled subcategory',
  trade: '',
  estimatedTime: '',
  skill: '',
  priority: '',
  taskName: '',
  isActive: true,
});

export const toJobTypeGroupRow = (
  detail: JobTypeDetailDto,
  subcategoryById: ReadonlyMap<number, SubcategorySummaryDto>,
  names: {
    skillName: (id: number) => string;
    tradeName: (id: number) => string;
  },
): JobTypeGroupRow => {
  const links = detail.subCategories ?? [];
  const subcategories = links.map((link) => {
    const record = subcategoryById.get(link.jobTypeTaskId);
    if (!record) return fallbackSubcategoryRow(link);
    return toSubcategoryRow(record, {
      skillName:
        record.skillLevelId == null ? '' : names.skillName(record.skillLevelId),
      tradeName: names.tradeName(record.tradeId),
    });
  });

  return {
    id: String(detail.id),
    jobType: detail.name?.trim() || 'Untitled job type',
    category: categoryLabel(links),
    businessUnit: detail.businessUnit?.trim() || '',
    glAccount: '—',
    usedFor: usedForLabel(detail.usedFor),
    taskCount: links.length,
    isActive: detail.isActive,
    subcategories,
  };
};
