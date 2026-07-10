import { SectionReveal } from "@/components/marketing/sections/section-reveal";
import type { richTextContentSchema } from "@/lib/validations/sections";
import type { z } from "zod";

type RichTextContent = z.infer<typeof richTextContentSchema>;

export function RichTextSection({ title, body }: RichTextContent) {
  return (
    <section className="scroll-mt-16 border-t border-white/5 px-6 py-24">
      <SectionReveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">{title}</h2>
        <div className="mt-6 space-y-4 text-text-secondary">
          {body
            .split("\n")
            .filter((paragraph) => paragraph.trim().length > 0)
            .map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
        </div>
      </SectionReveal>
    </section>
  );
}
