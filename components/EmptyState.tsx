import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
}

export function EmptyState({ icon: Icon, title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[40vh]">
      <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-full mb-4">
        <Icon className="h-10 w-10 text-zinc-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-zinc-500 max-w-sm">{message}</p>
    </div>
  );
}
