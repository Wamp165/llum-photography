/** Return value of every admin Server Action. */
export type ActionResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<string, string>>;
    };

/** useActionState state: null until the first submit. */
export type ActionState = ActionResult | null;

/** Signature of a Server Action used with useActionState. */
export type FormAction = (state: ActionState, formData: FormData) => Promise<ActionResult>;
