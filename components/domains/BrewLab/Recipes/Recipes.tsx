import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { PlusIcon } from "lucide-react";
import { RecipeCard } from "./RecipeCard";

export const Recipes = ({ brewLabId }: { brewLabId: Id<"brew_lab"> }) => {
  const recipes = useQuery(api.recipe.getAllRecipesByBrewLabId, { brewLabId });

  const hasRecipes = recipes?.length && recipes.length > 0;

  return (
    <div className="h-full flex flex-col gap-4">
      {!!hasRecipes && (
        <span className="fixed bottom-4 right-4">
          <CreateRootRecipe id={brewLabId} />
        </span>
      )}

      {/* Base CTA For creating a root recipe */}
      {!hasRecipes && (
        <div className="flex justify-center items-center h-full w-full">
          <CreateRootRecipe id={brewLabId} />
        </div>
      )}
      {recipes
        ?.sort((a, b) => a.updated_at - b.updated_at)
        .map((recipe) => <RecipeCard key={recipe._id} id={recipe._id} />)}
    </div>
  );
};

const CreateRootRecipe = ({ id }: { id: Id<"brew_lab"> }) => {
  const create = useMutation(api.recipe.createRecipe);

  return (
    <Button onClick={() => create({ brewLabId: id, version: "v1.0" })}>
      Let&apos;s create a new recipe
      <PlusIcon className="w-4 h-4" />
    </Button>
  );
};
