import type { PriceBookForm } from '@cms/settings-data-access';
import { Callout, SectionCard, SectionTitle } from '@cms/ui';
import { FormTextInput } from '../../../shared/component/form';
import {
  DISCOUNT_ACCOUNT_OPTIONS,
  MEMBERSHIP_TYPE_OPTIONS,
  UNSAVED_PRICE_FIELDS_MESSAGE,
} from '../constant';
import { FormSelectField } from './form';

export const PricebookMembershipSection = () => (
  <SectionCard
    className="flex flex-col gap-4"
    padding="comfortable"
    radius="panel"
    tone="soft"
  >
    <SectionTitle size="sm">Membership</SectionTitle>
    <Callout>{UNSAVED_PRICE_FIELDS_MESSAGE}</Callout>
    <div className="grid gap-4 sm:grid-cols-3">
      <FormSelectField<PriceBookForm>
        label="Type"
        name="membershipType"
        options={MEMBERSHIP_TYPE_OPTIONS}
        placeholder="Select type"
      />
      <FormTextInput<PriceBookForm>
        inputMode="decimal"
        label="Membership Discount %"
        name="membershipDiscountPercent"
        placeholder="10"
      />
      <FormSelectField<PriceBookForm>
        label="Discount Account"
        name="discountAccount"
        options={DISCOUNT_ACCOUNT_OPTIONS}
        placeholder="Select account"
      />
    </div>
  </SectionCard>
);
