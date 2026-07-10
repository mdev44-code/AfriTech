"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  quoteFormSchema,
  type QuoteFormValues,
} from "@/lib/validations/quote";
import { saveQuoteDraft, sendQuote } from "@/lib/actions/devis";

interface QuoteFormProps {
  quoteRequestId: string;
  defaultValues: QuoteFormValues;
  readOnly: boolean;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function QuoteForm({
  quoteRequestId,
  defaultValues,
  readOnly,
}: QuoteFormProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lines",
  });

  const lines = watch("lines");
  const total = lines.reduce(
    (sum, line) => sum + (Number(line.price) || 0) * (Number(line.quantity) || 0),
    0,
  );

  function onSaveDraft(values: QuoteFormValues) {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveQuoteDraft(quoteRequestId, values);
      setFeedback(
        result.success
          ? { type: "success", message: "Brouillon enregistré." }
          : { type: "error", message: result.error ?? "Une erreur est survenue." },
      );
    });
  }

  function onSend(values: QuoteFormValues) {
    setFeedback(null);
    startTransition(async () => {
      const saved = await saveQuoteDraft(quoteRequestId, values);
      if (!saved.success) {
        setFeedback({
          type: "error",
          message: saved.error ?? "Une erreur est survenue.",
        });
        return;
      }

      const sent = await sendQuote(quoteRequestId);
      setFeedback(
        sent.success
          ? { type: "success", message: "Devis envoyé par email au client." }
          : { type: "error", message: sent.error ?? "Échec de l'envoi." },
      );
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 gap-3 rounded-lg border border-white/5 bg-background/40 p-4 sm:grid-cols-[1fr_100px_140px_auto]"
          >
            <div>
              <Label htmlFor={`lines.${index}.label`}>Libellé</Label>
              <Input
                id={`lines.${index}.label`}
                disabled={readOnly}
                {...register(`lines.${index}.label` as const)}
                placeholder="Ex : Développement front-end"
              />
              {errors.lines?.[index]?.label ? (
                <p className="mt-1 text-xs text-red-400">
                  {errors.lines[index]?.label?.message}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor={`lines.${index}.quantity`}>Qté</Label>
              <Input
                id={`lines.${index}.quantity`}
                type="number"
                min={1}
                disabled={readOnly}
                {...register(`lines.${index}.quantity` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label htmlFor={`lines.${index}.price`}>Prix unitaire (€)</Label>
              <Input
                id={`lines.${index}.price`}
                type="number"
                min={0}
                step="0.01"
                disabled={readOnly}
                {...register(`lines.${index}.price` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            {!readOnly && (
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  aria-label="Supprimer la ligne"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            )}
          </div>
        ))}

        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ label: "", quantity: 1, price: 0 })}
          >
            <Plus className="h-4 w-4" /> Ajouter une ligne
          </Button>
        )}
      </div>

      <div>
        <Label htmlFor="conditions">Conditions</Label>
        <Textarea
          id="conditions"
          disabled={readOnly}
          rows={4}
          placeholder="Conditions de paiement, délais, validité du devis..."
          {...register("conditions")}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-white/5 bg-surface p-4">
        <span className="text-sm font-medium text-text-secondary">Total</span>
        <span className="text-xl font-semibold text-text-primary">
          {formatCurrency(total)}
        </span>
      </div>

      {feedback ? (
        <p
          className={
            feedback.type === "success" ? "text-sm text-emerald-400" : "text-sm text-red-400"
          }
        >
          {feedback.message}
        </p>
      ) : null}

      {!readOnly && (
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleSubmit(onSaveDraft)}
          >
            Enregistrer le brouillon
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleSubmit(onSend)}
          >
            Envoyer le devis par email
          </Button>
        </div>
      )}
    </div>
  );
}
