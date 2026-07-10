"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createCustomSection } from "@/lib/actions/sections";
import {
  CUSTOM_SECTION_TEMPLATES,
  CUSTOM_SECTION_TYPES,
  type CustomSectionType,
} from "@/lib/validations/sections";

const formSchema = z.object({
  name: z.string().min(2, "Le titre doit faire au moins 2 caractères."),
  type: z.enum(CUSTOM_SECTION_TYPES as [CustomSectionType, ...CustomSectionType[]]),
  title: z.string().min(2, "Le titre de contenu est requis."),
  body: z.string().optional(),
  description: z.string().optional(),
  buttonLabel: z.string().optional(),
  buttonHref: z.string().optional(),
  imageUrl: z.string().optional(),
  imagePosition: z.enum(["left", "right"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_VALUES: FormValues = {
  name: "",
  type: "custom-rich-text",
  title: "",
  body: "",
  description: "",
  buttonLabel: "",
  buttonHref: "",
  imageUrl: "",
  imagePosition: "right",
};

function buildContent(values: FormValues): Record<string, unknown> {
  switch (values.type) {
    case "custom-rich-text":
      return { title: values.title, body: values.body ?? "" };
    case "custom-cta":
      return {
        title: values.title,
        description: values.description ?? "",
        buttonLabel: values.buttonLabel ?? "",
        buttonHref: values.buttonHref ?? "",
      };
    case "custom-image-text":
      return {
        title: values.title,
        body: values.body ?? "",
        imageUrl: values.imageUrl ?? "",
        imagePosition: values.imagePosition ?? "right",
      };
  }
}

interface CreateSectionFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

export function CreateSectionForm({ onCreated, onCancel }: CreateSectionFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const type = watch("type");

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setIsSubmitting(true);

    const result = await createCustomSection({
      name: values.name,
      type: values.type,
      content: buildContent(values),
    });

    setIsSubmitting(false);

    if (!result.success) {
      setServerError(result.error ?? "Une erreur est survenue.");
      return;
    }

    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-white/5 bg-surface p-6"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-text-primary">
          Titre de la section (nom interne)
        </Label>
        <Input
          id="name"
          placeholder="Ex : Offre spéciale rentrée"
          className="border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-text-primary">
          Type de contenu
        </Label>
        <Select
          id="type"
          className="border-white/10 bg-background text-text-primary"
          {...register("type")}
        >
          {CUSTOM_SECTION_TYPES.map((value) => (
            <option key={value} value={value}>
              {CUSTOM_SECTION_TEMPLATES[value].label}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-text-primary">
          Titre affiché
        </Label>
        <Input
          id="title"
          className="border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
          {...register("title")}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      {(type === "custom-rich-text" || type === "custom-image-text") && (
        <div className="space-y-2">
          <Label htmlFor="body" className="text-text-primary">
            Contenu
          </Label>
          <Textarea
            id="body"
            rows={4}
            className="border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
            {...register("body")}
          />
        </div>
      )}

      {type === "custom-image-text" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-text-primary">
              URL de l&apos;image
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://..."
              className="border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
              {...register("imageUrl")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagePosition" className="text-text-primary">
              Position de l&apos;image
            </Label>
            <Select
              id="imagePosition"
              className="border-white/10 bg-background text-text-primary"
              {...register("imagePosition")}
            >
              <option value="right">Droite</option>
              <option value="left">Gauche</option>
            </Select>
          </div>
        </>
      )}

      {type === "custom-cta" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-text-primary">
              Description
            </Label>
            <Textarea
              id="description"
              rows={3}
              className="border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
              {...register("description")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buttonLabel" className="text-text-primary">
              Libellé du bouton
            </Label>
            <Input
              id="buttonLabel"
              placeholder="Ex : Demander un devis"
              className="border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
              {...register("buttonLabel")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buttonHref" className="text-text-primary">
              Lien du bouton
            </Label>
            <Input
              id="buttonHref"
              placeholder="/devis"
              className="border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
              {...register("buttonHref")}
            />
          </div>
        </>
      )}

      {serverError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-blue text-white hover:bg-brand-blue-light disabled:opacity-60"
        >
          {isSubmitting ? "Création..." : "Créer la section"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/10 bg-transparent text-text-primary hover:bg-white/5"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
