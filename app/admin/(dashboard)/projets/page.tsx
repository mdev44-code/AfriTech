import type { Metadata } from "next";

import { ComingSoon } from "@/components/admin/coming-soon";

export const metadata: Metadata = {
  title: "Projets — Admin Afritech",
};

export default function AdminProjetsPage() {
  return <ComingSoon title="Projets" />;
}
