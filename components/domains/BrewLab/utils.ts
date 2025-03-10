import { Doc } from "../../../convex/_generated/dataModel";

/**
 * Sort recipes by version (major, minor, patch) in descending order
 * @param recipes - The recipes to sort
 * @returns The sorted recipes in descending order
 */
const sortRecipesByVersion = (recipes: Doc<"recipe">[] = []) => {
  recipes.sort((a, b) => {
    // First compare major versions
    if (a.version.major !== b.version.major) {
      return b.version.major - a.version.major;
    }

    // If major versions are equal, compare minor versions
    if (a.version.minor !== b.version.minor) {
      return b.version.minor - a.version.minor;
    }

    // If minor versions are equal, compare patch versions
    return b.version.patch - a.version.patch;
  });

  return recipes;
};

export const getOrderedRecipes = (recipes: Doc<"recipe">[] = []) => {
  // Sort recipes by version (major, minor, patch) in descending order
  const sortedRecipes = sortRecipesByVersion(recipes);

  const bucketedByVersion = sortedRecipes.reduce(
    (acc, recipe) => {
      acc[recipe.version.major] = acc[recipe.version.major] || [];
      acc[recipe.version.major].push(recipe);
      return acc;
    },
    {} as Record<number, Doc<"recipe">[]>,
  );

  /** returns a list of lists of recipes, each list is a version sorted in descending order */
  const preparedGroupedByVersion = Object.keys(bucketedByVersion).map(
    // reverse this list since we want the lowest version first
    (version) => bucketedByVersion[version as unknown as number].reverse(),
  );

  const getCurrentRecipe = (recipes: Doc<"recipe">[]) => {
    return recipes.find((recipe) => recipe.status === "active");
  };

  return {
    byVersion: sortedRecipes,
    byUpdatedAt: [...recipes].sort((a, b) => b.updated_at - a.updated_at),
    byCreatedAt: [...recipes].sort((a, b) => b._creationTime - a._creationTime),
    byName: [...recipes].sort((a, b) => a.name.localeCompare(b.name)),
    groupedByVersion: preparedGroupedByVersion,
    getCurrentRecipe,
  };
};
