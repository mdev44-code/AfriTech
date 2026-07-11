import { db } from "@/lib/db";
import { getProjectTypeLabel } from "@/lib/data/devis";

export interface DashboardStats {
  pendingQuoteRequests: number;
  upcomingAppointments: number;
  publishedProjects: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();

  const [pendingQuoteRequests, upcomingAppointments, publishedProjects] =
    await Promise.all([
      db.quoteRequest.count({ where: { status: "PENDING" } }),
      db.appointment.count({
        where: {
          scheduledAt: { gte: now },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      }),
      db.project.count({ where: { status: "PUBLISHED" } }),
    ]);

  return { pendingQuoteRequests, upcomingAppointments, publishedProjects };
}

export type ActivityItem = {
  type: "quote_request" | "appointment" | "project";
  id: string;
  label: string;
  detail: string;
  createdAt: Date;
};

export async function getRecentActivity(limit = 8): Promise<ActivityItem[]> {
  const [quoteRequests, appointments, projects] = await Promise.all([
    db.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, name: true, projectType: true, createdAt: true },
    }),
    db.appointment.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, name: true, scheduledAt: true, createdAt: true },
    }),
    db.project.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, title: true, status: true, createdAt: true },
    }),
  ]);

  const items: ActivityItem[] = [
    ...quoteRequests.map((quoteRequest) => ({
      type: "quote_request" as const,
      id: quoteRequest.id,
      label: `Nouvelle demande de devis — ${quoteRequest.name}`,
      detail: getProjectTypeLabel(quoteRequest.projectType),
      createdAt: quoteRequest.createdAt,
    })),
    ...appointments.map((appointment) => ({
      type: "appointment" as const,
      id: appointment.id,
      label: `Nouveau rendez-vous — ${appointment.name}`,
      detail: appointment.scheduledAt.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: appointment.createdAt,
    })),
    ...projects.map((project) => ({
      type: "project" as const,
      id: project.id,
      label: `Projet ${project.status === "PUBLISHED" ? "publié" : "créé"} — ${project.title}`,
      detail: project.status === "PUBLISHED" ? "Publié" : "Brouillon",
      createdAt: project.createdAt,
    })),
  ];

  return items
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}
