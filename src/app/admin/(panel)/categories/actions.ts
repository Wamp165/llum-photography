"use server";

import { createCategory, deleteCategory, moveCategory, updateCategory } from "@/data/categories";
import { isUniqueViolation } from "@/data/errors";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateSite } from "@/lib/revalidate";
import { categoryFormSchema } from "@/lib/schemas/category";
import { direction, fieldErrorsOf, positiveId } from "@/lib/schemas/common";
import type { ActionResult, ActionState } from "@/types/action-result";

const FIX_FIELDS = "Please fix the highlighted fields.";
const SLUG_TAKEN: ActionResult = {
  ok: false,
  error: FIX_FIELDS,
  fieldErrors: { slug: "Another category already uses this slug." },
};

export async function createCategoryAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const input = categoryFormSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) {
    return { ok: false, error: FIX_FIELDS, fieldErrors: fieldErrorsOf(input.error) };
  }

  try {
    await createCategory(input.data);
  } catch (error) {
    if (isUniqueViolation(error)) return SLUG_TAKEN;
    throw error;
  }

  revalidateSite();
  return { ok: true };
}

export async function updateCategoryAction(
  categoryId: number,
  _state: ActionState,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  // Bound arguments come from the browser too: validate them like any input.
  const id = positiveId.safeParse(categoryId);
  const input = categoryFormSchema.safeParse(Object.fromEntries(formData));
  if (!id.success) return { ok: false, error: "Invalid category." };
  if (!input.success) {
    return { ok: false, error: FIX_FIELDS, fieldErrors: fieldErrorsOf(input.error) };
  }

  try {
    await updateCategory(id.data, input.data);
  } catch (error) {
    if (isUniqueViolation(error)) return SLUG_TAKEN;
    throw error;
  }

  revalidateSite();
  return { ok: true };
}

export async function deleteCategoryAction(
  categoryId: number,
  _state: ActionState,
  _formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = positiveId.safeParse(categoryId);
  if (!id.success) return { ok: false, error: "Invalid category." };

  if (!(await deleteCategory(id.data))) {
    return { ok: false, error: "This category still has projects. Move or delete them first." };
  }

  revalidateSite();
  return { ok: true };
}

export async function moveCategoryAction(
  categoryId: number,
  moveDirection: "up" | "down",
  _state: ActionState,
  _formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = positiveId.safeParse(categoryId);
  const dir = direction.safeParse(moveDirection);
  if (!id.success || !dir.success) return { ok: false, error: "Invalid request." };

  await moveCategory(id.data, dir.data);
  revalidateSite();
  return { ok: true };
}
