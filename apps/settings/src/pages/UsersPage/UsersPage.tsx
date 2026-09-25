import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { UserSummaryDto } from '@cms/user-contract';
import {
  createUsersMutationOptions,
  roleLookupQueryOptions,
  updateUserMutationOptions,
  userListQueryOptions,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import {
  EditUserDialog,
  InviteUserDialog,
  UserTablePanel,
  UsersHeader,
  UsersSummaryCards,
} from './component';
import {
  SAVE_ERROR_TITLE,
  SAVE_SUCCESS_TITLE,
  UPDATE_SUCCESS_TITLE,
  USER_INVITED_MESSAGE,
  USER_UPDATED_MESSAGE,
} from './constant';
import type { UsersPageProps } from './types';
import {
  describeUserError,
  tabCountsFromUserSummary,
  type EditUserForm,
  type InviteUserForm,
} from './util';

export const UsersPage = ({ queryClient }: UsersPageProps) => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserSummaryDto | null>(null);

  const rolesQuery = useQuery(roleLookupQueryOptions(true), queryClient);
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
  const updateUserMutation = useMutation(
    updateUserMutationOptions(queryClient),
    queryClient,
  );

  const { activeCount, inactiveCount } = tabCountsFromUserSummary(
    summaryQuery.data?.summary,
  );
  const editOpen = editingUser != null;

  const handleAddUser = () => {
    setInviteOpen(true);
  };

  const handleEditUser = (user: UserSummaryDto) => {
    setEditingUser(user);
  };

  const handleInviteOpenChange = (open: boolean) => {
    setInviteOpen(open);
  };

  const handleEditOpenChange = (open: boolean) => {
    if (!open) {
      setEditingUser(null);
    }
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

  const handleEditSubmit = (values: EditUserForm) => {
    if (!editingUser) return;

    updateUserMutation.mutate(
      {
        id: editingUser.id,
        body: {
          displayName: values.displayName,
          phoneNumber: values.phoneNumber,
          roleIds: [Number(values.roleId)],
          isActive: editingUser.isActive,
        },
      },
      {
        onError: (error) => {
          alert.error(SAVE_ERROR_TITLE, {
            description: describeUserError(error),
          });
        },
        onSuccess: () => {
          alert.success(UPDATE_SUCCESS_TITLE, {
            description: USER_UPDATED_MESSAGE,
          });
          setEditingUser(null);
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
          onEdit={handleEditUser}
          queryClient={queryClient}
          roles={rolesQuery.data}
        />
      </div>

      <InviteUserDialog
        isPending={createUsersMutation.isPending}
        onOpenChange={handleInviteOpenChange}
        onSubmit={handleInviteSubmit}
        open={inviteOpen}
        roles={rolesQuery.data}
      />

      <EditUserDialog
        isPending={updateUserMutation.isPending}
        onOpenChange={handleEditOpenChange}
        onSubmit={handleEditSubmit}
        open={editOpen}
        roles={rolesQuery.data}
        user={editingUser}
      />
    </section>
  );
};
