import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { customerListQueryOptions } from '@cms/customer-data-access';
import { BodySmall, cn, SearchIcon, TextInput } from '@cms/ui';
import { BILL_TO_SEARCH_EMPTY, BILL_TO_SEARCH_PLACEHOLDER } from '../constant';
import type { BillToSearchFieldProps } from '../types';

const formatCustomerLabel = (
  displayName: string | null | undefined,
  name: string | null | undefined,
  customerNumber: string | null | undefined,
): string => {
  const primary = displayName?.trim() || name?.trim() || 'Customer';
  if (customerNumber?.trim()) {
    return `${primary} (${customerNumber.trim()})`;
  }
  return primary;
};

export const BillToSearchField = ({
  onSelectCustomer,
  queryClient,
}: BillToSearchFieldProps) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(handle);
  }, [search]);

  const listQuery = useQuery(
    {
      ...customerListQueryOptions({
        search: debouncedSearch || undefined,
        isActive: true,
        page: 1,
        pageSize: 20,
      }),
      enabled: debouncedSearch.length > 0 && open,
    },
    queryClient,
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setOpen(true);
  };

  const handleSelect = (customerId: number) => {
    onSelectCustomer(customerId);
    setSearch('');
    setDebouncedSearch('');
    setOpen(false);
  };

  const items = listQuery.data?.items ?? [];
  const showResults = open && debouncedSearch.length > 0;

  return (
    <div ref={containerRef} className="relative ml-auto w-full max-w-[12.5rem]">
      <div className="relative">
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-subtle"
        />
        <TextInput
          aria-autocomplete="list"
          aria-expanded={showResults}
          className="h-8 pl-9 text-control"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleSearchChange(event.target.value)
          }
          onFocus={() => setOpen(true)}
          placeholder={BILL_TO_SEARCH_PLACEHOLDER}
          role="combobox"
          value={search}
        />
      </div>
      {showResults ? (
        <ul
          className={cn(
            'absolute right-0 z-20 mt-1 max-h-60 w-[min(100vw-2rem,18rem)] overflow-y-auto rounded-md border border-border bg-surface py-1 shadow-md',
          )}
          role="listbox"
        >
          {listQuery.isPending ? (
            <li className="px-3 py-2">
              <BodySmall color="foreground-subtle">Searching…</BodySmall>
            </li>
          ) : listQuery.isError ? (
            <li className="px-3 py-2">
              <BodySmall color="foreground-subtle">
                Could not search customers.
              </BodySmall>
            </li>
          ) : items.length === 0 ? (
            <li className="px-3 py-2">
              <BodySmall color="foreground-subtle">
                {BILL_TO_SEARCH_EMPTY}
              </BodySmall>
            </li>
          ) : (
            items.map((row) => (
              <li key={row.id}>
                <button
                  className="flex w-full px-3 py-2 text-left text-control hover:bg-secondary"
                  onClick={() => handleSelect(row.id)}
                  role="option"
                  type="button"
                >
                  {formatCustomerLabel(
                    row.displayName,
                    row.name,
                    row.customerNumber,
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
};
