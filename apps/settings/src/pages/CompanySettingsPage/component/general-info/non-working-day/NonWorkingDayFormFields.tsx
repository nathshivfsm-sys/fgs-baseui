import { SectionCard } from '@cms/ui';
import type { NonWorkingDateForm } from '@cms/settings-data-access';
import { DESCRIPTION_PLACEHOLDER } from '../../../constant';
import { FormTextInput } from '../../form';

export const NonWorkingDayFormFields = () => (
  <SectionCard
    className="flex flex-col gap-3"
    padding="comfortable"
    radius="panel"
    tone="soft"
  >
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <FormTextInput<NonWorkingDateForm>
        label="Date"
        name="nonWorkingDate"
        required
        type="date"
      />
      <FormTextInput<NonWorkingDateForm>
        label="Description"
        name="name"
        placeholder={DESCRIPTION_PLACEHOLDER}
        required
      />
    </div>
  </SectionCard>
);
