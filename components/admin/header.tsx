"use client";

import { signOut } from "next-auth/react";
import { LogOut, Menu } from "lucide-react";
import type { UserRole } from "@prisma/client";

import { Button } from "@/components/ui/button";

const ROLE_LABELS: Record<UserRole, string> = {
  SUPERADMIN: "Super admin",
  ADMIN: "Admin",
  EDITOR: "Éditeur",
};

interface HeaderProps {
  user: {
    email: string;
    role: UserRole;
  };
  onOpenMobileNav: () => void;
}

export function Header({ user, onOpenMobileNav }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-white/5 bg-background/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="text-text-secondary transition-colors hover:text-white lg:hidden"
        aria-label="Ouvrir la navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-text-primary">{user.email}</p>
          <p className="text-xs text-text-secondary">{ROLE_LABELS[user.role]}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="border-white/10 bg-transparent text-text-primary hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>
      </div>
    </header>
  );
}
