import type { Metadata } from "next";

import { ComingSoon } from "@/components/admin/coming-soon";

export const metadata: Metadata = {
  title: "Devis — Admin Afritech",
};

export default function AdminDevisPage() {
  return <ComingSoon title="Devis" />;
}
