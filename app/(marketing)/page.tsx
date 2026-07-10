import { SectionRenderer } from "@/components/marketing/section-renderer";
import { listSections } from "@/lib/data/sections";

export default async function HomePage() {
  const sections = await listSections({ visibleOnly: true });

  return (
    <main className="flex flex-1 flex-col bg-background">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}
