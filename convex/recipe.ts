import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { getOrderedRecipes } from "../components/domains/BrewLab/utils";
import { omitFromObject } from "./../lib/utils";
import { mutation, query } from "./_generated/server";

export const getById = query({
  args: { id: v.id("recipe") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const recipe = await ctx.db.get(args.id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (recipe.owner_id !== userId) {
      throw new Error("Unauthorized");
    }

    return recipe;
  },
});

export const getAllRecipesByBrewLabId = query({
  args: { brewLabId: v.id("brew_lab") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const brewLab = await ctx.db.get(args.brewLabId);
    if (!brewLab) {
      throw new Error("Brew lab not found");
    }
    if (brewLab.owner_id !== userId) {
      throw new Error("Unauthorized");
    }

    const recipes = await ctx.db
      .query("recipe")
      .filter((q) => q.eq(q.field("brew_lab_id"), args.brewLabId))
      .collect();
    return recipes;
  },
});

export const createRecipe = mutation({
  args: {
    brewLabId: v.id("brew_lab"),
    version: v.object({
      major: v.number(),
      minor: v.number(),
      patch: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const brewLab = await ctx.db.get(args.brewLabId);
    if (!brewLab) {
      throw new Error("Brew lab not found");
    }
    if (brewLab.owner_id !== userId) {
      throw new Error("Unauthorized");
    }

    const recipe = await ctx.db.insert("recipe", {
      name: brewLab.name,
      version: {
        major: 1,
        minor: 0,
        patch: 0,
      },
      owner_id: userId,
      brew_lab_id: args.brewLabId,
      updated_at: Date.now(),
      style: {
        name: "Lager",
        category: "Beer",
      },
      batch_size: {
        value: 0,
        unit: "liters",
      },
      status: "active",
      ingredients: [],
    });

    const associatedRecipes = (brewLab.associated_recipes || []).concat(recipe);
    // add recipe to brew lab
    await ctx.db.patch(args.brewLabId, {
      associated_recipes: associatedRecipes,
    });

    return recipe;
  },
});

export const createNewVersion = mutation({
  args: {
    recipeId: v.id("recipe"),
    type: v.union(v.literal("major"), v.literal("minor"), v.literal("patch")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (recipe.owner_id !== userId) {
      throw new Error("Unauthorized");
    }

    const labId = recipe.brew_lab_id;

    const found = await ctx.db.get(labId);
    if (!found) {
      throw new Error("Brew lab not found");
    }

    const allRecipes = await ctx.db
      .query("recipe")
      .withIndex("by_brew_lab_by_owner", (q) =>
        q.eq("brew_lab_id", labId).eq("owner_id", userId),
      )
      .collect();
    const { byVersion } = getOrderedRecipes(allRecipes);

    // Calculate the new version based on type
    let newVersion;
    if (args.type === "major") {
      // For major version, increment major and reset minor and patch to 0
      newVersion = {
        major: byVersion[0].version.major + 1,
        minor: 0,
        patch: 0,
      };
    } else if (args.type === "minor") {
      // find the major version
      const filteredByMajor = byVersion.filter(
        (r) => r.version.major === recipe.version.major,
      );
      if (!filteredByMajor) {
        throw new Error("Major version not found");
      }
      const highestMinor = filteredByMajor.reduce(
        (highest, r) => Math.max(highest, r.version.minor),
        recipe.version.minor,
      );

      newVersion = {
        major: recipe.version.major,
        minor: highestMinor + 1,
        patch: 0,
      };
    } else {
      // find the major version
      const filteredByMajor = byVersion.filter(
        (r) => r.version.major === recipe.version.major,
      );
      if (!filteredByMajor) {
        throw new Error("Major version not found");
      }
      const highestPatch = filteredByMajor
        .filter((r) => r.version.minor === recipe.version.minor)
        .reduce(
          (highest, r) => Math.max(highest, r.version.patch),
          recipe.version.patch,
        );

      newVersion = {
        major: recipe.version.major,
        minor: recipe.version.minor,
        patch: highestPatch + 1,
      };
    }

    await ctx.db.insert("recipe", {
      ...omitFromObject(recipe, ["_id", "_creationTime"]),
      name: recipe.name,
      version: newVersion,
      owner_id: userId,
      brew_lab_id: labId,
      updated_at: Date.now(),
      style: recipe.style,
    });

    await ctx.db.patch(labId, {
      associated_recipes: (found.associated_recipes || []).concat(
        args.recipeId,
      ),
    });
  },
});

export const createNewMajorVersion = mutation({
  args: {
    recipeId: v.id("recipe"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (recipe.owner_id !== userId) {
      throw new Error("Unauthorized");
    }

    const labId = recipe.brew_lab_id;

    const found = await ctx.db.get(labId);
    if (!found) {
      throw new Error("Brew lab not found");
    }

    const allRecipes = await ctx.db
      .query("recipe")
      .withIndex("by_brew_lab_by_owner", (q) =>
        q.eq("brew_lab_id", labId).eq("owner_id", userId),
      )
      .collect();

    const { byVersion } = getOrderedRecipes(allRecipes);

    const newMajorVersion = {
      major: byVersion[0].version.major + 1,
      minor: 0,
      patch: 0,
    };

    await ctx.db.insert("recipe", {
      ...omitFromObject(recipe, ["_id", "_creationTime"]),
      name: recipe.name,
      version: newMajorVersion,
      owner_id: userId,
      brew_lab_id: labId,
      updated_at: Date.now(),
      style: recipe.style,
    });

    await ctx.db.patch(labId, {
      associated_recipes: (found.associated_recipes || []).concat(
        args.recipeId,
      ),
    });

    return newMajorVersion;
  },
});

export const createNewMinorVersion = mutation({
  args: {
    recipeId: v.id("recipe"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (recipe.owner_id !== userId) {
      throw new Error("Unauthorized");
    }

    const labId = recipe.brew_lab_id;

    const found = await ctx.db.get(labId);
    if (!found) {
      throw new Error("Brew lab not found");
    }

    const allRecipes = await ctx.db
      .query("recipe")
      .withIndex("by_brew_lab_by_owner", (q) =>
        q.eq("brew_lab_id", labId).eq("owner_id", userId),
      )
      .collect();

    const { byVersion } = getOrderedRecipes(allRecipes);

    const filteredByMajor = byVersion.filter(
      (r) => r.version.major === recipe.version.major,
    );
    if (!filteredByMajor) {
      throw new Error("Major version not found");
    }
    const highestMinor = filteredByMajor.reduce(
      (highest, r) => Math.max(highest, r.version.minor),
      recipe.version.minor,
    );

    const newMinorVersion = {
      major: recipe.version.major,
      minor: highestMinor + 1,
      patch: 0,
    };

    await ctx.db.insert("recipe", {
      ...omitFromObject(recipe, ["_id", "_creationTime"]),
      name: recipe.name,
      version: newMinorVersion,
      owner_id: userId,
      brew_lab_id: labId,
      updated_at: Date.now(),
      style: recipe.style,
    });

    await ctx.db.patch(labId, {
      associated_recipes: (found.associated_recipes || []).concat(
        args.recipeId,
      ),
    });
  },
});

export const createNewPatchVersion = mutation({
  args: {
    recipeId: v.id("recipe"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (recipe.owner_id !== userId) {
      throw new Error("Unauthorized");
    }

    const labId = recipe.brew_lab_id;

    const found = await ctx.db.get(labId);
    if (!found) {
      throw new Error("Brew lab not found");
    }

    const allRecipes = await ctx.db
      .query("recipe")
      .withIndex("by_brew_lab_by_owner", (q) =>
        q.eq("brew_lab_id", labId).eq("owner_id", userId),
      )
      .collect();

    const { byVersion } = getOrderedRecipes(allRecipes);

    const filteredByMajor = byVersion.filter(
      (r) => r.version.major === recipe.version.major,
    );
    if (!filteredByMajor) {
      throw new Error("Major version not found");
    }
    const filteredByMinor = filteredByMajor.filter(
      (r) => r.version.minor === recipe.version.minor,
    );
    if (!filteredByMinor) {
      throw new Error("Minor version not found");
    }
    const highestPatch = filteredByMinor.reduce(
      (highest, r) => Math.max(highest, r.version.patch),
      recipe.version.patch,
    );

    const newPatchVersion = {
      major: recipe.version.major,
      minor: recipe.version.minor,
      patch: highestPatch + 1,
    };

    await ctx.db.insert("recipe", {
      ...omitFromObject(recipe, ["_id", "_creationTime"]),
      name: recipe.name,
      version: newPatchVersion,
      owner_id: userId,
      brew_lab_id: labId,
      updated_at: Date.now(),
      style: recipe.style,
    });

    await ctx.db.patch(labId, {
      associated_recipes: (found.associated_recipes || []).concat(
        args.recipeId,
      ),
    });
  },
});
