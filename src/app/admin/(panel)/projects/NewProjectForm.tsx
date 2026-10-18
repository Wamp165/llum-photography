"use client";

import ActionForm from "@/components/admin/ActionForm";
import Field from "@/components/admin/Field";
import SelectField from "@/components/admin/SelectField";
import { Input } from "@/components/ui/input";
import type { Category } from "@/types/category";
import { createProjectAction } from "./actions";

type Props = {
  categories: Category[];
};

export default function NewProjectForm({ categories }: Props) {
  return (
    <ActionForm action={createProjectAction} submitLabel="Create draft" className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" name="title">
          {(id) => <Input id={id} name="title" required />}
        </Field>

        <Field label="Category" name="category_id">
          {(id) => (
            <SelectField
              id={id}
              name="category_id"
              defaultValue={String(categories[0].id)}
              options={categories.map((category) => ({
                value: String(category.id),
                label: category.name,
              }))}
            />
          )}
        </Field>
      </div>
    </ActionForm>
  );
}
