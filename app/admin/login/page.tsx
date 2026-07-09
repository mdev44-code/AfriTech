import type { Metadata } from "next";
import { Suspense } from "react";

import { Logo } from "@/components/shared/Logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Connexion — Admin Afritech",
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-center">
        <Logo size="lg" className="mb-10" />

        <div className="w-full rounded-xl border border-white/5 bg-surface/60 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-lg">
          <h1 className="mb-1 text-center text-xl font-semibold text-text-primary">
            Espace administrateur
          </h1>
          <p className="mb-8 text-center text-sm text-text-secondary">
            Connectez-vous pour accéder au tableau de bord.
          </p>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
