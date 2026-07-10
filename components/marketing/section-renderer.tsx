import type { Section } from "@prisma/client";

import { CtaBannerSection } from "@/components/marketing/sections/cta-banner-section";
import { ImageTextSection } from "@/components/marketing/sections/image-text-section";
import { RichTextSection } from "@/components/marketing/sections/rich-text-section";
import { BUILTIN_SECTION_REGISTRY, isBuiltinSectionType } from "@/lib/sections/registry";
import {
  builtinContentSchema,
  ctaContentSchema,
  imageTextContentSchema,
  richTextContentSchema,
} from "@/lib/validations/sections";

export function SectionRenderer({ section }: { section: Section }) {
  if (isBuiltinSectionType(section.type)) {
    const BuiltinComponent = BUILTIN_SECTION_REGISTRY[section.type];
    const parsed = builtinContentSchema.safeParse(section.content);
    return (
      <BuiltinComponent
        title={parsed.success ? parsed.data.title : undefined}
        description={parsed.success ? parsed.data.description : undefined}
      />
    );
  }

  switch (section.type) {
    case "custom-rich-text": {
      const parsed = richTextContentSchema.safeParse(section.content);
      if (!parsed.success) return null;
      return <RichTextSection {...parsed.data} />;
    }
    case "custom-cta": {
      const parsed = ctaContentSchema.safeParse(section.content);
      if (!parsed.success) return null;
      return <CtaBannerSection {...parsed.data} />;
    }
    case "custom-image-text": {
      const parsed = imageTextContentSchema.safeParse(section.content);
      if (!parsed.success) return null;
      return <ImageTextSection {...parsed.data} />;
    }
    default:
      return null;
  }
}
