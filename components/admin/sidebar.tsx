"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  CalendarClock,
  FileText,
  Layers,
  LayoutDashboard,
  Settings,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/sections", label: "Sections", icon: Layers },
  { href: "/admin/projets", label: "Projets", icon: Briefcase },
  { href: "/admin/devis", label: "Devis", icon: FileText },
  { href: "/admin/rendez-vous", label: "Rendez-vous", icon: CalendarClock },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
] as const;

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-white/5 bg-surface transition-transform duration-300 ease-afritech lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onCloseMobile}
            className="text-text-secondary transition-colors hover:text-white lg:hidden"
            aria-label="Fermer la navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-blue text-white"
                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 px-6 py-4 text-xs text-text-secondary">
          Afritech Admin
        </div>
      </aside>
    </>
  );
}
