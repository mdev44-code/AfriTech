import { SectionReveal } from "@/components/marketing/sections/section-reveal";
import { cn } from "@/lib/utils";
import type { imageTextContentSchema } from "@/lib/validations/sections";
import type { z } from "zod";

type ImageTextContent = z.infer<typeof imageTextContentSchema>;

export function ImageTextSection({
  title,
  body,
  imageUrl,
  imagePosition,
}: ImageTextContent) {
  return (
    <section className="scroll-mt-16 border-t border-white/5 px-6 py-24">
      <SectionReveal
        className={cn(
          "mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row",
          imagePosition === "left" && "lg:flex-row-reverse"
        )}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 lg:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element -- URL saisie librement par l'admin, domaine non connu à l'avance */}
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">{title}</h2>
          <p className="mt-4 leading-relaxed text-text-secondary">{body}</p>
        </div>
      </SectionReveal>
    </section>
  );
}
