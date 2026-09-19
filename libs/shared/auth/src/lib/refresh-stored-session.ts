import { refreshAccessToken } from '@cms/auth-data-access';
import { mapAuthUserDtoToUserDetails } from './map-auth-user';
import { readStoredSession, writeStoredSession } from './session';

/** Exchanges the stored refresh token for a new access token. Returns false when refresh is impossible or fails. */
export const refreshStoredAccessToken = async (): Promise<boolean> => {
  const stored = readStoredSession();
  const refreshToken = stored?.refreshToken;
  if (!refreshToken) {
    return false;
  }

  try {
    const session = await refreshAccessToken(refreshToken);
    writeStoredSession({
      token: session.accessToken,
      user: mapAuthUserDtoToUserDetails(session.user),
      refreshToken,
      ...(session.user.tenantId ? { tenantId: session.user.tenantId } : {}),
    });
    return true;
  } catch {
    return false;
  }
};
