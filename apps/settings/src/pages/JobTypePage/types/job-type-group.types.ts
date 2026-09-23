import type { SubcategoryRow } from './job-type-page.types';

export interface JobTypeGroupRow {
  businessUnit: string;
  category: string;
  glAccount: string;
  id: string;
  isActive: boolean;
  jobType: string;
  subcategories: readonly SubcategoryRow[];
  taskCount: number;
  usedFor: string;
}
