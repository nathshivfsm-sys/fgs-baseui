import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PRICE_BOOK_LINE_OTHER,
  emptyPriceBookItemForm,
  priceBookItemFormSchema,
  toPriceBookItemFormValues,
  type PriceBookItemForm,
} from '@cms/settings-data-access';
import {
  BodySmall,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@cms/ui';
import { FormTextarea, FormTextInput } from '../../../shared/component/form';
import { CANCEL_LABEL, OTHER_LINE_TYPE_OPTIONS } from '../constant';
import type { PricebookLineItemDialogProps } from '../types';
import { FormSelectField } from './form';

const EMPTY_FORM = emptyPriceBookItemForm();

const kindLabel = (kind: PricebookLineItemDialogProps['kind']) => {
  if (kind === PRICE_BOOK_LINE_OTHER) return 'other';
  return kind;
};

export const PricebookLineItemDialog = ({
  isPending,
  kind,
  line,
  onOpenChange,
  onSubmit,
  open,
}: PricebookLineItemDialogProps) => {
  const isEdit = line != null;
  const isOther = kind === PRICE_BOOK_LINE_OTHER;
  const form = useForm<PriceBookItemForm>({
    mode: 'onBlur',
    resolver: zodResolver(priceBookItemFormSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (open) {
      form.reset(line ? toPriceBookItemFormValues(line) : EMPTY_FORM);
    }
  }, [form, line, open]);

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (values: PriceBookItemForm) => {
    onSubmit(values);
  };

  const title = isEdit ? `Edit ${kindLabel(kind)}` : `Add ${kindLabel(kind)}`;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-4 p-5 sm:max-w-lg">
        <DialogHeader className="gap-0.5">
          <DialogTitle className="text-title font-bold">{title}</DialogTitle>
          <BodySmall color="foreground-subtle">
            {isOther
              ? 'Choose a type and quantity for this charge.'
              : isEdit
                ? 'Update this line.'
                : 'Add a line to this service.'}
          </BodySmall>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {isOther ? (
              <FormSelectField<PriceBookItemForm>
                label="Type"
                name="itemCode"
                options={OTHER_LINE_TYPE_OPTIONS}
                placeholder="Select type"
                required
              />
            ) : (
              <FormTextInput<PriceBookItemForm>
                label="Name"
                name="itemCode"
                placeholder="Enter name"
                required
              />
            )}
            <FormTextarea<PriceBookItemForm>
              label="Description"
              name="itemDescription"
              placeholder="Write description"
              rows={3}
            />
            <FormTextInput<PriceBookItemForm>
              inputMode="decimal"
              label="Quantity"
              name="quantity"
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                disabled={isPending}
                onClick={handleCancel}
                type="button"
                variant="outline"
              >
                {CANCEL_LABEL}
              </Button>
              <Button loading={isPending} type="submit">
                {isEdit ? 'Save' : 'Add'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
