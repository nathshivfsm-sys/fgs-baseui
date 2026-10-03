import { refreshAccessToken, type AuthSessionDto } from '@cms/auth-data-access';
import { mapAuthUserDtoToUserDetails } from './map-auth-user';
import type { AuthSession } from './session';

export const createAuthSessionFromRefreshResponse = (
  refreshToken: string,
  session: AuthSessionDto,
): AuthSession => ({
  token: session.accessToken,
  user: mapAuthUserDtoToUserDetails(session.user),
  refreshToken,
  ...(session.user.tenantId ? { tenantId: session.user.tenantId } : {}),
});

export const fetchAuthSessionFromRefreshToken = async (
  refreshToken: string,
): Promise<AuthSession> => {
  const session = await refreshAccessToken(refreshToken);
  return createAuthSessionFromRefreshResponse(refreshToken, session);
};
