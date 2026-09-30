import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { SelectOption } from '@cms/ui';
import { alert, Callout } from '@cms/ui';
import type {
  JobCategorySummaryDto,
  SubcategorySummaryDto,
} from '@cms/settings-contract';
import {
  createJobCategoryMutationOptions,
  createSubcategoryMutationOptions,
  patchJobCategoryMutationOptions,
  patchSubcategoryMutationOptions,
  subcategoryListQueryOptions,
  techSkillLevelLookupQueryOptions,
  techTradeLookupQueryOptions,
  toJobCategoryCreateDto,
  toJobCategoryPatchDto,
  toSubcategoryCreateDto,
  toSubcategoryPatchDto,
  type JobCategoryForm,
  type SubcategoryForm,
} from '@cms/settings-data-access';
import {
  ADD_CATEGORY_LABEL,
  ADD_SUBCATEGORY_LABEL,
  CATALOG_LIST_PAGE_SIZE,
  CATEGORY_CREATED_MESSAGE,
  CATEGORY_PANEL_TITLE,
  CATEGORY_UPDATED_MESSAGE,
  SEARCH_CATEGORIES_PLACEHOLDER,
  SUBCATEGORY_CREATED_MESSAGE,
  SUBCATEGORY_UPDATED_MESSAGE,
} from '../constant';
import type { JobCategoryCatalogProps, SubcategoryRow } from '../types';
import {
  describeJobCategoryError,
  describeSubcategoryError,
  filterCategories,
  toCategoryListEntry,
  toSubcategoryRow,
} from '../util';
import { CategoryFormDialog } from './CategoryFormDialog';
import { CategoryListPanel } from './CategoryListPanel';
import { SubcategoryFormDialog } from './SubcategoryFormDialog';
import { SubcategoryTablePanel } from './SubcategoryTablePanel';

const lookupLabel = (
  name: string | null | undefined,
  fallback: string,
): string => name?.trim() || fallback;

const toOptions = (
  records: readonly { id: number; name?: string | null }[],
  fallback: (id: number) => string,
): SelectOption[] =>
  records.map((record) => ({
    value: String(record.id),
    label: lookupLabel(record.name, fallback(record.id)),
  }));

export const JobCategoryCatalog = ({
  categories,
  isError,
  isPending,
  loadError,
  queryClient,
}: JobCategoryCatalogProps) => {
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<JobCategorySummaryDto | null>(null);
  const [subcategoryOpen, setSubcategoryOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] =
    useState<SubcategorySummaryDto | null>(null);

  const entries = useMemo(
    () => categories.map(toCategoryListEntry),
    [categories],
  );
  const filteredEntries = useMemo(
    () => filterCategories(entries, categorySearch),
    [categorySearch, entries],
  );
  const selectedCategory = categories.find(
    (category) => String(category.id) === selectedCategoryId,
  );
  const selectedId = Number(selectedCategoryId);
  const subcategoryQuery = useQuery(
    {
      ...subcategoryListQueryOptions({
        jobCategoryId: Number.isInteger(selectedId) ? selectedId : undefined,
        page: 1,
        pageSize: CATALOG_LIST_PAGE_SIZE,
      }),
      enabled: Number.isInteger(selectedId) && selectedCategoryId != null,
    },
    queryClient,
  );
  const tradeLookup = useQuery(techTradeLookupQueryOptions(true), queryClient);
  const skillLookup = useQuery(
    techSkillLevelLookupQueryOptions(true),
    queryClient,
  );
  const createCategory = useMutation(
    createJobCategoryMutationOptions(queryClient),
    queryClient,
  );
  const patchCategory = useMutation(
    patchJobCategoryMutationOptions(queryClient),
    queryClient,
  );
  const createSubcategory = useMutation(
    createSubcategoryMutationOptions(queryClient),
    queryClient,
  );
  const patchSubcategory = useMutation(
    patchSubcategoryMutationOptions(queryClient),
    queryClient,
  );

  useEffect(() => {
    if (entries.length === 0) {
      setSelectedCategoryId(null);
      return;
    }
    const stillThere = entries.some((entry) => entry.id === selectedCategoryId);
    if (!stillThere) {
      setSelectedCategoryId(entries[0]?.id ?? null);
    }
  }, [entries, selectedCategoryId]);

  const tradeNames = useMemo(() => {
    const names = new Map<number, string>();
    for (const trade of tradeLookup.data ?? []) {
      names.set(trade.id, lookupLabel(trade.name, `Trade ${trade.id}`));
    }
    return names;
  }, [tradeLookup.data]);
  const skillNames = useMemo(() => {
    const names = new Map<number, string>();
    for (const skill of skillLookup.data ?? []) {
      names.set(skill.id, lookupLabel(skill.name, `Skill ${skill.id}`));
    }
    return names;
  }, [skillLookup.data]);
  const subcategoryItems = subcategoryQuery.data?.items ?? [];
  const subcategoryRows = useMemo(
    () =>
      subcategoryItems.map((record) =>
        toSubcategoryRow(record, {
          tradeName: tradeNames.get(record.tradeId),
          skillName:
            record.skillLevelId == null
              ? ''
              : skillNames.get(record.skillLevelId),
        }),
      ),
    [skillNames, subcategoryItems, tradeNames],
  );
  const activeCount = subcategoryRows.filter((row) => row.isActive).length;
  const inactiveCount = subcategoryRows.length - activeCount;
  const tradeOptions = toOptions(tradeLookup.data ?? [], (id) => `Trade ${id}`);
  const skillOptions = toOptions(skillLookup.data ?? [], (id) => `Skill ${id}`);
  const categoryPending = createCategory.isPending || patchCategory.isPending;
  const subcategoryPending =
    createSubcategory.isPending || patchSubcategory.isPending;

  const handleCategorySearchChange = (value: string) => {
    setCategorySearch(value);
  };
  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id);
  };
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryOpen(true);
  };
  const handleCategoryEdit = (categoryId: string) => {
    const match = categories.find(
      (category) => String(category.id) === categoryId,
    );
    if (!match) return;
    setEditingCategory(match);
    setCategoryOpen(true);
  };
  const handleCategoryDialogOpenChange = (open: boolean) => {
    setCategoryOpen(open);
    if (!open) setEditingCategory(null);
  };
  const handleCategorySubmit = (values: JobCategoryForm) => {
    if (editingCategory) {
      patchCategory.mutate(
        { id: editingCategory.id, body: toJobCategoryPatchDto(values) },
        {
          onSuccess: () => {
            setCategoryOpen(false);
            setEditingCategory(null);
            alert.success(CATEGORY_UPDATED_MESSAGE);
          },
          onError: (error) => {
            alert.error(describeJobCategoryError(error));
          },
        },
      );
      return;
    }
    createCategory.mutate(toJobCategoryCreateDto(values), {
      onSuccess: (created) => {
        setSelectedCategoryId(String(created.id));
        setCategoryOpen(false);
        alert.success(CATEGORY_CREATED_MESSAGE);
      },
      onError: (error) => {
        alert.error(describeJobCategoryError(error));
      },
    });
  };
  const handleAddSubcategory = () => {
    if (!selectedCategory) return;
    setEditingSubcategory(null);
    setSubcategoryOpen(true);
  };
  const handleSubcategoryEdit = (row: SubcategoryRow) => {
    const match = subcategoryItems.find((item) => String(item.id) === row.id);
    if (!match) return;
    setEditingSubcategory(match);
    setSubcategoryOpen(true);
  };
  const handleSubcategoryDialogOpenChange = (open: boolean) => {
    setSubcategoryOpen(open);
    if (!open) setEditingSubcategory(null);
  };
  const handleSubcategorySubmit = (values: SubcategoryForm) => {
    if (!selectedCategory) return;
    if (editingSubcategory) {
      patchSubcategory.mutate(
        {
          id: editingSubcategory.id,
          body: toSubcategoryPatchDto(values),
        },
        {
          onSuccess: () => {
            setSubcategoryOpen(false);
            setEditingSubcategory(null);
            alert.success(SUBCATEGORY_UPDATED_MESSAGE);
          },
          onError: (error) => {
            alert.error(describeSubcategoryError(error));
          },
        },
      );
      return;
    }
    createSubcategory.mutate(
      toSubcategoryCreateDto(selectedCategory.id, values),
      {
        onSuccess: () => {
          setSubcategoryOpen(false);
          alert.success(SUBCATEGORY_CREATED_MESSAGE);
        },
        onError: (error) => {
          alert.error(describeSubcategoryError(error));
        },
      },
    );
  };

  const tableStatus = subcategoryQuery.isPending
    ? 'loading'
    : subcategoryQuery.isError
      ? 'error'
      : 'idle';

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {isError ? (
        <Callout title={describeJobCategoryError(loadError)} variant="error" />
      ) : null}
      {subcategoryQuery.isError ? (
        <Callout
          title={describeSubcategoryError(subcategoryQuery.error)}
          variant="error"
        />
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <CategoryListPanel
          addLabel={ADD_CATEGORY_LABEL}
          categories={isPending ? [] : filteredEntries}
          onAdd={handleAddCategory}
          onCategoryEdit={handleCategoryEdit}
          onCategorySelect={handleCategorySelect}
          onSearchChange={handleCategorySearchChange}
          searchPlaceholder={SEARCH_CATEGORIES_PLACEHOLDER}
          searchValue={categorySearch}
          selectedCategoryId={selectedCategoryId}
          title={CATEGORY_PANEL_TITLE}
        />
        <SubcategoryTablePanel
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          onAdd={handleAddSubcategory}
          onEdit={handleSubcategoryEdit}
          rows={subcategoryRows}
          tableStatus={tableStatus}
        />
      </div>
      <CategoryFormDialog
        category={editingCategory}
        isPending={categoryPending}
        onOpenChange={handleCategoryDialogOpenChange}
        onSubmit={handleCategorySubmit}
        open={categoryOpen}
      />
      <SubcategoryFormDialog
        categoryName={selectedCategory?.name ?? ''}
        isPending={subcategoryPending}
        onOpenChange={handleSubcategoryDialogOpenChange}
        onSubmit={handleSubcategorySubmit}
        open={subcategoryOpen}
        record={editingSubcategory}
        skillOptions={skillOptions}
        tradeOptions={tradeOptions}
      />
    </div>
  );
};
