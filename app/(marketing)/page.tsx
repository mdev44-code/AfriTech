export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <h1 className="text-5xl font-bold tracking-tight text-brand-blue-light sm:text-7xl">
          Afritech
        </h1>
      </section>

      <section
        id="services"
        className="flex min-h-screen scroll-mt-16 flex-col items-center justify-center border-t border-white/5"
      >
        <h2 className="text-3xl font-bold text-text-primary">Services</h2>
      </section>

      <section
        id="process"
        className="flex min-h-screen scroll-mt-16 flex-col items-center justify-center border-t border-white/5"
      >
        <h2 className="text-3xl font-bold text-text-primary">Process</h2>
      </section>

      <section
        id="projets"
        className="flex min-h-screen scroll-mt-16 flex-col items-center justify-center border-t border-white/5"
      >
        <h2 className="text-3xl font-bold text-text-primary">Projets</h2>
      </section>

      <section
        id="contact"
        className="flex min-h-screen scroll-mt-16 flex-col items-center justify-center border-t border-white/5"
      >
        <h2 className="text-3xl font-bold text-text-primary">Contact</h2>
      </section>
    </main>
  );
}
