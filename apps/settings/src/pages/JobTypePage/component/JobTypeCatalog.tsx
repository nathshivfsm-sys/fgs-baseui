import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { SelectOption } from '@cms/ui';
import { alert, Callout } from '@cms/ui';
import type {
  JobTypeDetailDto,
  SubcategorySummaryDto,
} from '@cms/settings-contract';
import {
  CATALOG_LIST_PAGE_SIZE,
  JOB_TYPE_CREATED_MESSAGE,
  JOB_TYPE_UPDATED_MESSAGE,
} from '../constant';
import {
  createJobTypeMutationOptions,
  jobTypeKeys,
  jobTypeListQueryOptions,
  loadJobType,
  patchJobTypeMutationOptions,
  subcategoryListQueryOptions,
  techSkillLevelLookupQueryOptions,
  techTradeLookupQueryOptions,
  toJobTypeCreateDto,
  toJobTypePatchDto,
  type JobTypeForm,
} from '@cms/settings-data-access';
import type { JobTypeCatalogProps, JobTypeGroupRow } from '../types';
import {
  describeJobTypeError,
  describeSubcategoryError,
  toJobTypeGroupRow,
} from '../util';
import { JobTypeFormDialog } from './JobTypeFormDialog';
import { JobTypeGroupedTablePanel } from './JobTypeGroupedTablePanel';

const lookupLabel = (
  name: string | null | undefined,
  fallback: string,
): string => name?.trim() || fallback;

export const JobTypeCatalog = ({
  categories,
  queryClient,
}: JobTypeCatalogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<JobTypeDetailDto | null>(null);

  const listQuery = useQuery(
    jobTypeListQueryOptions({
      page: 1,
      pageSize: CATALOG_LIST_PAGE_SIZE,
    }),
    queryClient,
  );
  const jobTypeIds = useMemo(
    () => (listQuery.data?.items ?? []).map((item) => item.id),
    [listQuery.data],
  );
  const detailsQuery = useQuery(
    {
      queryKey: [...jobTypeKeys.details(), { ids: jobTypeIds }],
      enabled: listQuery.isSuccess,
      queryFn: ({ signal }) =>
        Promise.all(jobTypeIds.map((id) => loadJobType(id, { signal }))),
    },
    queryClient,
  );
  const subcategoryQuery = useQuery(
    subcategoryListQueryOptions({
      page: 1,
      pageSize: CATALOG_LIST_PAGE_SIZE,
    }),
    queryClient,
  );
  const tradeLookup = useQuery(techTradeLookupQueryOptions(true), queryClient);
  const skillLookup = useQuery(
    techSkillLevelLookupQueryOptions(true),
    queryClient,
  );
  const createJobType = useMutation(
    createJobTypeMutationOptions(queryClient),
    queryClient,
  );
  const patchJobType = useMutation(
    patchJobTypeMutationOptions(queryClient),
    queryClient,
  );

  const subcategoryById = useMemo(() => {
    const map = new Map<number, SubcategorySummaryDto>();
    for (const item of subcategoryQuery.data?.items ?? []) {
      map.set(item.id, item);
    }
    return map;
  }, [subcategoryQuery.data]);

  const tradeName = (id: number) =>
    lookupLabel(
      tradeLookup.data?.find((item) => item.id === id)?.name,
      `Trade ${id}`,
    );
  const skillName = (id: number) =>
    lookupLabel(
      skillLookup.data?.find((item) => item.id === id)?.name,
      `Skill ${id}`,
    );

  const rows = useMemo(
    () =>
      (detailsQuery.data ?? []).map((detail) =>
        toJobTypeGroupRow(detail, subcategoryById, { skillName, tradeName }),
      ),
    [detailsQuery.data, skillLookup.data, subcategoryById, tradeLookup.data],
  );

  const categoryOptions = useMemo<SelectOption[]>(
    () =>
      categories.map((category) => ({
        value: String(category.id),
        label: lookupLabel(category.name, `Category ${category.id}`),
      })),
    [categories],
  );
  const businessUnitOptions = useMemo<SelectOption[]>(() => {
    const values = new Set<string>();
    for (const detail of detailsQuery.data ?? []) {
      const value = detail.businessUnit?.trim();
      if (value) values.add(value);
    }
    return [...values].sort().map((value) => ({ value, label: value }));
  }, [detailsQuery.data]);

  const activeCount = rows.filter((row) => row.isActive).length;
  const inactiveCount = rows.length - activeCount;
  const waitingForDetails = jobTypeIds.length > 0 && detailsQuery.isPending;
  const tableStatus =
    listQuery.isPending || waitingForDetails
      ? 'loading'
      : listQuery.isError || detailsQuery.isError
        ? 'error'
        : 'idle';

  const handleAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const handleEdit = (row: JobTypeGroupRow) => {
    const match = (detailsQuery.data ?? []).find(
      (detail) => String(detail.id) === row.id,
    );
    if (!match) return;
    setEditing(match);
    setDialogOpen(true);
  };
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditing(null);
  };
  const handleSubmit = (values: JobTypeForm) => {
    if (editing) {
      patchJobType.mutate(
        { id: editing.id, body: toJobTypePatchDto(values, editing) },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditing(null);
            alert.success(JOB_TYPE_UPDATED_MESSAGE);
          },
          onError: (error) => {
            alert.error(describeJobTypeError(error));
          },
        },
      );
      return;
    }
    createJobType.mutate(toJobTypeCreateDto(values), {
      onSuccess: () => {
        setDialogOpen(false);
        alert.success(JOB_TYPE_CREATED_MESSAGE);
      },
      onError: (error) => {
        alert.error(describeJobTypeError(error));
      },
    });
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {listQuery.isError ? (
        <Callout
          title={describeJobTypeError(listQuery.error)}
          variant="error"
        />
      ) : null}
      {detailsQuery.isError ? (
        <Callout
          title={describeJobTypeError(detailsQuery.error)}
          variant="error"
        />
      ) : null}
      {subcategoryQuery.isError ? (
        <Callout
          title={describeSubcategoryError(subcategoryQuery.error)}
          variant="error"
        />
      ) : null}
      <JobTypeGroupedTablePanel
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        onAdd={handleAdd}
        onEdit={handleEdit}
        rows={tableStatus === 'loading' ? [] : rows}
        tableStatus={tableStatus}
      />
      <JobTypeFormDialog
        businessUnitOptions={businessUnitOptions}
        categories={categoryOptions}
        isPending={createJobType.isPending || patchJobType.isPending}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSubmit}
        open={dialogOpen}
        record={editing}
        subcategories={subcategoryQuery.data?.items ?? []}
      />
    </div>
  );
};
