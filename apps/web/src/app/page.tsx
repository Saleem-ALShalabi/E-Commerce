import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Welcome to the Shop</h1>
      <p className="max-w-xl text-zinc-600 dark:text-zinc-400">
        A learning project built with Next.js and NestJS. Browse our categories to get started.
      </p>
      <div className="flex gap-3">
        <Link
          href="/products"
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Shop products
        </Link>
        <Link
          href="/categories"
          className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Categories
        </Link>
      </div>
    </section>
  );
}
