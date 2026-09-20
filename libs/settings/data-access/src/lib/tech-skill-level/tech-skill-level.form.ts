import { z } from 'zod';
import type {
  TechSkillLevelCreateDto,
  TechSkillLevelSummaryDto,
  TechSkillLevelUpdateDto,
} from '@cms/settings-contract';

export const techSkillLevelFormSchema = z.object({
  code: z.string().trim().min(1, 'Skill code is required').max(32),
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().trim().max(250),
});

export type TechSkillLevelForm = z.infer<typeof techSkillLevelFormSchema>;

export const emptyTechSkillLevelForm = (): TechSkillLevelForm => ({
  code: '',
  name: '',
  description: '',
});

export const toTechSkillLevelFormValues = (
  skill: TechSkillLevelSummaryDto,
): TechSkillLevelForm => ({
  code: skill.code ?? '',
  name: skill.name ?? '',
  description: skill.description ?? '',
});

export const toTechSkillLevelWriteDto = (
  values: TechSkillLevelForm,
): TechSkillLevelCreateDto & TechSkillLevelUpdateDto => ({
  code: values.code,
  name: values.name,
  description: values.description === '' ? null : values.description,
});
