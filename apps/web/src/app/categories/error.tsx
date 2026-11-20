'use client'; // error boundaries must be client components

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/** Shown automatically when page.tsx throws (e.g. the API is down). */
export default function CategoriesError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <h2 className="mb-2 text-xl font-semibold">Could not load categories</h2>
      <p className="mb-4 text-sm text-zinc-500">
        {process.env.NODE_ENV === 'development' ? error.message : 'Please try again in a moment.'}
      </p>
      <Button onClick={reset}>Try again</Button>
    </Card>
  );
}
