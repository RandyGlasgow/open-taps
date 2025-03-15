import { Fermentable } from "@/components/domains/BrewLab/Brew/Fermentable/Fermentable";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const Brew = ({ recipeId }: { recipeId: Id<"recipe"> }) => {
  const recipe = useQuery(api.recipe.getById, { id: recipeId });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Fermentable recipe={recipe!} />
    </div>
  );
};
