import Image from "next/image";

import { cn } from "@/lib/utils";

const LOGO_HEIGHT_CLASSES = {
  sm: "h-6 md:h-8",
  md: "h-8 md:h-10",
  lg: "h-10 md:h-14",
  xl: "h-14 md:h-20",
} as const;

type LogoSize = keyof typeof LOGO_HEIGHT_CLASSES;

interface LogoProps {
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

export function Logo({ size = "md", className, priority = false }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Afritech"
      width={2000}
      height={600}
      priority={priority}
      className={cn("w-auto", LOGO_HEIGHT_CLASSES[size], className)}
    />
  );
}
