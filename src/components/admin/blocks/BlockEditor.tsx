"use client";

import ActionForm, { useFieldError } from "@/components/admin/ActionForm";
import { BlockFields } from "@/components/admin/block-forms";
import { Button } from "@/components/ui/button";
import type { FormAction } from "@/types/action-result";
import type { BlockType, ProjectBlockContent } from "@/types/project-block";

type Props<T extends BlockType> = {
  type: T;
  /** Null when adding a new block. */
  initial: ProjectBlockContent<T> | null;
  action: FormAction;
  submitLabel: string;
  onDone: () => void;
};

function ContentError() {
  const error = useFieldError("content");
  return error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null;
}

export default function BlockEditor<T extends BlockType>({
  type,
  initial,
  action,
  submitLabel,
  onDone,
}: Props<T>) {
  return (
    <ActionForm
      action={action}
      submitLabel={submitLabel}
      onSuccess={onDone}
      className="grid gap-4"
      secondaryActions={
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      }
    >
      <input type="hidden" name="type" value={type} />
      <BlockFields type={type} initial={initial} />
      <ContentError />
    </ActionForm>
  );
}
