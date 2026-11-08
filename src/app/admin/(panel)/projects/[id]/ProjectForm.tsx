"use client";

import ActionForm from "@/components/admin/ActionForm";
import Field from "@/components/admin/Field";
import ImageInput from "@/components/admin/ImageInput";
import SelectField from "@/components/admin/SelectField";
import TitleSlugFields from "@/components/admin/TitleSlugFields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FormAction } from "@/types/action-result";
import type { Category } from "@/types/category";
import type { ProjectListItem } from "@/types/project-list-item";

type Props = {
  action: FormAction;
  project: ProjectListItem;
  categories: Category[];
};

export default function ProjectForm({ action, project, categories }: Props) {
  return (
    <ActionForm action={action} submitLabel="Save project">
      <div className="grid gap-6 sm:grid-cols-2">
        <TitleSlugFields
          titleName="title"
          titleLabel="Title"
          defaultTitle={project.title}
          defaultSlug={project.slug}
          urlPrefix={`/${project.category_slug}/`}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category" name="category_id">
          {(id) => (
            <SelectField
              id={id}
              name="category_id"
              defaultValue={String(project.category_id)}
              options={categories.map((category) => ({
                value: String(category.id),
                label: category.name,
              }))}
            />
          )}
        </Field>

        <Field label="Location" name="location" hint="Optional. For example: Istanbul, Turkey.">
          {(id) => <Input id={id} name="location" defaultValue={project.location ?? ""} />}
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Start year" name="year_start" hint="Optional.">
          {(id) => (
            <Input
              id={id}
              name="year_start"
              type="number"
              inputMode="numeric"
              min={1800}
              max={2100}
              defaultValue={project.year_start ?? ""}
            />
          )}
        </Field>

        <Field label="End year" name="year_end" hint="Optional. Leave empty for a single year.">
          {(id) => (
            <Input
              id={id}
              name="year_end"
              type="number"
              inputMode="numeric"
              min={1800}
              max={2100}
              defaultValue={project.year_end ?? ""}
            />
          )}
        </Field>
      </div>

      <Field label="Cover image" name="cover_image">
        <ImageInput name="cover_image" defaultValue={project.cover_image} />
      </Field>

      <Field label="Description" name="description" hint="Short text shown in the category list.">
        {(id) => <Textarea id={id} name="description" defaultValue={project.description ?? ""} rows={3} />}
      </Field>

      <Field label="Introduction" name="introduction" hint="Shown at the top of the project page.">
        {(id) => (
          <Textarea id={id} name="introduction" defaultValue={project.introduction ?? ""} rows={8} />
        )}
      </Field>
    </ActionForm>
  );
}
