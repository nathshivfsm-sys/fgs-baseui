import { useCallback, useMemo, useState } from 'react';

const STORAGE_PREFIX = 'cms.lead.customer-list.table';

export type ColumnVisibilityState = Record<string, boolean>;
export type ColumnSizingState = Record<string, number>;

type Updater<T> = T | ((old: T) => T);
type OnChangeFn<T> = (updater: Updater<T>) => void;

type StoredCustomerTablePreferences = {
  columnSizing?: ColumnSizingState;
  columnVisibility?: ColumnVisibilityState;
};

const readStoredPreferences = (
  storageKey: string,
): StoredCustomerTablePreferences => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {};
    return JSON.parse(raw) as StoredCustomerTablePreferences;
  } catch {
    return {};
  }
};

const writeStoredPreferences = (
  storageKey: string,
  value: StoredCustomerTablePreferences,
) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(value));
};

export const useCustomerTablePreferences = (userId: string) => {
  const storageKey = `${STORAGE_PREFIX}.${userId}`;
  const initial = useMemo(
    () => readStoredPreferences(storageKey),
    [storageKey],
  );

  const [columnVisibility, setColumnVisibilityState] =
    useState<ColumnVisibilityState>(initial.columnVisibility ?? {});
  const [columnSizing, setColumnSizingState] = useState<ColumnSizingState>(
    initial.columnSizing ?? {},
  );

  const persist = useCallback(
    (next: StoredCustomerTablePreferences) => {
      writeStoredPreferences(storageKey, next);
    },
    [storageKey],
  );

  const onColumnVisibilityChange: OnChangeFn<ColumnVisibilityState> =
    useCallback(
      (updater) => {
        setColumnVisibilityState((current) => {
          const next =
            typeof updater === 'function' ? updater(current) : updater;
          persist({ columnVisibility: next, columnSizing });
          return next;
        });
      },
      [columnSizing, persist],
    );

  const onColumnSizingChange: OnChangeFn<ColumnSizingState> = useCallback(
    (updater) => {
      setColumnSizingState((current) => {
        const next = typeof updater === 'function' ? updater(current) : updater;
        persist({ columnVisibility, columnSizing: next });
        return next;
      });
    },
    [columnVisibility, persist],
  );

  return {
    columnSizing,
    columnVisibility,
    onColumnSizingChange,
    onColumnVisibilityChange,
  };
};
