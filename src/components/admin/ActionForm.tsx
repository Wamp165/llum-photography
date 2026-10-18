"use client";

import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ActionState, FormAction } from "@/types/action-result";

type FieldErrors = Partial<Record<string, string>>;

const FieldErrorsContext = createContext<FieldErrors>({});

/** Error message for one field of the surrounding <ActionForm>, if any. */
export function useFieldError(name: string): string | undefined {
  return useContext(FieldErrorsContext)[name];
}

type Props = {
  action: FormAction;
  submitLabel: string;
  children: React.ReactNode;
  /** Runs once after each successful save (e.g. close an editor). */
  onSuccess?: () => void;
  /** Extra buttons next to the submit button (e.g. Cancel). */
  secondaryActions?: React.ReactNode;
  className?: string;
};

/**
 * Form bound to a Server Action with useActionState: field errors next to each
 * input (see <Field>), button disabled while saving, "Saved" toast when done.
 */
export default function ActionForm({
  action,
  submitLabel,
  children,
  onSuccess,
  secondaryActions,
  className = "space-y-6",
}: Props) {
  const [state, formAction, pending] = useActionState(action, null);

  // Every action call returns a new object: react to each result exactly once.
  const handledState = useRef<ActionState>(null);
  useEffect(() => {
    if (!state || handledState.current === state) return;
    handledState.current = state;
    if (state.ok) {
      toast.success("Saved");
      onSuccess?.();
    } else {
      toast.error(state.error);
    }
  }, [state, onSuccess]);

  const fieldErrors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  return (
    <form
      className={className}
      // Submitting through onSubmit (instead of the `action` prop) stops React from
      // resetting the inputs to their old default values after each save.
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
    >
      <FieldErrorsContext.Provider value={fieldErrors}>{children}</FieldErrorsContext.Provider>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        {secondaryActions}
      </div>
    </form>
  );
}
