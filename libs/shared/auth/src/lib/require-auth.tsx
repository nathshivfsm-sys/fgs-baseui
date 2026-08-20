import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './auth-context';

export const LOGIN_ROUTE = '/login';

/**
 * Route guard for a protected sub-tree. Usable from the host and from any remote, since
 * `@cms/shared-auth` is a Module Federation singleton — the remote sees the host's
 * session rather than a second context instance.
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // `from` lets the login screen send the user back to what they asked for.
    return <Navigate to={LOGIN_ROUTE} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
