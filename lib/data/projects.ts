export type ProjectCategory = "Web" | "Mobile" | "Automatisation" | "IA";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
}

export const PROJECTS: Project[] = [
  { id: "plateforme-ecommerce", title: "Plateforme e-commerce", category: "Web" },
  { id: "site-vitrine", title: "Site vitrine sur-mesure", category: "Web" },
  { id: "dashboard-analytics", title: "Dashboard analytics temps réel", category: "Web" },
  { id: "app-livraison", title: "Application de livraison", category: "Mobile" },
  { id: "app-reservation", title: "App de réservation en ligne", category: "Mobile" },
  { id: "automatisation-facturation", title: "Automatisation de la facturation", category: "Automatisation" },
  { id: "workflow-crm", title: "Workflow CRM automatisé", category: "Automatisation" },
  { id: "assistant-support", title: "Assistant IA support client", category: "IA" },
  { id: "chatbot-multilingue", title: "Chatbot IA multilingue", category: "IA" },
];
