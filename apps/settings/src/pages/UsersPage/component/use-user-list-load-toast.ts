import { useEffect, useRef } from 'react';
import { alert } from '@cms/ui';

interface UserListLoadToastQuery {
  error: unknown;
  isError: boolean;
}

export const useUserListLoadToast = (
  query: UserListLoadToastQuery,
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
