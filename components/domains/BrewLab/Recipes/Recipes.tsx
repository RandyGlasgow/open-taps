import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { PlusIcon } from "lucide-react";
import { getOrderedRecipes } from "../utils";
import { RecipeCard } from "./RecipeCard";

export const Recipes = ({ brewLabId }: { brewLabId: Id<"brew_lab"> }) => {
  const recipes = useQuery(api.recipe.getAllRecipesByBrewLabId, { brewLabId });

  const orderedRecipes = getOrderedRecipes(recipes || []);
  const hasRecipes = recipes?.length && recipes.length > 0;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Base CTA For creating a root recipe */}
      {!hasRecipes && (
        <div className="flex justify-center items-center h-full w-full">
          <CreateRootRecipe id={brewLabId} />
        </div>
      )}
      {orderedRecipes.byVersion.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
};

const CreateRootRecipe = ({ id }: { id: Id<"brew_lab"> }) => {
  const create = useMutation(api.recipe.createRecipe);

  return (
    <Button
      onClick={() =>
        create({ brewLabId: id, version: { major: 1, minor: 0, patch: 0 } })
      }
    >
      Let&apos;s create a new recipe
      <PlusIcon className="w-4 h-4" />
    </Button>
  );
};
