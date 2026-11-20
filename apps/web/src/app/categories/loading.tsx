/** Shown automatically while page.tsx is loading its data. */
export default function CategoriesLoading() {
  return (
    <section>
      <div className="mb-6 h-9 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
    </section>
  );
}
