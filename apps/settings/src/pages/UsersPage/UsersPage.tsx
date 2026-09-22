import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createUsersMutationOptions,
  roleLookupQueryOptions,
  userListQueryOptions,
} from '@cms/user-data-access';
import { alert } from '@cms/ui';
import {
  InviteUserDialog,
  UserTablePanel,
  UsersHeader,
  UsersSummaryCards,
} from './component';
import {
  SAVE_ERROR_TITLE,
  SAVE_SUCCESS_TITLE,
  USER_INVITED_MESSAGE,
} from './constant';
import type { UsersPageProps } from './types';
import { describeUserError, type InviteUserForm } from './util';

export const UsersPage = ({ queryClient }: UsersPageProps) => {
  const [inviteOpen, setInviteOpen] = useState(false);

  const rolesQuery = useQuery(roleLookupQueryOptions(true), queryClient);
  const activeCountQuery = useQuery(
    userListQueryOptions({ page: 1, pageSize: 1, isActive: true }),
    queryClient,
  );
  const inactiveCountQuery = useQuery(
    userListQueryOptions({ page: 1, pageSize: 1, isActive: false }),
    queryClient,
  );
  const summaryQuery = useQuery(
    userListQueryOptions({
      page: 1,
      pageSize: 1,
      includeSummary: true,
    }),
    queryClient,
  );

  const createUsersMutation = useMutation(
    createUsersMutationOptions(queryClient),
    queryClient,
  );

  const activeCount = activeCountQuery.data?.totalCount ?? 0;
  const inactiveCount = inactiveCountQuery.data?.totalCount ?? 0;

  const handleAddUser = () => {
    setInviteOpen(true);
  };

  const handleInviteOpenChange = (open: boolean) => {
    setInviteOpen(open);
  };

  const handleInviteSubmit = (values: InviteUserForm) => {
    createUsersMutation.mutate(
      [
        {
          displayName: values.displayName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          roleIds: [Number(values.roleId)],
          authenticationMethod: values.authenticationMethod,
        },
      ],
      {
        onError: (error) => {
          alert.error(SAVE_ERROR_TITLE, {
            description: describeUserError(error),
          });
        },
        onSuccess: () => {
          alert.success(SAVE_SUCCESS_TITLE, {
            description: USER_INVITED_MESSAGE,
          });
          setInviteOpen(false);
        },
      },
    );
  };

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-testid="users-page"
    >
      <UsersHeader />

      <UsersSummaryCards
        loading={summaryQuery.isPending}
        summary={summaryQuery.data?.summary}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <UserTablePanel
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          onAdd={handleAddUser}
          queryClient={queryClient}
        />
      </div>

      <InviteUserDialog
        isPending={createUsersMutation.isPending}
        onOpenChange={handleInviteOpenChange}
        onSubmit={handleInviteSubmit}
        open={inviteOpen}
        roles={rolesQuery.data}
      />
    </section>
  );
};
