import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-zinc-500">The page you are looking for does not exist.</p>
      <Link href="/" className="underline">
        Back to home
      </Link>
    </section>
  );
}
