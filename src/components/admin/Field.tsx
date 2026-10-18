"use client";

import { useId } from "react";
import { Label } from "@/components/ui/label";
import { useFieldError } from "./ActionForm";

type Props = {
  label: string;
  /** Form field name, used to show its validation error. */
  name: string;
  hint?: string;
  /**
   * Single input: a function receiving the id to put on the input.
   * Group of controls (image pickers, lists): plain children, rendered in a fieldset.
   */
  children: ((id: string) => React.ReactNode) | React.ReactNode;
};

export default function Field({ label, name, hint, children }: Props) {
  const id = useId();
  const error = useFieldError(name);

  const footer = (
    <>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </>
  );

  if (typeof children === "function") {
    return (
      <div className="grid gap-2">
        <Label htmlFor={id}>{label}</Label>
        {children(id)}
        {footer}
      </div>
    );
  }

  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      {children}
      {footer}
    </fieldset>
  );
}
