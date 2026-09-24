import { useMutation, useQuery } from '@tanstack/react-query';
import type { BusinessTypeSummaryDto } from '@cms/settings-contract';
import {
  businessTypeListQueryOptions,
  patchBusinessTypeMutationOptions,
} from '@cms/settings-data-access';
import { alert, Callout } from '@cms/ui';
import {
  BUSINESS_TYPE_PAGE_SIZE,
  EMPTY_BUSINESS_TYPES_MESSAGE,
  ENABLE_SUCCESS_MESSAGE,
} from './constant';
import {
  BusinessTypeHeader,
  BusinessTypeList,
  BusinessTypeListSkeleton,
} from './component';
import type { BusinessTypePageProps } from './types';
import { describeBusinessTypeError, sortBusinessTypes } from './util';

export const BusinessTypePage = ({ queryClient }: BusinessTypePageProps) => {
  const listQuery = useQuery(
    businessTypeListQueryOptions({
      page: 1,
      pageSize: BUSINESS_TYPE_PAGE_SIZE,
    }),
    queryClient,
  );
  const enableMutation = useMutation(
    patchBusinessTypeMutationOptions(queryClient),
    queryClient,
  );

  const handleEnable = (record: BusinessTypeSummaryDto) => {
    if (record.isActive || enableMutation.isPending) return;
    enableMutation.mutate(
      { id: record.id, body: { isActive: true } },
      {
        onSuccess: () => {
          alert.success(ENABLE_SUCCESS_MESSAGE);
        },
        onError: (error) => {
          alert.error(describeBusinessTypeError(error));
        },
      },
    );
  };

  const items = sortBusinessTypes(listQuery.data?.items ?? []);
  const enablingId = enableMutation.isPending
    ? enableMutation.variables.id
    : null;

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-testid="business-type-setup"
    >
      <BusinessTypeHeader />
      {listQuery.isPending ? <BusinessTypeListSkeleton /> : null}
      {listQuery.isError ? (
        <Callout title={describeBusinessTypeError(listQuery.error)} variant="error" />
      ) : null}
      {listQuery.isSuccess && items.length === 0 ? (
        <Callout title={EMPTY_BUSINESS_TYPES_MESSAGE} />
      ) : null}
      {listQuery.isSuccess && items.length > 0 ? (
        <BusinessTypeList
          enablingId={enablingId}
          items={items}
          onEnable={handleEnable}
        />
      ) : null}
    </section>
  );
};
