import Link from "next/link";

import { SectionReveal } from "@/components/marketing/sections/section-reveal";
import { Button } from "@/components/ui/button";
import type { ctaContentSchema } from "@/lib/validations/sections";
import type { z } from "zod";

type CtaContent = z.infer<typeof ctaContentSchema>;

export function CtaBannerSection({
  title,
  description,
  buttonLabel,
  buttonHref,
}: CtaContent) {
  return (
    <section className="scroll-mt-16 border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-surface px-8 py-16 text-center">
        <SectionReveal>
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">{description}</p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-brand-blue text-white hover:bg-brand-blue-light"
          >
            <Link href={buttonHref}>{buttonLabel}</Link>
          </Button>
        </SectionReveal>
      </div>
    </section>
  );
}
