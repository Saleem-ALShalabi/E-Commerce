/**
 * Types that mirror what the API returns.
 * Keep them in sync with the backend DTOs / Prisma models (apps/api/prisma/schema.prisma).
 */

export type Role = 'CUSTOMER' | 'ADMIN';

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: PublicUser;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Every paginated endpoint returns this shape. */
export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

// 👉 TASK (Dev A): add `Product` here when you build the products pages.
