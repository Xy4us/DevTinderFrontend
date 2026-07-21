import { Badge } from "@/components/ui/badge";

export function SkillsBadge({ skills }: { skills?: string[] }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <Badge key={i} variant="secondary" className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-medium">
          {skill}
        </Badge>
      ))}
    </div>
  );
}
