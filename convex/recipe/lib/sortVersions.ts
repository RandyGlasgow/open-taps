export const sortRecipesByVersion = <
  T extends { version: { major: number; minor: number; patch: number } },
>(
  recipes: T[] = [],
) => {
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
