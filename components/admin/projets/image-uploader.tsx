"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

export function ImageUploader({ images, onChange, disabled }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      const uploaded = await Promise.all(
        Array.from(fileList).map((file) =>
          upload(`projects/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/projects/upload",
          }),
        ),
      );

      onChange([...images, ...uploaded.map((blob) => blob.url)]);
    } catch {
      setError("Échec de l'upload d'une ou plusieurs images.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(url: string) {
    onChange(images.filter((image) => image !== url));
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-surface"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- aperçu admin d'une image hébergée sur Vercel Blob */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                disabled={disabled}
                aria-label="Retirer cette image"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-text-primary opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100 disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
        disabled={disabled || isUploading}
      />

      <Button
        type="button"
        variant="outline"
        disabled={disabled || isUploading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-white/10 bg-transparent text-text-primary hover:bg-white/5",
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" /> Ajouter des images
          </>
        )}
      </Button>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
