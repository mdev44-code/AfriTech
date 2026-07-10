import { Briefcase, CalendarClock, FileText } from "lucide-react";

import type { ActivityItem } from "@/lib/data/dashboard";

const ACTIVITY_ICONS = {
  quote_request: FileText,
  appointment: CalendarClock,
  project: Briefcase,
} as const;

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-text-secondary">Aucune activité récente.</p>
    );
  }

  return (
    <ul className="divide-y divide-white/5">
      {items.map((item) => {
        const Icon = ACTIVITY_ICONS[item.type];

        return (
          <li key={`${item.type}-${item.id}`} className="flex items-center gap-4 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue/20 text-brand-blue-light">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {item.label}
              </p>
              <p className="truncate text-xs text-text-secondary">{item.detail}</p>
            </div>
            <time className="shrink-0 text-xs text-text-secondary">
              {item.createdAt.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
              })}
            </time>
          </li>
        );
      })}
    </ul>
  );
}
