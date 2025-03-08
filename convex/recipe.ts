import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
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
    version: v.string(),
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
      version: args.version,
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
