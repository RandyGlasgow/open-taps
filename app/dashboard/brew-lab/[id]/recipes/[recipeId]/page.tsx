"use client";

import { Brew } from "@/components/domains/BrewLab/Brew/Brew";
import { InjectBreadcrumbs } from "@/components/shared/Dashboard/dashboard-breadcrumbs";
import { Chip } from "@/components/ui/chip";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

export default function RecipePage() {
  const { id, recipeId } = useParams<{
    id: Id<"brew_lab">;
    recipeId: Id<"recipe">;
  }>();
  const recipe = useQuery(api.recipe.getById, { id: recipeId });

  return (
    <div>
      <InjectBreadcrumbs
        loading={!recipe}
        pathname={[
          { alias: "Brew Lab", pathname: `/dashboard/brew-lab/${id}` },
          {
            alias: "Recipes",
            pathname: `/dashboard/brew-lab/${id}?tab=recipes`,
          },
          {
            alias: `${recipe?.name} v${recipe?.version.major}.${recipe?.version.minor}.${recipe?.version.patch}`,
            pathname: `/dashboard/brew-lab/${id}/recipes/${recipeId}`,
          },
        ]}
      />

      <h1 className="text-2xl font-bold flex items-center gap-2">
        {recipe?.name}
        <Chip>
          v{recipe?.version.major}.{recipe?.version.minor}.
          {recipe?.version.patch}
        </Chip>
      </h1>
      {/* <pre>{JSON.stringify({ recipe }, null, 2)}</pre> */}
      <Brew recipeId={recipeId} />
    </div>
  );
}
