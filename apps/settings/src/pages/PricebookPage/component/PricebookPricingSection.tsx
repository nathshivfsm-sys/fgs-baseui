import { Controller, useFormContext } from 'react-hook-form';
import {
  PRICE_BOOK_PRICING_DYNAMIC,
  PRICE_BOOK_PRICING_STATIC,
  componentPricesAreDirty,
  resolveBasePrice,
  type PriceBookForm,
} from '@cms/settings-data-access';
import { BodySmall, RadioGroupField, SectionCard, SectionTitle } from '@cms/ui';
import { FormTextInput } from '../../../shared/component/form';
import type { PricebookPricingSectionProps } from '../types';
import { formatPrice, parsePriceInput } from '../util';
import { FormToggleField } from './form';

const PRICING_OPTIONS = [
  { label: 'Static Price', value: PRICE_BOOK_PRICING_STATIC },
  { label: 'Dynamic Price', value: PRICE_BOOK_PRICING_DYNAMIC },
] as const;

const AMOUNT_FIELDS = [
  {
    name: 'equipmentPrice',
    label: 'Equipment',
    staticHelp: 'Add price for equipment.',
    dynamicHelp: 'Sum of equipment added on the Equipment tab.',
  },
  {
    name: 'materialPrice',
    label: 'Material',
    staticHelp: 'Add price for parts and material.',
    dynamicHelp: 'Sum of material added on the Material tab.',
  },
  {
    name: 'laborPrice',
    label: 'Labor',
    staticHelp: 'Add price for labor.',
    dynamicHelp: 'Based on estimated hours when a labor rate is available.',
  },
  {
    name: 'afterHourPrice',
    label: 'After Hour Price',
    staticHelp: 'Add price for after-hour work.',
    dynamicHelp: 'Add price for labor on non-working days.',
  },
  {
    name: 'otherPrice',
    label: 'Other',
    staticHelp: 'Add price for other charges.',
    dynamicHelp: 'Sum of sub-contractor and miscellaneous lines.',
  },
] as const;

export const PricebookPricingSection = ({
  savedBasePrice,
}: PricebookPricingSectionProps) => {
  const { control, formState, watch } = useFormContext<PriceBookForm>();
  const pricingModel = watch('pricingModel');
  const isDynamic = pricingModel === PRICE_BOOK_PRICING_DYNAMIC;
  const values = watch();
  const componentPricesDirty = componentPricesAreDirty(formState.dirtyFields);
  const total = resolveBasePrice(values, {
    savedBasePrice,
    componentPricesDirty,
  });

  return (
    <SectionCard
      className="flex flex-col gap-4"
      padding="comfortable"
      radius="panel"
      tone="soft"
    >
      <SectionTitle size="sm">Pricing</SectionTitle>
      <Controller
        control={control}
        name="pricingModel"
        render={({ field }) => {
          const handleModelChange = (value: string) => {
            if (
              value === PRICE_BOOK_PRICING_STATIC ||
              value === PRICE_BOOK_PRICING_DYNAMIC
            ) {
              field.onChange(value);
            }
          };

          return (
            <RadioGroupField
              label="Pricing model"
              onValueChange={handleModelChange}
              options={PRICING_OPTIONS}
              value={field.value}
            />
          );
        }}
      />
      <BodySmall color="foreground-subtle">
        {isDynamic
          ? 'Price is the sum of equipment, material, labor, after hours, and other. Enter those amounts here. Line items do not carry a price yet.'
          : 'Enter a price for each part of the service. The total is the service price.'}
      </BodySmall>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="grid gap-4 sm:grid-cols-2">
          {AMOUNT_FIELDS.map((field) => (
            <FormTextInput<PriceBookForm>
              helperText={isDynamic ? field.dynamicHelp : field.staticHelp}
              inputMode="decimal"
              key={field.name}
              label={field.label}
              name={field.name}
            />
          ))}
          <FormToggleField<PriceBookForm>
            description="Include tax on the labor portion of this service."
            label="Include tax on labor"
            name="laborTaxable"
          />
        </div>
        <SectionCard
          className="flex flex-col gap-2"
          padding="comfortable"
          tone="soft"
        >
          <SectionTitle size="sm">Service Price Summary</SectionTitle>
          {AMOUNT_FIELDS.map((field) => (
            <div
              className="flex items-center justify-between gap-3"
              key={field.name}
            >
              <BodySmall>{field.label}</BodySmall>
              <BodySmall>
                {formatPrice(parsePriceInput(values[field.name]))}
              </BodySmall>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-border-subtle pt-2">
            <span className="text-control font-semibold text-surface-foreground">
              Total Service Price
            </span>
            <span className="text-control font-semibold text-surface-foreground">
              {formatPrice(total)}
            </span>
          </div>
        </SectionCard>
      </div>
    </SectionCard>
  );
};
