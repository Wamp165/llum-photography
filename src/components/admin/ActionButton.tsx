"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ActionState, FormAction } from "@/types/action-result";

type Props = {
  /** A Server Action with its arguments bound, e.g. deleteX.bind(null, id). */
  action: FormAction;
  children: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  ariaLabel?: string;
  disabled?: boolean;
  /** When set, asks for confirmation in a dialog before running the action. */
  confirm?: {
    title: string;
    description: string;
    confirmLabel: string;
  };
  /** Toast shown on success (none by default). */
  successMessage?: string;
};

/** A single button that runs a Server Action (move, delete, publish...). */
export default function ActionButton({
  action,
  children,
  variant = "outline",
  size = "sm",
  ariaLabel,
  disabled = false,
  confirm,
  successMessage,
}: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handledState = useRef<ActionState>(null);
  useEffect(() => {
    if (!state || handledState.current === state) return;
    handledState.current = state;
    if (!state.ok) toast.error(state.error);
    else if (successMessage) toast.success(successMessage);
  }, [state, successMessage]);

  const run = () => startTransition(() => formAction(new FormData()));

  const button = (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={disabled || pending}
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={confirm ? () => setDialogOpen(true) : run}
    >
      {children}
    </Button>
  );

  if (!confirm) return button;

  return (
    <>
      {button}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirm.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={run}>
              {confirm.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
