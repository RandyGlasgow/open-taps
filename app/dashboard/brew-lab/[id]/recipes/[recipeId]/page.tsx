"use client";

import { InjectBreadcrumbs } from "@/components/shared/Dashboard/dashboard-breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useLoadingQuery } from "@/hooks/use-loading";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function RecipePage() {
  const { id, recipeId } = useParams<{
    id: Id<"brew_lab">;
    recipeId: Id<"recipe">;
  }>();
  const recipe = useLoadingQuery(api.recipe.getById, { id: recipeId });
  const paths = useMemo(() => {
    const paths = [
      { alias: "Brew Lab", pathname: `/dashboard/brew-lab/${id}` },
      {
        alias: "Recipes",
        pathname: `/dashboard/brew-lab/${id}?tab=recipes`,
      },
    ];
    if (recipe !== "loading") {
      paths.push({
        alias: `${recipe?.name} v${recipe?.version.major}.${recipe?.version.minor}.${recipe?.version.patch}`,
        pathname: `/dashboard/brew-lab/${id}/recipes/${recipeId}`,
      });
    }

    return paths;
  }, [id, recipe, recipeId]);

  return (
    <>
      <InjectBreadcrumbs pathname={paths} />

      {recipe !== "loading" ? (
        <>
          {/* <h1 className="text-2xl font-bold flex items-center gap-2">
            {recipe?.name}
            <Chip>
              v{recipe?.version.major}.{recipe?.version.minor}.
              {recipe?.version.patch}
            </Chip>
          </h1> */}
          {/* <pre>{JSON.stringify({ recipe }, null, 2)}</pre> */}
        </>
      ) : (
        <Skeleton className="h-10 w-full" />
      )}
      <pre>{JSON.stringify({ recipe }, null, 2)}</pre>
    </>
  );
}
