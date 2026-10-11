import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type {
  PagedResult,
  SetupDescriptionSummaryDto,
} from '@cms/settings-contract';
import {
  createSetupDescriptionMutationOptions,
  patchSetupDescriptionMutationOptions,
  setupDescriptionKeys,
  setupDescriptionListQueryOptions,
  techTradeLookupQueryOptions,
  toSetupDescriptionCreateDto,
  toSetupDescriptionUpdateDto,
  updateSetupDescriptionMutationOptions,
  type SetupDescriptionForm,
} from '@cms/settings-data-access';
import { gloSetupDescriptionTypeLookupQueryOptions } from '@cms/shared-data-access';
import { alert } from '@cms/ui';
import {
  StandardDescriptionDeactivateDialog,
  StandardDescriptionFormDialog,
  StandardDescriptionHeader,
  StandardDescriptionTablePanel,
  StandardDescriptionTypeNavPanel,
} from './component';
import {
  CREATE_SUCCESS_MESSAGE,
  CREATE_SUCCESS_TITLE,
  DEACTIVATE_ERROR_TITLE,
  DEACTIVATE_SUCCESS_MESSAGE,
  DEACTIVATE_SUCCESS_TITLE,
  DESCRIPTION_TYPE_NAV,
  REACTIVATE_SUCCESS_MESSAGE,
  REACTIVATE_SUCCESS_TITLE,
  SAVE_ERROR_TITLE,
  TRADE_FIELD_TYPE_CODES,
  UPDATE_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_TITLE,
} from './constant';
import type {
  StandardDescriptionListFilters,
  StandardDescriptionPageProps,
} from './types';
import { emptyStandardDescriptionListFilters } from './types';
import {
  describeStandardDescriptionError,
  descriptionTypeFromSearch,
  findDescriptionTypeLabel,
} from './util';

export const StandardDescriptionPage = ({
  queryClient,
}: StandardDescriptionPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTypeCode = descriptionTypeFromSearch(searchParams.get('type'));
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<SetupDescriptionSummaryDto | null>(null);
  const [deactivatingRecord, setDeactivatingRecord] =
    useState<SetupDescriptionSummaryDto | null>(null);
  const [appliedFilters, setAppliedFilters] =
    useState<StandardDescriptionListFilters>(
      emptyStandardDescriptionListFilters(),
    );

  const typeLookupQuery = useQuery(
    gloSetupDescriptionTypeLookupQueryOptions(true),
    queryClient,
  );

  const showTradeColumn = TRADE_FIELD_TYPE_CODES.has(selectedTypeCode);
  const showTradeField = showTradeColumn;

  const tradeLookupQuery = useQuery(
    {
      ...techTradeLookupQueryOptions(true),
      enabled: showTradeColumn || (formOpen && showTradeField),
    },
    queryClient,
  );

  const typeCodes = useMemo(() => {
    const fromApi =
      typeLookupQuery.data
        ?.map((item) => item.code)
        .filter((code): code is string => Boolean(code)) ?? [];
    if (fromApi.length > 0) return fromApi;
    return DESCRIPTION_TYPE_NAV.map((item) => item.code);
  }, [typeLookupQuery.data]);

  const selectedActiveCountQuery = useQuery(
    setupDescriptionListQueryOptions({
      page: 1,
      pageSize: 1,
      isActive: true,
      descriptionTypeCode: selectedTypeCode,
    }),
    queryClient,
  );
  const selectedInactiveCountQuery = useQuery(
    setupDescriptionListQueryOptions({
      page: 1,
      pageSize: 1,
      isActive: false,
      descriptionTypeCode: selectedTypeCode,
    }),
    queryClient,
  );

  const readCachedTypeCount = (
    code: string,
    isActive: boolean,
  ): number | undefined => {
    const cached = queryClient.getQueryData<
      PagedResult<SetupDescriptionSummaryDto>
    >(
      setupDescriptionKeys.list({
        page: 1,
        pageSize: 1,
        isActive,
        descriptionTypeCode: code,
      }),
    );
    return cached?.totalCount;
  };

  const activeCountsByType = useMemo(() => {
    const counts: Record<string, number | undefined> = {};
    for (const code of typeCodes) {
      if (code === selectedTypeCode) {
        counts[code] = selectedActiveCountQuery.data?.totalCount;
      } else {
        counts[code] = readCachedTypeCount(code, true);
      }
    }
    return counts;
  }, [selectedActiveCountQuery.data, selectedTypeCode, typeCodes, queryClient]);

  const inactiveCountsByType = useMemo(() => {
    const counts: Record<string, number | undefined> = {};
    for (const code of typeCodes) {
      if (code === selectedTypeCode) {
        counts[code] = selectedInactiveCountQuery.data?.totalCount;
      } else {
        counts[code] = readCachedTypeCount(code, false);
      }
    }
    return counts;
  }, [
    selectedInactiveCountQuery.data,
    selectedTypeCode,
    typeCodes,
    queryClient,
  ]);

  const createMutation = useMutation(
    createSetupDescriptionMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updateSetupDescriptionMutationOptions(queryClient),
    queryClient,
  );
  const patchMutation = useMutation(
    patchSetupDescriptionMutationOptions(queryClient),
    queryClient,
  );

  const typeLabel = findDescriptionTypeLabel(
    selectedTypeCode,
    typeLookupQuery.data,
  );

  const tradeOptions = useMemo(
    () =>
      (tradeLookupQuery.data ?? []).map((trade) => ({
        id: trade.id,
        label:
          trade.name?.trim() || trade.tradeCode?.trim() || String(trade.id),
      })),
    [tradeLookupQuery.data],
  );

  const formPending = createMutation.isPending || updateMutation.isPending;

  const handleTypeChange = (code: string) => {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        params.set('type', code);
        return params;
      },
      { replace: true },
    );
    setAppliedFilters(emptyStandardDescriptionListFilters());
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const handleEdit = (record: SetupDescriptionSummaryDto) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleDeactivate = (record: SetupDescriptionSummaryDto) => {
    if (!record.isActive) return;
    setDeactivatingRecord(record);
  };

  const handleReactivate = (record: SetupDescriptionSummaryDto) => {
    if (record.isActive || patchMutation.isPending) return;
    patchMutation.mutate(
      { id: record.id, body: { isActive: true } },
      {
        onError: (error) => {
          alert.error(DEACTIVATE_ERROR_TITLE, {
            description: describeStandardDescriptionError(error),
          });
        },
        onSuccess: () => {
          alert.success(REACTIVATE_SUCCESS_TITLE, {
            description: REACTIVATE_SUCCESS_MESSAGE,
          });
        },
      },
    );
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingRecord(null);
  };

  const handleDeactivateOpenChange = (open: boolean) => {
    if (!open) setDeactivatingRecord(null);
  };

  const handleFiltersApply = (filters: StandardDescriptionListFilters) => {
    setAppliedFilters(filters);
  };

  const handleFiltersClear = () => {
    setAppliedFilters(emptyStandardDescriptionListFilters());
  };

  const handleWriteError = (error: unknown) => {
    alert.error(SAVE_ERROR_TITLE, {
      description: describeStandardDescriptionError(error),
    });
  };

  const handleFormSubmit = (values: SetupDescriptionForm) => {
    if (formPending) return;
    if (editingRecord) {
      updateMutation.mutate(
        {
          id: editingRecord.id,
          body: toSetupDescriptionUpdateDto(values, editingRecord),
        },
        {
          onError: handleWriteError,
          onSuccess: () => {
            alert.success(UPDATE_SUCCESS_TITLE, {
              description: UPDATE_SUCCESS_MESSAGE,
            });
            setFormOpen(false);
            setEditingRecord(null);
          },
        },
      );
      return;
    }
    const nextSortOrder =
      (activeCountsByType[selectedTypeCode] ?? 0) +
      (inactiveCountsByType[selectedTypeCode] ?? 0) +
      1;
    createMutation.mutate(
      toSetupDescriptionCreateDto(values, selectedTypeCode, nextSortOrder),
      {
        onError: handleWriteError,
        onSuccess: () => {
          alert.success(CREATE_SUCCESS_TITLE, {
            description: CREATE_SUCCESS_MESSAGE,
          });
          setFormOpen(false);
        },
      },
    );
  };

  const handleDeactivateConfirm = () => {
    if (!deactivatingRecord || patchMutation.isPending) return;
    patchMutation.mutate(
      { id: deactivatingRecord.id, body: { isActive: false } },
      {
        onError: (error) => {
          alert.error(DEACTIVATE_ERROR_TITLE, {
            description: describeStandardDescriptionError(error),
          });
        },
        onSuccess: () => {
          alert.success(DEACTIVATE_SUCCESS_TITLE, {
            description: DEACTIVATE_SUCCESS_MESSAGE,
          });
          setDeactivatingRecord(null);
        },
      },
    );
  };

  return (
    <section
      className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      data-testid="standard-description-page"
    >
      <StandardDescriptionHeader />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface lg:flex-row">
        <StandardDescriptionTypeNavPanel
          activeCountsByType={activeCountsByType}
          inactiveCountsByType={inactiveCountsByType}
          onTypeChange={handleTypeChange}
          selectedTypeCode={selectedTypeCode}
          typeOptions={typeLookupQuery.data}
        />
        <StandardDescriptionTablePanel
          activeCount={activeCountsByType[selectedTypeCode] ?? 0}
          appliedFilters={appliedFilters}
          descriptionTypeCode={selectedTypeCode}
          inactiveCount={inactiveCountsByType[selectedTypeCode] ?? 0}
          onAdd={handleAdd}
          onDeactivate={handleDeactivate}
          onEdit={handleEdit}
          onFiltersApply={handleFiltersApply}
          onFiltersClear={handleFiltersClear}
          onReactivate={handleReactivate}
          queryClient={queryClient}
          showTradeColumn={showTradeColumn}
          tradeOptions={tradeOptions}
          typeOptions={typeLookupQuery.data}
        />
      </div>
      <StandardDescriptionFormDialog
        descriptionTypeCode={selectedTypeCode}
        descriptionTypeLabel={typeLabel}
        isPending={formPending}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        open={formOpen}
        record={editingRecord}
        showTradeField={showTradeField}
        tradeOptions={tradeOptions}
      />
      <StandardDescriptionDeactivateDialog
        isPending={patchMutation.isPending}
        onConfirm={handleDeactivateConfirm}
        onOpenChange={handleDeactivateOpenChange}
        open={deactivatingRecord != null}
        record={deactivatingRecord}
      />
    </section>
  );
};
