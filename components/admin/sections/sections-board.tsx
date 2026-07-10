"use client";

import { useEffect, useState, useTransition } from "react";
import type { Section } from "@prisma/client";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CreateSectionForm } from "@/components/admin/sections/create-section-form";
import { EditBuiltinSectionForm } from "@/components/admin/sections/edit-builtin-section-form";
import { cn } from "@/lib/utils";
import {
  deleteCustomSection,
  reorderSections,
  toggleSectionVisibility,
} from "@/lib/actions/sections";
import { BUILTIN_SECTION_LABELS, isBuiltinSectionType } from "@/lib/sections/registry";
import { isEditableBuiltinType } from "@/lib/sections/builtin-defaults";
import { CUSTOM_SECTION_TEMPLATES, isCustomSectionType } from "@/lib/validations/sections";

function sectionLabel(section: Section): string {
  if (isBuiltinSectionType(section.type)) return BUILTIN_SECTION_LABELS[section.type];
  if (isCustomSectionType(section.type)) return CUSTOM_SECTION_TEMPLATES[section.type].label;
  return section.type;
}

interface SortableRowProps {
  section: Section;
  onToggle: (id: string, visible: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isPending: boolean;
}

function SortableRow({ section, onToggle, onDelete, onEdit, isPending }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const isCustom = isCustomSectionType(section.type);
  const isEditable = isBuiltinSectionType(section.type) && isEditableBuiltinType(section.type);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-white/5 bg-surface px-4 py-3",
        isDragging && "opacity-60"
      )}
    >
      <button
        type="button"
        aria-label="Réordonner"
        className="cursor-grab touch-none text-text-secondary hover:text-text-primary active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1">
        <p className="text-sm font-medium text-text-primary">{section.name}</p>
        <p className="text-xs text-text-secondary">
          {sectionLabel(section)}
          {isCustom ? " · personnalisée" : ""}
        </p>
      </div>

      <Switch
        checked={section.visible}
        disabled={isPending}
        onCheckedChange={(checked) => onToggle(section.id, checked)}
        aria-label={`${section.visible ? "Masquer" : "Afficher"} la section ${section.name}`}
      />

      {isEditable && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => onEdit(section.id)}
          aria-label={`Modifier le texte de la section ${section.name}`}
          className="text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}

      {isCustom && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => onDelete(section.id)}
          aria-label={`Supprimer la section ${section.name}`}
          className="text-text-secondary transition-colors hover:text-destructive disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

interface SectionsBoardProps {
  initialSections: Section[];
}

export function SectionsBoard({ initialSections }: SectionsBoardProps) {
  const [sections, setSections] = useState(initialSections);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleToggle(id: string, visible: boolean) {
    setError(null);
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, visible } : s)));

    startTransition(async () => {
      const result = await toggleSectionVisibility(id, visible);
      if (!result.success) {
        setError(result.error ?? "Une erreur est survenue.");
        setSections((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !visible } : s)));
      }
    });
  }

  function handleDelete(id: string) {
    setError(null);
    const previous = sections;
    setSections((prev) => prev.filter((s) => s.id !== id));

    startTransition(async () => {
      const result = await deleteCustomSection(id);
      if (!result.success) {
        setError(result.error ?? "Une erreur est survenue.");
        setSections(previous);
      }
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex);
    setSections(reordered);

    startTransition(async () => {
      const result = await reorderSections(reordered.map((s) => s.id));
      if (!result.success) {
        setError(result.error ?? "Une erreur est survenue.");
        setSections(sections);
      }
    });
  }

  return (
    <div className="space-y-4">
      <DndContext
        id="sections-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.map((section) => (
              <div key={section.id} className="space-y-2">
                <SortableRow
                  section={section}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={(id) => setEditingId(id)}
                  isPending={isPending}
                />
                {editingId === section.id && isBuiltinSectionType(section.type) && (
                  <EditBuiltinSectionForm
                    sectionId={section.id}
                    type={section.type}
                    currentContent={section.content}
                    onSaved={() => setEditingId(null)}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {isCreating ? (
        <CreateSectionForm
          onCreated={() => {
            setIsCreating(false);
          }}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsCreating(true)}
          className="border-brand-blue-light bg-transparent text-white hover:bg-brand-blue-light/10 hover:text-white"
        >
          <Plus className="h-4 w-4" />
          Nouvelle section
        </Button>
      )}
    </div>
  );
}
