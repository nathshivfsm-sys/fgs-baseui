import type { UserSummaryDto } from '@cms/user-contract';

export interface RoleUsersTabProps {
  loading: boolean;
  roleName: string;
  users: UserSummaryDto[];
}
