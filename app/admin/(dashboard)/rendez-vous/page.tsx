import type { Metadata } from "next";

import { ComingSoon } from "@/components/admin/coming-soon";

export const metadata: Metadata = {
  title: "Rendez-vous — Admin Afritech",
};

export default function AdminRendezVousPage() {
  return <ComingSoon title="Rendez-vous" />;
}
