import type { Metadata } from "next";
import { Briefcase, CalendarClock, FileText } from "lucide-react";

import { getDashboardStats, getRecentActivity } from "@/lib/data/dashboard";
import { StatCard } from "@/components/admin/stat-card";
import { ActivityFeed } from "@/components/admin/activity-feed";

export const metadata: Metadata = {
  title: "Overview — Admin Afritech",
};

export default async function AdminOverviewPage() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Overview</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Vue d&apos;ensemble de l&apos;activité Afritech.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Devis en attente"
          value={stats.pendingQuoteRequests}
          icon={FileText}
        />
        <StatCard
          label="Rendez-vous à venir"
          value={stats.upcomingAppointments}
          icon={CalendarClock}
        />
        <StatCard
          label="Projets publiés"
          value={stats.publishedProjects}
          icon={Briefcase}
        />
      </div>

      <div className="rounded-xl border border-white/5 bg-surface p-6">
        <h2 className="mb-2 text-lg font-semibold text-text-primary">
          Activité récente
        </h2>
        <ActivityFeed items={activity} />
      </div>
    </div>
  );
}
