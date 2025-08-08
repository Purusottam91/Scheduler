import { TaskCalendar } from '@/components/task-calendar';
import { LayoutGrid } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">TaskWise</h1>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <TaskCalendar />
      </main>
    </div>
  );
}
