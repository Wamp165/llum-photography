"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import ActionButton from "@/components/admin/ActionButton";
import { blockForms } from "@/components/admin/block-forms";
import { Button } from "@/components/ui/button";
import type { FormAction } from "@/types/action-result";
import type { AdminProjectBlock } from "@/types/project-block";
import BlockEditor from "./BlockEditor";
import BlockSummary from "./BlockSummary";

type Props = {
  entry: AdminProjectBlock;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  updateAction: FormAction;
  deleteAction: FormAction;
  moveUpAction: FormAction;
  moveDownAction: FormAction;
};

export default function BlockListItem({
  entry,
  index,
  isFirst,
  isLast,
  updateAction,
  deleteAction,
  moveUpAction,
  moveDownAction,
}: Props) {
  const [editing, setEditing] = useState(false);
  const label = entry.valid ? blockForms[entry.block.type].label : entry.row.type;

  return (
    <li className="rounded-lg border p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {index + 1}. {label}
        </p>

        <div className="flex flex-wrap items-center gap-1">
          <ActionButton action={moveUpAction} disabled={isFirst} size="icon" ariaLabel="Move block up">
            <ArrowUp />
          </ActionButton>
          <ActionButton action={moveDownAction} disabled={isLast} size="icon" ariaLabel="Move block down">
            <ArrowDown />
          </ActionButton>
          {entry.valid && !editing && (
            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
          <ActionButton
            action={deleteAction}
            variant="ghost"
            confirm={{
              title: "Delete this block?",
              description: "The block will be removed from the project. This cannot be undone.",
              confirmLabel: "Delete block",
            }}
            successMessage="Block deleted"
          >
            Delete
          </ActionButton>
        </div>
      </div>

      {!entry.valid ? (
        <p className="text-sm text-destructive">
          This block has invalid content and is hidden on the site: {entry.error}
        </p>
      ) : editing ? (
        <BlockEditor
          type={entry.block.type}
          initial={entry.block.content}
          action={updateAction}
          submitLabel="Save block"
          onDone={() => setEditing(false)}
        />
      ) : (
        <BlockSummary block={entry.block} />
      )}
    </li>
  );
}
