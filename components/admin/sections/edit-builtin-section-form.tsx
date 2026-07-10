"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  resetBuiltinSectionContent,
  updateBuiltinSectionContent,
} from "@/lib/actions/sections";
import {
  BUILTIN_DEFAULT_CONTENT,
  type BuiltinDefaultContent,
} from "@/lib/sections/builtin-defaults";
import type { BuiltinSectionType } from "@/lib/validations/sections";

function readString(content: unknown, key: "title" | "description"): string | undefined {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    const value = (content as Record<string, unknown>)[key];
    return typeof value === "string" ? value : undefined;
  }
  return undefined;
}

interface EditBuiltinSectionFormProps {
  sectionId: string;
  type: BuiltinSectionType;
  currentContent: unknown;
  onSaved: () => void;
  onCancel: () => void;
}

export function EditBuiltinSectionForm({
  sectionId,
  type,
  currentContent,
  onSaved,
  onCancel,
}: EditBuiltinSectionFormProps) {
  const defaults = BUILTIN_DEFAULT_CONTENT[type] as BuiltinDefaultContent;
  const hasOverride =
    readString(currentContent, "title") !== undefined ||
    readString(currentContent, "description") !== undefined;
  const [title, setTitle] = useState(readString(currentContent, "title") ?? defaults.title);
  const [description, setDescription] = useState(
    readString(currentContent, "description") ?? defaults.description
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await updateBuiltinSectionContent(sectionId, { title, description });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Une erreur est survenue.");
      return;
    }

    onSaved();
  }

  async function handleReset() {
    setError(null);
    setIsResetting(true);

    const result = await resetBuiltinSectionContent(sectionId);

    setIsResetting(false);

    if (!result.success) {
      setError(result.error ?? "Une erreur est survenue.");
      return;
    }

    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-white/5 bg-background/40 p-4"
    >
      <div className="space-y-2">
        <Label htmlFor={`title-${sectionId}`} className="text-text-primary">
          Titre
        </Label>
        <Textarea
          id={`title-${sectionId}`}
          rows={2}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="border-white/10 bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
        />
        <p className="text-xs text-text-secondary">
          Pour le Hero, un retour à la ligne sépare les deux lignes du titre affiché.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`description-${sectionId}`} className="text-text-primary">
          Description
        </Label>
        <Textarea
          id={`description-${sectionId}`}
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="border-white/10 bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
        />
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-blue text-white hover:bg-brand-blue-light disabled:opacity-60"
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/10 bg-transparent text-text-primary hover:bg-white/5"
        >
          Annuler
        </Button>
        {hasOverride && (
          <Button
            type="button"
            variant="ghost"
            disabled={isResetting}
            onClick={handleReset}
            className="ml-auto text-text-secondary hover:bg-white/5 hover:text-text-primary disabled:opacity-60"
          >
            {isResetting ? "Réinitialisation..." : "Réinitialiser le texte par défaut"}
          </Button>
        )}
      </div>
    </form>
  );
}
