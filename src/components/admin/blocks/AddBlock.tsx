"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { blockForms } from "@/components/admin/block-forms";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOCK_TYPES } from "@/lib/constants";
import type { FormAction } from "@/types/action-result";
import type { BlockType } from "@/types/project-block";
import BlockEditor from "./BlockEditor";

type Props = {
  action: FormAction;
};

function isBlockType(value: string): value is BlockType {
  return (BLOCK_TYPES as readonly string[]).includes(value);
}

export default function AddBlock({ action }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<BlockType | null>(null);

  function close() {
    setOpen(false);
    setType(null);
  }

  if (!open) {
    return (
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Plus /> Add block
      </Button>
    );
  }

  return (
    <div className="grid gap-4 rounded-lg border border-dashed p-4">
      <div className="grid gap-2">
        <Label htmlFor={id}>Block type</Label>
        <Select
          value={type ?? undefined}
          onValueChange={(value) => setType(isBlockType(value) ? value : null)}
        >
          <SelectTrigger id={id} className="w-full">
            <SelectValue placeholder="Choose a block type…" />
          </SelectTrigger>
          <SelectContent>
            {BLOCK_TYPES.map((blockType) => (
              <SelectItem key={blockType} value={blockType}>
                {blockForms[blockType].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {type ? (
        <BlockEditor
          key={type}
          type={type}
          initial={null}
          action={action}
          submitLabel="Add block"
          onDone={close}
        />
      ) : (
        <div>
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
