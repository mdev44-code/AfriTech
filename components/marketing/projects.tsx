import { ProjectsClient } from "@/components/marketing/projects-client";
import { listPublishedProjects } from "@/lib/data/projects";

interface ProjectsProps {
  title?: string;
  description?: string;
}

export async function Projects({ title, description }: ProjectsProps) {
  const projects = await listPublishedProjects();

  return <ProjectsClient projects={projects} title={title} description={description} />;
}
