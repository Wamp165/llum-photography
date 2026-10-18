"use server";

import { redirect } from "next/navigation";
import { isForeignKeyViolation } from "@/data/errors";
import { createProject, moveProject } from "@/data/projects";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateSite } from "@/lib/revalidate";
import { direction, fieldErrorsOf, positiveId } from "@/lib/schemas/common";
import { newProjectFormSchema } from "@/lib/schemas/project";
import type { ActionResult, ActionState } from "@/types/action-result";

/** Creates a draft and opens its editor. */
export async function createProjectAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const input = newProjectFormSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsOf(input.error),
    };
  }

  let id: number;
  try {
    id = await createProject(input.data.title, input.data.category_id);
  } catch (error) {
    if (isForeignKeyViolation(error)) return { ok: false, error: "This category no longer exists." };
    throw error;
  }

  revalidateSite();
  redirect(`/admin/projects/${id}`);
}

export async function moveProjectAction(
  projectId: number,
  moveDirection: "up" | "down",
  _state: ActionState,
  _formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = positiveId.safeParse(projectId);
  const dir = direction.safeParse(moveDirection);
  if (!id.success || !dir.success) return { ok: false, error: "Invalid request." };

  await moveProject(id.data, dir.data);
  revalidateSite();
  return { ok: true };
}
