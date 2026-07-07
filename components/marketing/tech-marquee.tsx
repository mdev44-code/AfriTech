const TECHNOLOGIES = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "GSAP",
  "Prisma",
  "PostgreSQL",
  "NextAuth.js",
  "Node.js",
];

export function TechMarquee() {
  const track = [...TECHNOLOGIES, ...TECHNOLOGIES];

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-surface/40 py-6">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent sm:w-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent sm:w-40"
        aria-hidden="true"
      />

      <span className="sr-only">
        Technologies utilisées : {TECHNOLOGIES.join(", ")}
      </span>

      <div
        className="flex w-max animate-marquee motion-reduce:animate-none"
        aria-hidden="true"
      >
        {track.map((tech, index) => (
          <span
            key={`${tech}-${index}`}
            className="mx-6 flex items-center gap-6 whitespace-nowrap text-lg font-medium text-text-secondary sm:text-xl"
          >
            {tech}
            <span className="text-brand-blue-light">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}
