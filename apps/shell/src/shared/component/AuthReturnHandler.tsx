import { LOGIN_ROUTE, useAuth } from '@cms/shared-auth';
import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PublicShell } from './PublicShell';
import { RouteLoadingFallback } from './RouteLoadingFallback';

interface AuthReturnHandlerProps {
  children: ReactNode;
}

/**
 * After external IdP sign-in the app loads with `?token=` on the target route. Exchange
 * that refresh token before `RequireAuth` runs so the query param is not lost on redirect.
 */
export function AuthReturnHandler({ children }: AuthReturnHandlerProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, signInWithRefreshToken } = useAuth();
  const token = searchParams.get('token');
  const [settling, setSettling] = useState(
    () => token !== null && token.length > 0 && !isAuthenticated,
  );

  useEffect(() => {
    if (!token) {
      setSettling(false);
      return;
    }

    if (isAuthenticated) {
      const next = new URLSearchParams(searchParams);
      next.delete('token');
      setSearchParams(next, { replace: true });
      setSettling(false);
      return;
    }

    let cancelled = false;

    const settleReturnToken = async () => {
      const result = await signInWithRefreshToken(token);
      if (cancelled) {
        return;
      }

      if (result.ok) {
        const next = new URLSearchParams(searchParams);
        next.delete('token');
        setSearchParams(next, { replace: true });
        setSettling(false);
        return;
      }

      setSettling(false);
      navigate(LOGIN_ROUTE, {
        replace: true,
        state: { authError: result.message },
      });
    };

    void settleReturnToken();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    navigate,
    searchParams,
    setSearchParams,
    signInWithRefreshToken,
    token,
  ]);

  if (settling) {
    return (
      <PublicShell>
        <div className="flex min-h-0 flex-1 flex-col p-8">
          <RouteLoadingFallback />
        </div>
      </PublicShell>
    );
  }

  return children;
}
