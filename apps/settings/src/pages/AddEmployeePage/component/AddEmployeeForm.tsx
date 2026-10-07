import { useMemo, useRef, useState, type ChangeEvent } from 'react';
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
  BriefcaseIcon,
  ImportIcon,
  MobileIcon,
  PhoneLineIcon,
  phoneDigitsOnly,
  SelectField,
  SettingsUserIcon,
  TextInput,
  UsersIcon,
  type SelectOption,
} from '@cms/ui';
import {
  FormDatePicker,
  FormEmailInput,
  FormPhoneInput,
  FormTextInput,
  FormTextarea,
  FormTimePicker,
} from '../../../shared/component/form';
import { useGeoLookupOptions } from '../../../shared/util';
import { withCurrentOption } from '../../UsersPage/util/with-current-option';
import {
  ADD_EMPLOYEE_FORM_ID,
  LABOR_BURDEN_TYPE_OPTIONS,
  MOBILE_ACCESS_HELPER,
} from '../constant';
import { EmployeeFormSection } from './EmployeeFormSection';
import { FormSelectField, FormSwitchField } from './form';

export interface AddEmployeeFormProps {
  onSubmit: (values: EmployeeCreateForm, profilePhotoFile: File | null) => void;
  queryClient: QueryClient;
}

const gridTwo = 'grid grid-cols-1 gap-4 md:grid-cols-2';
const gridThree = 'grid grid-cols-1 gap-4 md:grid-cols-3';
const gridFour = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4';
const sectionFieldStack = 'gap-3.5';

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
  const roleName = form.watch('roleName');

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

  const roleOptions = useMemo(
    () => withCurrentOption([], roleName),
    [roleName],
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
      form.setValue('officePhone', phoneDigitsOnly(user.phoneNumber));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setProfilePhotoFile(file);
    setPhotoLabel(file?.name ?? 'Upload');
  };

  const handleFormSubmit = (values: EmployeeCreateForm) => {
    onSubmit(values, profilePhotoFile);
  };

  return (
    <FormProvider {...form}>
      <form
        className="min-h-0 flex-1 overflow-y-auto rounded-[10px] border-[1.5px] border-border bg-surface"
        id={ADD_EMPLOYEE_FORM_ID}
        noValidate
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        <div className="flex flex-col gap-7 p-6">
          <EmployeeFormSection icon={UsersIcon} title="Select existing user">
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[258px_258px_minmax(0,1fr)] md:items-end">
              <FormSelectField<EmployeeCreateForm>
                label="Select User"
                name="userId"
                onValueChange={handleUserChange}
                options={userOptions}
                placeholder="Select existing user"
              />
              <SelectField
                disabled
                label="Role"
                options={roleOptions}
                placeholder="Select role"
                required
                value={roleName}
                variant="soft"
              />
              <div className="flex w-full items-center justify-end md:pb-0.5">
                <FormSwitchField<EmployeeCreateForm>
                  label="Is Active"
                  name="isActive"
                />
              </div>
            </div>
          </EmployeeFormSection>

          <EmployeeFormSection
            icon={SettingsUserIcon}
            title="Personal information"
          >
            <div className={gridFour}>
              <div className="flex flex-col gap-1">
                <span className="text-caption font-medium text-surface-foreground">
                  Image
                </span>
                <button
                  className="flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-surface px-3 text-foreground-subtle transition-colors hover:border-action hover:text-action"
                  onClick={handlePhotoClick}
                  type="button"
                >
                  <ImportIcon aria-hidden className="size-[18px]" />
                  <span className="text-[11px] leading-[16.5px]">
                    {photoLabel}
                  </span>
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
              <FormDatePicker<EmployeeCreateForm>
                disableFutureDates
                label="DOB"
                name="birthDate"
                placeholder="Select date"
              />
            </div>
          </EmployeeFormSection>

          <EmployeeFormSection
            contentClassName={sectionFieldStack}
            icon={PhoneLineIcon}
            title="Contact details"
          >
            <div className={gridTwo}>
              <FormEmailInput<EmployeeCreateForm>
                label="Personal Email"
                name="personalEmail"
                placeholder="eg. dan@gmail.com"
              />
              <FormPhoneInput<EmployeeCreateForm>
                label="Personal Phone"
                name="personalPhone"
                placeholder="eg. +91 454 455 56"
              />
              <FormEmailInput<EmployeeCreateForm>
                label="Office Email"
                name="officeEmail"
                placeholder="eg. dan@gmail.com"
                required
              />
              <FormPhoneInput<EmployeeCreateForm>
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
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1 sm:max-w-sm">
                <FormSelectField<EmployeeCreateForm>
                  label="Country"
                  name="country"
                  onValueChange={handleCountryChange}
                  options={countryOptions}
                  placeholder="Select country"
                  required
                />
              </div>
              <div className="pb-1">
                <FormSwitchField<EmployeeCreateForm>
                  label="Verify with Google"
                  name="verifyWithGoogle"
                />
              </div>
            </div>
            <div className={gridThree}>
              <FormTextInput<EmployeeCreateForm>
                label="Zip Code"
                name="postalCode"
                placeholder="Enter code"
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
              <FormSelectField<EmployeeCreateForm>
                disabled={!country}
                label="State"
                name="state"
                onValueChange={handleStateChange}
                options={stateOptions}
                placeholder="Select state"
                required
              />
            </div>
          </EmployeeFormSection>

          <EmployeeFormSection
            contentClassName={sectionFieldStack}
            icon={BriefcaseIcon}
            title="Employment details"
          >
            <div className={gridThree}>
              <FormDatePicker<EmployeeCreateForm>
                label="Hire Date"
                name="hireDate"
                placeholder="Select date"
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
            </div>
            <div className={gridThree}>
              <FormTextInput<EmployeeCreateForm>
                label="Regular Rate"
                name="regularRate"
                placeholder="Enter rate"
              />
              <TextInput
                className="bg-muted"
                disabled
                label="Overtime Rate"
                placeholder="$0.00"
                value="$0.00"
                variant="soft"
              />
              <TextInput
                className="bg-muted"
                disabled
                label="Double Time Rate"
                placeholder="$0.00"
                value="$0.00"
                variant="soft"
              />
            </div>
            <div className="pt-0.5">
              <FormSwitchField<EmployeeCreateForm>
                label="Is Technician"
                name="isTechnician"
              />
            </div>
          </EmployeeFormSection>

          <EmployeeFormSection icon={MobileIcon} title="Mobile access">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-5">
              <div className="flex flex-col gap-3">
                <FormSwitchField<EmployeeCreateForm>
                  label="Mobile Access"
                  name="mobileAccess"
                />
                <p className="text-[11px] leading-4 text-foreground-subtle">
                  {MOBILE_ACCESS_HELPER}
                </p>
                {mobileAccess ? (
                  <FormPhoneInput<EmployeeCreateForm>
                    label="Masked Phone"
                    name="maskedPhone"
                    placeholder="eg. +91 454 455 56"
                    required
                  />
                ) : null}
              </div>
              {mobileAccess ? (
                <FormTextarea<EmployeeCreateForm>
                  className="min-h-[114px]"
                  label="Bio"
                  name="bio"
                  placeholder="Enter bio"
                  rows={5}
                />
              ) : null}
            </div>
            {mobileAccess ? (
              <>
                <div className={gridFour}>
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
                </div>
                <div className={`${gridTwo} max-w-2xl`}>
                  <FormTimePicker<EmployeeCreateForm>
                    clearable
                    label="Start Time"
                    name="startTime"
                    placeholder="Select time"
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
          </EmployeeFormSection>
        </div>
      </form>
    </FormProvider>
  );
};
