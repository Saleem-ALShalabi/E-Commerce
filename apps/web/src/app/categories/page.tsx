import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import type { Category, Paginated } from '@/lib/types';

export const metadata = { title: 'Categories' };

/**
 * ★ REFERENCE PAGE ★  – copy this pattern for Products, Orders...
 *
 * - This is a SERVER component (no 'use client'), so it can `await` data directly.
 * - While it loads, Next.js shows ./loading.tsx
 * - If api() throws, Next.js shows ./error.tsx
 */
export default async function CategoriesPage() {
  const { data: categories } = await api<Paginated<Category>>('/categories?limit=100');

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Categories</h1>

      {categories.length === 0 ? (
        <p className="text-zinc-500">No categories yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              {/* Task A2 builds /products?category=<slug> */}
              <Link href={`/products?category=${category.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  {category.description && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {category.description}
                    </p>
                  )}
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
