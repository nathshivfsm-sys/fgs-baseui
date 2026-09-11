import { AUTH_REFRESH_ENDPOINT } from '@cms/auth-data-access';
import { http, HttpResponse } from 'msw';

/**
 * Wire body of `POST /auth/refresh`. Numbers for `tenantId` / `companyId` match
 * the live API; Zod coerces them to strings before the session is stored.
 * `companyId: 1` is the path key Settings uses for `GET /company/{companyId}`.
 */
const refreshSuccessBody = {
  success: true,
  statusCode: 200,
  data: {
    accessToken: 'mock-access-token',
    tokenType: 'Bearer',
    user: {
      userId: 'usr_mock_jordan_reed',
      tenantId: 52,
      companyId: 1,
      firstName: 'Jordan',
      lastName: 'Reed',
      email: 'jordan.reed@acme.example.com',
      roles: ['TENANT_ADMIN'],
    },
  },
};

function errorBody(statusCode: number, message: string) {
  return {
    success: false,
    statusCode,
    errors: [message],
  };
}

/**
 * Intercepts `customFetch(AUTH_REFRESH_ENDPOINT)`. The path is relative so it
 * matches both `http://localhost:4200` and `http://127.0.0.1:4200`.
 */
export const authHandlers = [
  http.post(`/api/v1${AUTH_REFRESH_ENDPOINT}`, async ({ request }) => {
    let refreshToken: unknown;
    try {
      const body: unknown = await request.json();
      refreshToken =
        typeof body === 'object' && body !== null && 'refreshToken' in body
          ? body.refreshToken
          : undefined;
    } catch {
      return HttpResponse.json(errorBody(400, 'refreshToken is required.'), {
        status: 400,
      });
    }

    if (typeof refreshToken !== 'string' || refreshToken.length === 0) {
      return HttpResponse.json(errorBody(400, 'refreshToken is required.'), {
        status: 400,
      });
    }

    return HttpResponse.json(refreshSuccessBody);
  }),
];
