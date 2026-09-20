import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptyTechSkillLevelForm,
  techSkillLevelFormSchema,
  toTechSkillLevelFormValues,
  toTechSkillLevelWriteDto,
  type TechSkillLevelForm,
} from '@cms/settings-data-access';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SectionCard,
} from '@cms/ui';
import {
  CREATE_SKILL_DESCRIPTION,
  CREATE_SKILL_TITLE,
  EDIT_SKILL_DESCRIPTION,
  EDIT_SKILL_TITLE,
  SKILL_CODE_PLACEHOLDER,
  SKILL_DESCRIPTION_PLACEHOLDER,
  SKILL_NAME_PLACEHOLDER,
} from '../constant';
import type { SkillFormDialogProps } from '../types';
import { FormTextInput, FormTextarea } from './form';

const EMPTY_SKILL_FORM = emptyTechSkillLevelForm();

export const SkillFormDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  skill,
}: SkillFormDialogProps) => {
  const isEdit = skill != null;
  const form = useForm<TechSkillLevelForm>({
    mode: 'onBlur',
    resolver: zodResolver(techSkillLevelFormSchema),
    defaultValues: skill ? toTechSkillLevelFormValues(skill) : EMPTY_SKILL_FORM,
  });

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = (values: TechSkillLevelForm) => {
    onSubmit(toTechSkillLevelWriteDto(values));
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {isEdit ? EDIT_SKILL_TITLE : CREATE_SKILL_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {isEdit ? EDIT_SKILL_DESCRIPTION : CREATE_SKILL_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
            <SectionCard
              className="flex flex-col gap-3"
              padding="comfortable"
              radius="panel"
              tone="soft"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormTextInput<TechSkillLevelForm>
                  label="Skill Code"
                  name="code"
                  placeholder={SKILL_CODE_PLACEHOLDER}
                  required
                />
                <FormTextInput<TechSkillLevelForm>
                  label="Name"
                  name="name"
                  placeholder={SKILL_NAME_PLACEHOLDER}
                  required
                />
              </div>
              <FormTextarea<TechSkillLevelForm>
                label="Description"
                name="description"
                placeholder={SKILL_DESCRIPTION_PLACEHOLDER}
                rows={3}
              />
              <div className="mt-8 flex justify-end gap-2">
                <Button
                  disabled={isPending}
                  onClick={handleClose}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button loading={isPending} type="submit">
                  Save
                </Button>
              </div>
            </SectionCard>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
