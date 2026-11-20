import { Card } from '@/components/ui/card';

/** Placeholder for pages that are still a task in docs/TASKS.md. Delete it when you build the page. */
export function TodoPage({ title, task }: { title: string; task: string }) {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="text-zinc-500">🚧 Not built yet. See {task} in docs/TASKS.md.</p>
    </Card>
  );
}
