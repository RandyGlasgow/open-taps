import { v } from "convex/values";
import { query } from "../_generated/server";
import { sortRecipesByVersion } from "./lib/sortVersions";
import { validateUser } from "./lib/validateUser";
export const getMaxMajorVersion = query({
  args: { brewLabId: v.id("brew_lab") },
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx);

    const recipes = await ctx.db
      .query("recipe")
      .withIndex("by_brew_lab_by_owner", (q) =>
        q.eq("brew_lab_id", args.brewLabId).eq("owner_id", userId),
      )
      .collect();

    const highestMajor = recipes.reduce(
      (highest, { version }) => Math.max(highest, version.major),
      0,
    );

    return highestMajor;
  },
});

export const getMaxMinorVersion = query({
  args: { brewLabId: v.id("brew_lab"), majorVersion: v.number() },
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx);

    // finding a subset of the recipes by major version
    const recipes = await ctx.db
      .query("recipe")
      .withIndex("by_brew_lab_by_owner_id_by_major_version", (q) =>
        q
          .eq("brew_lab_id", args.brewLabId)
          .eq("owner_id", userId)
          .eq("version.major", args.majorVersion),
      )
      .collect();

    const highestMinor = recipes.reduce(
      (highest, { version }) => Math.max(highest, version.minor),
      0,
    );

    return highestMinor;
  },
});

export const getMaxPatchVersion = query({
  args: {
    brewLabId: v.id("brew_lab"),
    majorVersion: v.number(),
    minorVersion: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx);

    const recipes = await ctx.db
      .query("recipe")
      .withIndex("by_brew_lab_by_owner_id_by_minor_version", (q) =>
        q
          .eq("brew_lab_id", args.brewLabId)
          .eq("owner_id", userId)
          .eq("version.major", args.majorVersion)
          .eq("version.minor", args.minorVersion),
      )
      .collect();

    const highestPatch = recipes.reduce(
      (highest, { version }) => Math.max(highest, version.patch),
      0,
    );

    return highestPatch;
  },
});

export const getHighestVersion = query({
  args: { brewLabId: v.id("brew_lab") },
  handler: async (ctx, args) => {
    const userId = await validateUser(ctx);

    const recipes = await ctx.db
      .query("recipe")
      .withIndex("by_brew_lab_by_owner", (q) =>
        q.eq("brew_lab_id", args.brewLabId).eq("owner_id", userId),
      )
      .collect();

    const sortedRecipes = sortRecipesByVersion(recipes);

    return sortedRecipes[0];
  },
});
