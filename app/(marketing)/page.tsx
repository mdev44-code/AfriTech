import { Contact } from "@/components/marketing/contact";
import { Faq } from "@/components/marketing/faq";
import { Hero } from "@/components/marketing/hero";
import { Process } from "@/components/marketing/process";
import { Projects } from "@/components/marketing/projects";
import { Services } from "@/components/marketing/services";
import { TechMarquee } from "@/components/marketing/tech-marquee";
import { WhyAfritech } from "@/components/marketing/why-afritech";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <Hero />
      <TechMarquee />
      <Services />
      <Process />
      <Projects />
      <WhyAfritech />
      <Faq />
      <Contact />
    </main>
  );
}
