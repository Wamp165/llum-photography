import type { Metadata } from "next";
import { ArrowDown, ArrowUp } from "lucide-react";
import ActionButton from "@/components/admin/ActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoriesWithProjectCount } from "@/data/categories";
import { requireAdmin } from "@/lib/auth-guard";
import {
  createCategoryAction,
  deleteCategoryAction,
  moveCategoryAction,
  updateCategoryAction,
} from "./actions";
import CategoryForm from "./CategoryForm";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  await requireAdmin();
  const categories = await getCategoriesWithProjectCount();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Categories</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Sections shown in the site menu, in this order.
      </p>

      <ol className="grid gap-4">
        {categories.map((category, index) => (
          <li key={category.id}>
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base">
                  {category.name}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {category.project_count} {category.project_count === 1 ? "project" : "projects"}
                  </span>
                </CardTitle>

                <div className="flex items-center gap-1">
                  <ActionButton
                    action={moveCategoryAction.bind(null, category.id, "up")}
                    disabled={index === 0}
                    size="icon"
                    ariaLabel="Move up"
                  >
                    <ArrowUp />
                  </ActionButton>
                  <ActionButton
                    action={moveCategoryAction.bind(null, category.id, "down")}
                    disabled={index === categories.length - 1}
                    size="icon"
                    ariaLabel="Move down"
                  >
                    <ArrowDown />
                  </ActionButton>
                  <ActionButton
                    action={deleteCategoryAction.bind(null, category.id)}
                    variant="ghost"
                    confirm={{
                      title: `Delete "${category.name}"?`,
                      description: "Only categories without projects can be deleted.",
                      confirmLabel: "Delete category",
                    }}
                    successMessage="Category deleted"
                  >
                    Delete
                  </ActionButton>
                </div>
              </CardHeader>
              <CardContent>
                <CategoryForm action={updateCategoryAction.bind(null, category.id)} category={category} />
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-base">New category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm action={createCategoryAction} category={null} />
        </CardContent>
      </Card>
    </div>
  );
}
