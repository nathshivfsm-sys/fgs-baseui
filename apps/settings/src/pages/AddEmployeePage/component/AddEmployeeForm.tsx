import { useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { UserSummaryDto } from '@cms/user-contract';
import {
  emptyEmployeeCreateForm,
  employeeCreateFormSchema,
  techSkillLevelLookupQueryOptions,
  techTradeLookupQueryOptions,
  userListQueryOptions,
  zoneLookupQueryOptions,
  type EmployeeCreateForm,
} from '@cms/settings-data-access';
import { inventoryLocationLookupQueryOptions } from '@cms/shared-data-access';
import {
  BodySmall,
  Button,
  SectionCard,
  SectionSubheading,
  TextInput,
  type SelectOption,
} from '@cms/ui';
import { FormTextInput, FormTextarea } from '../../../shared/component/form';
import { useGeoLookupOptions } from '../../../shared/util';
import {
  CANCEL_LABEL,
  LABOR_BURDEN_TYPE_OPTIONS,
  MOBILE_ACCESS_HELPER,
  SAVE_EMPLOYEE_LABEL,
} from '../constant';
import { FormSelectField, FormSwitchField } from './form';

export interface AddEmployeeFormProps {
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (values: EmployeeCreateForm, profilePhotoFile: File | null) => void;
  queryClient: QueryClient;
}

const gridTwo = 'grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2';
const gridThree = 'grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3';
const gridFour =
  'grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-4';

function toUserOptions(
  users: readonly UserSummaryDto[] | undefined,
): SelectOption[] {
  return (users ?? []).map((user) => ({
    label: user.displayName ?? user.email ?? user.id,
    value: user.id,
  }));
}

function toLookupOptions(
  rows: readonly {
    id: number;
    name?: string | null;
    code?: string | null;
    inventoryLocationCode?: string | null;
  }[],
): SelectOption[] {
  return rows.map((row) => {
    const label =
      row.name ?? row.inventoryLocationCode ?? row.code ?? String(row.id);
    return { label, value: String(row.id) };
  });
}

export const AddEmployeeForm = ({
  isPending,
  onCancel,
  onSubmit,
  queryClient,
}: AddEmployeeFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [photoLabel, setPhotoLabel] = useState('Upload');

  const form = useForm<EmployeeCreateForm>({
    mode: 'onBlur',
    resolver: zodResolver(employeeCreateFormSchema),
    defaultValues: emptyEmployeeCreateForm(),
  });

  const mobileAccess = form.watch('mobileAccess');
  const country = form.watch('country');
  const state = form.watch('state');

  const usersQuery = useQuery(
    userListQueryOptions({ page: 1, pageSize: 500, isActive: true }),
    queryClient,
  );
  const zonesQuery = useQuery(zoneLookupQueryOptions(true), queryClient);
  const tradesQuery = useQuery(techTradeLookupQueryOptions(true), queryClient);
  const skillsQuery = useQuery(
    techSkillLevelLookupQueryOptions(true),
    queryClient,
  );
  const trucksQuery = useQuery(
    inventoryLocationLookupQueryOptions({
      activeOnly: true,
      locationType: 'truck',
    }),
    queryClient,
  );

  const { cityOptions, countryOptions, stateOptions } = useGeoLookupOptions(
    queryClient,
    {
      countryCode: country || undefined,
      includeCities: true,
      stateProvinceCode: state || undefined,
    },
  );

  const userOptions = useMemo(
    () => toUserOptions(usersQuery.data?.items),
    [usersQuery.data?.items],
  );

  const zoneOptions = useMemo(
    () =>
      toLookupOptions(
        (zonesQuery.data ?? []).map((zone) => ({
          id: zone.id,
          name: zone.name,
          code: zone.code,
        })),
      ),
    [zonesQuery.data],
  );

  const tradeOptions = useMemo(
    () =>
      toLookupOptions(
        (tradesQuery.data ?? []).map((trade) => ({
          id: trade.id,
          name: trade.name,
          code: trade.tradeCode,
        })),
      ),
    [tradesQuery.data],
  );

  const skillOptions = useMemo(
    () =>
      toLookupOptions(
        (skillsQuery.data ?? []).map((skill) => ({
          id: skill.id,
          name: skill.name,
          code: skill.code,
        })),
      ),
    [skillsQuery.data],
  );

  const truckOptions = useMemo(
    () => toLookupOptions(trucksQuery.data ?? []),
    [trucksQuery.data],
  );

  const handleCountryChange = () => {
    form.setValue('state', '', { shouldDirty: true, shouldValidate: true });
    form.setValue('city', '', { shouldDirty: true, shouldValidate: true });
  };

  const handleStateChange = () => {
    form.setValue('city', '', { shouldDirty: true, shouldValidate: true });
  };

  const handleUserChange = (userId: string) => {
    const user = usersQuery.data?.items.find((item) => item.id === userId);
    if (!user) {
      form.setValue('roleName', '');
      return;
    }
    form.setValue('roleName', user.roleName ?? '');
    if (!form.getValues('displayName').trim()) {
      form.setValue('displayName', user.displayName ?? '');
    }
    if (!form.getValues('officeEmail').trim() && user.email) {
      form.setValue('officeEmail', user.email);
    }
    if (!form.getValues('officePhone').trim() && user.phoneNumber) {
      form.setValue('officePhone', user.phoneNumber);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setProfilePhotoFile(file);
    setPhotoLabel(file?.name ?? 'Upload');
  };

  const handleFormSubmit = (values: EmployeeCreateForm) => {
    onSubmit(values, profilePhotoFile);
  };

  const roleName = form.watch('roleName');

  return (
    <FormProvider {...form}>
      <form
        className="flex min-h-0 flex-1 flex-col"
        noValidate
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        <SectionCard
          className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto p-6"
          padding="none"
          radius="panel"
          tone="soft"
        >
          <section className="flex flex-col gap-4">
            <SectionSubheading className="text-action">
              Select existing user
            </SectionSubheading>
            <div className={`${gridTwo} items-end`}>
              <FormSelectField<EmployeeCreateForm>
                label="Select User"
                name="userId"
                onValueChange={handleUserChange}
                options={userOptions}
                placeholder="Select existing user"
              />
              <TextInput
                label="Role"
                readOnly
                required
                value={roleName}
                variant="soft"
                placeholder="Select role"
              />
              <FormSwitchField<EmployeeCreateForm>
                label="Is Active"
                name="isActive"
              />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <SectionSubheading className="text-action">
              Personal information
            </SectionSubheading>
            <div className={gridFour}>
              <div className="flex flex-col gap-1">
                <BodySmall color="foreground-muted">Image</BodySmall>
                <button
                  className="flex h-16 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-surface px-3 text-foreground-subtle transition-colors hover:border-action hover:text-action"
                  onClick={handlePhotoClick}
                  type="button"
                >
                  <span className="text-caption">{photoLabel}</span>
                </button>
                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhotoChange}
                  ref={fileInputRef}
                  type="file"
                />
              </div>
              <FormTextInput<EmployeeCreateForm>
                label="Name"
                name="displayName"
                placeholder="Enter name"
                required
              />
              <FormTextInput<EmployeeCreateForm>
                label="External Name"
                name="externalName"
                placeholder="Enter external name"
                required
              />
              <FormTextInput<EmployeeCreateForm>
                label="DOB"
                name="birthDate"
                type="date"
              />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <SectionSubheading className="text-action">
              Contact details
            </SectionSubheading>
            <div className={gridTwo}>
              <FormTextInput<EmployeeCreateForm>
                label="Personal Email"
                name="personalEmail"
                placeholder="eg. dan@gmail.com"
                type="email"
              />
              <FormTextInput<EmployeeCreateForm>
                label="Personal Phone"
                name="personalPhone"
                placeholder="eg. +91 454 455 56"
              />
              <FormTextInput<EmployeeCreateForm>
                label="Office Email"
                name="officeEmail"
                placeholder="eg. dan@gmail.com"
                required
                type="email"
              />
              <FormTextInput<EmployeeCreateForm>
                label="Office Phone"
                name="officePhone"
                placeholder="eg. +91 454 455 56"
                required
              />
              <FormTextInput<EmployeeCreateForm>
                label="Address 1"
                name="addressLine1"
                placeholder="Enter address"
                required
              />
              <FormTextInput<EmployeeCreateForm>
                label="Apartment"
                name="addressLine2"
                placeholder="Enter apartment"
              />
              <FormSelectField<EmployeeCreateForm>
                label="Country"
                name="country"
                onValueChange={handleCountryChange}
                options={countryOptions}
                placeholder="Select country"
                required
              />
              <FormSelectField<EmployeeCreateForm>
                disabled={!country}
                label="State"
                name="state"
                onValueChange={handleStateChange}
                options={stateOptions}
                placeholder="Select state"
                required
              />
              <FormSelectField<EmployeeCreateForm>
                disabled={!state}
                label="City"
                name="city"
                options={cityOptions}
                placeholder="Select city"
                required
              />
              <FormTextInput<EmployeeCreateForm>
                label="Zip Code"
                name="postalCode"
                placeholder="Enter code"
                required
              />
            </div>
            <FormSwitchField<EmployeeCreateForm>
              label="Verify with Google"
              name="verifyWithGoogle"
            />
          </section>

          <section className="flex flex-col gap-4">
            <SectionSubheading className="text-action">
              Employment details
            </SectionSubheading>
            <div className={gridThree}>
              <FormTextInput<EmployeeCreateForm>
                label="Hire Date"
                name="hireDate"
                type="date"
              />
              <FormSelectField<EmployeeCreateForm>
                label="Overhead Type"
                name="laborBurdenTypeId"
                options={LABOR_BURDEN_TYPE_OPTIONS}
                placeholder="Select type"
              />
              <FormTextInput<EmployeeCreateForm>
                label="Overhead Value"
                name="laborBurdenValue"
                placeholder="Enter amount"
              />
              <FormTextInput<EmployeeCreateForm>
                label="Regular Rate"
                name="regularRate"
                placeholder="Enter rate"
              />
              <TextInput
                disabled
                label="Overtime Rate"
                placeholder="$0.00"
                value="$0.00"
                variant="soft"
              />
              <TextInput
                disabled
                label="Double Time Rate"
                placeholder="$0.00"
                value="$0.00"
                variant="soft"
              />
            </div>
            <FormSwitchField<EmployeeCreateForm>
              label="Is Technician"
              name="isTechnician"
            />
          </section>

          <section className="flex flex-col gap-4">
            <SectionSubheading className="text-action">
              Mobile access
            </SectionSubheading>
            <FormSwitchField<EmployeeCreateForm>
              label="Mobile Access"
              name="mobileAccess"
            />
            <BodySmall color="foreground-subtle">
              {MOBILE_ACCESS_HELPER}
            </BodySmall>

            {mobileAccess ? (
              <>
                <div className={gridTwo}>
                  <FormTextInput<EmployeeCreateForm>
                    label="Masked Phone"
                    name="maskedPhone"
                    placeholder="eg. +91 454 455 56"
                    required
                  />
                  <FormTextarea<EmployeeCreateForm>
                    label="Bio"
                    name="bio"
                    placeholder="Enter bio"
                    rows={4}
                  />
                </div>
                <div className={`${gridFour} xl:grid-cols-4`}>
                  <FormSelectField<EmployeeCreateForm>
                    label="Zone"
                    name="dispatchZoneId"
                    options={zoneOptions}
                    placeholder="Select zone"
                    required
                  />
                  <FormSelectField<EmployeeCreateForm>
                    label="Truck"
                    name="truckId"
                    options={truckOptions}
                    placeholder="Select truck"
                  />
                  <FormSelectField<EmployeeCreateForm>
                    label="Trade"
                    name="techTradeId"
                    options={tradeOptions}
                    placeholder="Select trade"
                    required
                  />
                  <FormSelectField<EmployeeCreateForm>
                    label="Skills"
                    name="techSkillId"
                    options={skillOptions}
                    placeholder="Select skills"
                    required
                  />
                  <FormTextInput<EmployeeCreateForm>
                    label="Start Time"
                    name="startTime"
                    type="time"
                  />
                  <FormTextInput<EmployeeCreateForm>
                    label="Daily Capacity"
                    name="dailyCapacity"
                    placeholder="Enter capacity"
                    required
                  />
                </div>
              </>
            ) : null}
          </section>
        </SectionCard>

        <footer className="mt-4 flex shrink-0 items-center justify-end gap-3 border-t border-border bg-surface px-8 py-3.5">
          <Button
            disabled={isPending}
            onClick={onCancel}
            type="button"
            variant="outline"
          >
            {CANCEL_LABEL}
          </Button>
          <Button loading={isPending} type="submit">
            {SAVE_EMPLOYEE_LABEL}
          </Button>
        </footer>
      </form>
    </FormProvider>
  );
};
