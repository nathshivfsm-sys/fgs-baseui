import { fetchAuthSessionFromRefreshToken } from './session-from-refresh-token';
import { readStoredSession, writeStoredSession } from './session';

/** Exchanges the stored refresh token for a new access token. Returns false when refresh is impossible or fails. */
export const refreshStoredAccessToken = async (): Promise<boolean> => {
  const stored = readStoredSession();
  const refreshToken = stored?.refreshToken;
  if (!refreshToken) {
    return false;
  }

  try {
    writeStoredSession(await fetchAuthSessionFromRefreshToken(refreshToken));
    return true;
  } catch {
    return false;
  }
};
