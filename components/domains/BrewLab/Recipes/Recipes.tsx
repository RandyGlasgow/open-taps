import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { PlusIcon } from "lucide-react";
import { getOrderedRecipes } from "../utils";
import { RecipeCard } from "./RecipeCard";

export const Recipes = ({ brewLabId }: { brewLabId: Id<"brew_lab"> }) => {
  const recipes = useQuery(api.brew_lab.getAssociatedRecipes, {
    id: brewLabId,
  });

  const orderedRecipes = getOrderedRecipes(recipes || []);
  console.log({
    recipes: recipes?.reduce(
      (acc, recipe) => {
        acc[recipe._id] = (acc[recipe._id] || 0) + 1;
        return acc;
      },
      {} as Record<Id<"recipe">, number>,
    ),
  });
  const hasRecipes = recipes?.length && recipes.length > 0;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Base CTA For creating a root recipe */}
      {!hasRecipes && (
        <div className="flex justify-center items-center h-full w-full">
          <CreateRootRecipe id={brewLabId} />
        </div>
      )}
      {hasRecipes &&
        Object.entries(orderedRecipes.groupedByVersion).map(
          ([version, recipes]) => (
            <div key={version} className="">
              <h2 className="text-xl font-bold py-8">
                Version{parseInt(version) + 1}
              </h2>
              <div className="grid gap-4 border-l p-2 pb-4 rounded-l-md">
                {Object.entries(
                  recipes.reduce(
                    (acc, recipe) => {
                      acc[recipe.version.minor] = (
                        acc[recipe.version.minor] || []
                      ).concat(recipe);
                      return acc;
                    },
                    {} as Record<number, typeof recipes>,
                  ),
                ).map(([minor, recipes]) => (
                  <div
                    key={minor}
                    className="grid gap-2 px-2 max-w-full overflow-hidden"
                  >
                    <h3 className="text-md font-bold w-full">
                      v{parseInt(version) + 1}.{minor}
                    </h3>
                    <div className="flex gap-2 overflow-x-auto">
                      {recipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
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
