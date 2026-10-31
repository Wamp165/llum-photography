"use client";

import { useState } from "react";
import ActionForm from "@/components/admin/ActionForm";
import Field from "@/components/admin/Field";
import SelectField from "@/components/admin/SelectField";
import TitleSlugFields from "@/components/admin/TitleSlugFields";
import { CATEGORY_LAYOUTS } from "@/lib/constants";
import type { FormAction } from "@/types/action-result";
import type { Category } from "@/types/category";
import type { CategoryLayout } from "@/types/category-layout";

type Props = {
  action: FormAction;
  /** Null when creating a new category. */
  category: Category | null;
};

const LAYOUT_LABELS: Record<CategoryLayout, string> = {
  editorial: "Editorial — one project per row, text beside the cover",
  grid: "Grid — up to 3 columns",
  featured: "Featured — first project large, the rest below",
};

export default function CategoryForm({ action, category }: Props) {
  // Remounting with a new key empties the "new category" form after creating.
  const [formKey, setFormKey] = useState(0);

  return (
    <ActionForm
      key={formKey}
      action={action}
      submitLabel={category ? "Save" : "Create category"}
      onSuccess={category ? undefined : () => setFormKey((key) => key + 1)}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TitleSlugFields
          titleName="name"
          titleLabel="Name"
          defaultTitle={category?.name ?? ""}
          defaultSlug={category?.slug ?? ""}
          urlPrefix="/"
        />
      </div>

      <Field label="Layout of the project list" name="layout">
        {(id) => (
          <SelectField
            id={id}
            name="layout"
            defaultValue={category?.layout ?? "editorial"}
            options={CATEGORY_LAYOUTS.map((layout) => ({ value: layout, label: LAYOUT_LABELS[layout] }))}
          />
        )}
      </Field>
    </ActionForm>
  );
}
