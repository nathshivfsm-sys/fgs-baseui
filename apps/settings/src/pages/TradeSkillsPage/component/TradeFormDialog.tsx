import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emptyTechTradeForm,
  techTradeFormSchema,
  toTechTradeFormValues,
  toTechTradeWriteDto,
  type TechTradeForm,
} from '@cms/settings-data-access';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SectionCard,
  type SelectOption,
} from '@cms/ui';
import {
  CREATE_TRADE_DESCRIPTION,
  CREATE_TRADE_TITLE,
  EDIT_TRADE_DESCRIPTION,
  EDIT_TRADE_TITLE,
  TRADE_CODE_PLACEHOLDER,
  TRADE_DESCRIPTION_PLACEHOLDER,
  TRADE_NAME_PLACEHOLDER,
  TRADE_SKILLS_PLACEHOLDER,
} from '../constant';
import type { TradeFormDialogProps } from '../types';
import { FormMultiSelectField, FormTextInput, FormTextarea } from './form';

const EMPTY_TRADE_FORM = emptyTechTradeForm();

export const TradeFormDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  skillOptions,
  trade,
}: TradeFormDialogProps) => {
  const isEdit = trade != null;
  const form = useForm<TechTradeForm>({
    mode: 'onBlur',
    resolver: zodResolver(techTradeFormSchema),
    defaultValues: trade ? toTechTradeFormValues(trade) : EMPTY_TRADE_FORM,
  });

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = (values: TechTradeForm) => {
    onSubmit(toTechTradeWriteDto(values));
  };

  const joinSkillLabels = (selected: SelectOption[]) =>
    selected
      .map((option) =>
        typeof option.label === 'string' ? option.label : option.value,
      )
      .join(', ');

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-6 p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-title font-bold">
            {isEdit ? EDIT_TRADE_TITLE : CREATE_TRADE_TITLE}
          </DialogTitle>
          <DialogDescription className="text-control text-foreground-subtle">
            {isEdit ? EDIT_TRADE_DESCRIPTION : CREATE_TRADE_DESCRIPTION}
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
                <FormTextInput<TechTradeForm>
                  label="Trade Code"
                  name="tradeCode"
                  placeholder={TRADE_CODE_PLACEHOLDER}
                  required
                />
                <FormTextInput<TechTradeForm>
                  label="Name"
                  name="name"
                  placeholder={TRADE_NAME_PLACEHOLDER}
                  required
                />
              </div>
              <FormMultiSelectField<TechTradeForm>
                label="Skills"
                name="skillIds"
                options={skillOptions}
                placeholder={TRADE_SKILLS_PLACEHOLDER}
                renderValue={joinSkillLabels}
              />
              <FormTextarea<TechTradeForm>
                label="Description"
                name="description"
                placeholder={TRADE_DESCRIPTION_PLACEHOLDER}
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
