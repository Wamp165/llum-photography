"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isForeignKeyViolation, isUniqueViolation } from "@/data/errors";
import {
  createProjectBlock,
  deleteProjectBlock,
  moveProjectBlock,
  updateProjectBlock,
} from "@/data/project-blocks";
import { deleteProject, setProjectPublished, updateProject } from "@/data/projects";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateSite } from "@/lib/revalidate";
import { direction, fieldErrorsOf, positiveId } from "@/lib/schemas/common";
import { projectFormSchema } from "@/lib/schemas/project";
import { blockFormSchema } from "@/lib/schemas/project-block";
import type { ActionResult, ActionState } from "@/types/action-result";

const FIX_FIELDS = "Please fix the highlighted fields.";

// --- Project -----------------------------------------------------------------

export async function updateProjectAction(
  projectId: number,
  _state: ActionState,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = positiveId.safeParse(projectId);
  const input = projectFormSchema.safeParse(Object.fromEntries(formData));
  if (!id.success) return { ok: false, error: "Invalid project." };
  if (!input.success) {
    return { ok: false, error: FIX_FIELDS, fieldErrors: fieldErrorsOf(input.error) };
  }

  try {
    await updateProject(id.data, input.data);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, error: FIX_FIELDS, fieldErrors: { slug: "Another project already uses this slug." } };
    }
    if (isForeignKeyViolation(error)) {
      return { ok: false, error: FIX_FIELDS, fieldErrors: { category_id: "This category no longer exists." } };
    }
    throw error;
  }

  revalidateSite();
  return { ok: true };
}

export async function setPublishedAction(
  projectId: number,
  isPublished: boolean,
  _state: ActionState,
  _formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = positiveId.safeParse(projectId);
  const published = z.boolean().safeParse(isPublished);
  if (!id.success || !published.success) return { ok: false, error: "Invalid request." };

  await setProjectPublished(id.data, published.data);
  revalidateSite();
  return { ok: true };
}

export async function deleteProjectAction(
  projectId: number,
  _state: ActionState,
  _formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = positiveId.safeParse(projectId);
  if (!id.success) return { ok: false, error: "Invalid project." };

  await deleteProject(id.data);
  revalidateSite();
  redirect("/admin/projects");
}

// --- Blocks ------------------------------------------------------------------

export async function createBlockAction(
  projectId: number,
  _state: ActionState,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = positiveId.safeParse(projectId);
  const block = blockFormSchema.safeParse(Object.fromEntries(formData));
  if (!id.success) return { ok: false, error: "Invalid project." };
  if (!block.success) {
    const message = block.error.issues[0]?.message ?? "Invalid block.";
    return { ok: false, error: message, fieldErrors: { content: message } };
  }

  try {
    await createProjectBlock(id.data, block.data);
  } catch (error) {
    if (isForeignKeyViolation(error)) return { ok: false, error: "This project no longer exists." };
    throw error;
  }

  revalidateSite();
  return { ok: true };
}

export async function updateBlockAction(
  blockId: number,
  _state: ActionState,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = positiveId.safeParse(blockId);
  const block = blockFormSchema.safeParse(Object.fromEntries(formData));
  if (!id.success) return { ok: false, error: "Invalid block." };
  if (!block.success) {
    const message = block.error.issues[0]?.message ?? "Invalid block.";
    return { ok: false, error: message, fieldErrors: { content: message } };
  }

  if (!(await updateProjectBlock(id.data, block.data))) {
    return { ok: false, error: "This block no longer exists." };
  }

  revalidateSite();
  return { ok: true };
}

export async function deleteBlockAction(
  blockId: number,
  _state: ActionState,
  _formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = positiveId.safeParse(blockId);
  if (!id.success) return { ok: false, error: "Invalid block." };

  await deleteProjectBlock(id.data);
  revalidateSite();
  return { ok: true };
}

export async function moveBlockAction(
  blockId: number,
  moveDirection: "up" | "down",
  _state: ActionState,
  _formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const id = positiveId.safeParse(blockId);
  const dir = direction.safeParse(moveDirection);
  if (!id.success || !dir.success) return { ok: false, error: "Invalid request." };

  await moveProjectBlock(id.data, dir.data);
  revalidateSite();
  return { ok: true };
}
