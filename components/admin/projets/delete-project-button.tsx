"use client";

import { useState, useTransition, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteProject } from "@/lib/actions/projects";

interface DeleteProjectButtonProps {
  projectId: string;
  projectTitle: string;
  redirectTo?: string;
}

export function DeleteProjectButton({
  projectId,
  projectTitle,
  redirectTo,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  function handleConfirm(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await deleteProject(projectId);
      if (!result.success) {
        setError(result.error ?? "Une erreur est survenue.");
        return;
      }

      setOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Supprimer le projet ${projectTitle}`}
        >
          <Trash2 className="h-4 w-4 text-red-400" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer « {projectTitle} » ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est définitive. Le projet sera retiré du tableau de
            bord et de la landing page publique.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
