import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  DEVIS_DISPLAY_STATUS_LABELS,
  type DevisDisplayStatus,
} from "@/lib/data/devis";

const VARIANT_BY_STATUS: Record<DevisDisplayStatus, BadgeProps["variant"]> = {
  NOUVEAU: "outline",
  EN_COURS: "warning",
  ENVOYE: "default",
  ACCEPTE: "success",
  REFUSE: "destructive",
};

interface DevisStatusBadgeProps {
  status: DevisDisplayStatus;
}

export function DevisStatusBadge({ status }: DevisStatusBadgeProps) {
  return (
    <Badge variant={VARIANT_BY_STATUS[status]}>
      {DEVIS_DISPLAY_STATUS_LABELS[status]}
    </Badge>
  );
}
