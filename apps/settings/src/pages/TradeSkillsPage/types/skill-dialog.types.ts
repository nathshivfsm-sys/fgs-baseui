import type {
  TechSkillLevelCreateDto,
  TechSkillLevelSummaryDto,
} from '@cms/settings-contract';

export interface SkillFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: TechSkillLevelCreateDto) => void;
  open: boolean;
  skill: TechSkillLevelSummaryDto | null;
}

export interface SkillDeleteDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  skill: TechSkillLevelSummaryDto | null;
}
