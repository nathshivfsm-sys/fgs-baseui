import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ADD_CATEGORY_LABEL,
  CATEGORY_PANEL_TITLE,
  SEARCH_CATEGORIES_PLACEHOLDER,
} from './constant';
import {
  CategoryListPanel,
  JobTypeCatalogNavPanel,
  JobTypeGroupedTablePanel,
  JobTypeHeader,
  SubcategoryTablePanel,
} from './component';
import type { JobTypeCatalog } from './types';
import {
  catalogFromSearch,
  filterCategories,
  PLACEHOLDER_CATEGORIES,
  PLACEHOLDER_SUBCATEGORIES,
} from './util';

export function JobTypePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalog = catalogFromSearch(searchParams.get('catalog'));
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    PLACEHOLDER_CATEGORIES[0]?.id ?? null,
  );
  const listEntries = PLACEHOLDER_CATEGORIES;
  const filteredList = useMemo(
    () => filterCategories(listEntries, categorySearch),
    [categorySearch, listEntries],
  );
  const selectedListId = selectedCategoryId;

  const subcategoryRows = useMemo(() => {
    if (catalog !== 'category' || !selectedCategoryId) {
      return [];
    }
    return PLACEHOLDER_SUBCATEGORIES.filter(
      (row) => row.categoryId === selectedCategoryId,
    );
  }, [catalog, selectedCategoryId]);

  const subcategoryActiveCount = subcategoryRows.filter(
    (row) => row.isActive,
  ).length;
  const subcategoryInactiveCount = subcategoryRows.filter(
    (row) => !row.isActive,
  ).length;

  const handleCatalogChange = (next: JobTypeCatalog) => {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        if (next === 'category') {
          params.delete('catalog');
        } else {
          params.set('catalog', next);
        }
        return params;
      },
      { replace: true },
    );
    setCategorySearch('');
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id);
  };

  const handleCategoryEdit = (_categoryId: string) => {
    // Dialog wiring follows catalog API integration.
  };

  const handleAddCategory = () => {
    // Dialog wiring follows catalog API integration.
  };

  const handleAddSubcategory = () => {
    // Dialog wiring follows catalog API integration.
  };

  const handleSubcategoryEdit = (_row: (typeof PLACEHOLDER_SUBCATEGORIES)[number]) => {
    // Dialog wiring follows catalog API integration.
  };

  const handleSearchChange = (value: string) => {
    setCategorySearch(value);
  };

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-testid="job-type-setup"
    >
      <JobTypeHeader />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface lg:min-h-[32rem] lg:flex-row">
        <JobTypeCatalogNavPanel
          catalog={catalog}
          onCatalogChange={handleCatalogChange}
        />
        {catalog === 'category' ? (
          <>
            <CategoryListPanel
              addLabel={ADD_CATEGORY_LABEL}
              categories={filteredList}
              onAdd={handleAddCategory}
              onCategoryEdit={handleCategoryEdit}
              onCategorySelect={handleCategorySelect}
              onSearchChange={handleSearchChange}
              searchPlaceholder={SEARCH_CATEGORIES_PLACEHOLDER}
              searchValue={categorySearch}
              selectedCategoryId={selectedListId}
              title={CATEGORY_PANEL_TITLE}
            />
            <SubcategoryTablePanel
              activeCount={subcategoryActiveCount}
              inactiveCount={subcategoryInactiveCount}
              onAdd={handleAddSubcategory}
              onEdit={handleSubcategoryEdit}
              rows={subcategoryRows}
            />
          </>
        ) : (
          <JobTypeGroupedTablePanel />
        )}
      </div>
    </section>
  );
}
