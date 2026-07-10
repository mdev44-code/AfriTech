import type { AppointmentStatus } from "@prisma/client";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/data/rendez-vous";

const VARIANT_BY_STATUS: Record<AppointmentStatus, BadgeProps["variant"]> = {
  PENDING: "outline",
  CONFIRMED: "success",
  CANCELLED: "destructive",
  COMPLETED: "muted",
};

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  return (
    <Badge variant={VARIANT_BY_STATUS[status]}>
      {APPOINTMENT_STATUS_LABELS[status]}
    </Badge>
  );
}
