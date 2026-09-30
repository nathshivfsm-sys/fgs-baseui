import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  jobCategoryListQueryOptions,
  jobTypeCountsQueryOptions,
} from '@cms/settings-data-access';
import { CATALOG_LIST_PAGE_SIZE } from './constant';
import {
  JobCategoryCatalog,
  JobTypeCatalog as JobTypeCatalogView,
  JobTypeCatalogNavPanel,
  JobTypeHeader,
} from './component';
import type { JobTypeCatalog, JobTypePageProps } from './types';
import { catalogFromSearch } from './util';

export const JobTypePage = ({ queryClient }: JobTypePageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalog = catalogFromSearch(searchParams.get('catalog'));
  const categoriesQuery = useQuery(
    jobCategoryListQueryOptions({
      page: 1,
      pageSize: CATALOG_LIST_PAGE_SIZE,
    }),
    queryClient,
  );
  const countsQuery = useQuery(jobTypeCountsQueryOptions(), queryClient);
  const categories = categoriesQuery.data?.items ?? [];
  const categoryCounts = useMemo(() => {
    let active = 0;
    for (const category of categories) {
      if (category.isActive) active += 1;
    }
    return { active, inactive: categories.length - active };
  }, [categories]);

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
          categoryActiveCount={
            categoriesQuery.isSuccess ? categoryCounts.active : undefined
          }
          categoryInactiveCount={
            categoriesQuery.isSuccess ? categoryCounts.inactive : undefined
          }
          jobTypeActiveCount={
            countsQuery.isSuccess ? countsQuery.data.activeCount : undefined
          }
          jobTypeInactiveCount={
            countsQuery.isSuccess ? countsQuery.data.inactiveCount : undefined
          }
          onCatalogChange={handleCatalogChange}
        />
        {catalog === 'category' ? (
          <JobCategoryCatalog
            categories={categories}
            isError={categoriesQuery.isError}
            isPending={categoriesQuery.isPending}
            loadError={categoriesQuery.error}
            queryClient={queryClient}
          />
        ) : (
          <JobTypeCatalogView
            categories={categories}
            queryClient={queryClient}
          />
        )}
      </div>
    </section>
  );
};
