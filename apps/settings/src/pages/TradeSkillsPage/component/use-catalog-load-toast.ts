import { useEffect, useRef } from 'react';
import { alert } from '@cms/ui';

interface CatalogLoadToastQuery {
  error: unknown;
  isError: boolean;
}

/** Toasts a list-load failure once per error; dismisses it when the query recovers. */
export const useCatalogLoadToast = (
  query: CatalogLoadToastQuery,
  title: string,
  describe: (error: unknown) => string,
  toastId: string,
) => {
  const didToast = useRef(false);

  useEffect(() => {
    if (!query.isError) {
      if (didToast.current) {
        alert.dismiss(toastId);
        didToast.current = false;
      }
      return;
    }
    didToast.current = true;
    alert.error(title, {
      description: describe(query.error),
      id: toastId,
    });
  }, [describe, query.error, query.isError, title, toastId]);
};
