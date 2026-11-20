/**
 * ★ The ONLY place that talks to the backend. ★
 *
 * Usage (server or client component):
 *   const categories = await api<Paginated<Category>>('/categories');
 *   const res = await api<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } });
 *   const me  = await api<PublicUser>('/users/me', { token });
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

/** Thrown when the API answers with an error status (4xx / 5xx). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiOptions = Omit<RequestInit, 'body'> & {
  /** Plain object – it is JSON-encoded for you. */
  body?: unknown;
  /** JWT access token for protected routes. */
  token?: string | null;
};

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!res.ok) {
    // NestJS errors look like: { statusCode, message: string | string[], error }
    const payload = await res.json().catch(() => null);
    const message = Array.isArray(payload?.message)
      ? payload.message.join(', ')
      : (payload?.message ?? res.statusText);
    throw new ApiError(res.status, message, payload);
  }

  // 204 No Content (e.g. DELETE) has no body
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
