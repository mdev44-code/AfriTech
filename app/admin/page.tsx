import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-2xl font-semibold text-text-primary">
        Tableau de bord admin
      </h1>
      <p className="text-text-secondary">
        Connecté en tant que {session?.user?.email} ({session?.user?.role})
      </p>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/admin/login" });
        }}
      >
        <Button
          type="submit"
          className="border border-brand-blue-light bg-transparent text-white hover:bg-brand-blue-light/10"
        >
          Se déconnecter
        </Button>
      </form>
    </main>
  );
}
