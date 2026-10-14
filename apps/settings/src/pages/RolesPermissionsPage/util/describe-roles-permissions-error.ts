import { describeCatalogError } from '../../../shared';

export const describeRolesPermissionsError = (error: unknown) =>
  describeCatalogError(error, {
    forbidden: 'You do not have permission to view or change roles.',
    notFound: 'That role or permission could not be found.',
    conflict: 'This role or permission assignment already exists.',
    invalid: 'Check the role and permission fields and try again.',
    unreachable: 'Roles and permissions are unavailable. Try again shortly.',
  });
