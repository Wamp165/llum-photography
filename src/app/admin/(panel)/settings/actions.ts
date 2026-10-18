"use server";

import { updateSettings } from "@/data/settings";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateSite } from "@/lib/revalidate";
import { fieldErrorsOf } from "@/lib/schemas/common";
import { settingsFormSchema } from "@/lib/schemas/settings";
import type { ActionResult, ActionState } from "@/types/action-result";

export async function saveSettings(
  _state: ActionState,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const input = settingsFormSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsOf(input.error),
    };
  }

  await updateSettings(input.data);
  revalidateSite();
  return { ok: true };
}
