import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBrewLab = mutation({
  args: {
    name: v.string(),
    style: v.id("catalog_beer_style"),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // create a graph for the brew lab
    const graphId = await ctx.db.insert("graph", {
      owner_id: userId,
      updated_at: Date.now(),
      graph_type: "brew_lab",
      json_graph: JSON.stringify({
        nodes: [],
        edges: [],
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      }),
      associated_nodes: [],
    });

    // create a brew lab
    const brewLabId = await ctx.db.insert("brew_lab", {
      name: args.name,
      style: args.style,
      description: args.description,
      owner_id: userId,
      updated_at: Date.now(),
      graph_id: graphId,
    });

    return brewLabId;
  },
});

export const updateBrewLab = mutation({
  args: {
    id: v.id("brew_lab"),
    name: v.optional(v.string()),
    style: v.optional(v.id("catalog_beer_style")),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const [userId, brewLab] = await Promise.all([
      getAuthUserId(ctx),
      ctx.db.get(args.id),
    ]);

    if (!userId) {
      throw new Error("User not authenticated");
    }
    if (!brewLab) {
      throw new Error("Brew lab not found");
    }
    if (brewLab.owner_id !== userId) {
      throw new Error("User does not own this brew lab");
    }
    await Promise.all([
      ctx.db.patch(args.id, {
        ...(args.name !== undefined && { name: args.name }),
        ...(args.style !== undefined && { style: args.style }),
        ...(args.description !== undefined && {
          description: args.description,
        }),
        updated_at: Date.now(),
      }),
      ctx.db.patch(brewLab.graph_id, {
        updated_at: Date.now(),
      }),
      ...(brewLab.associated_recipes ?? []).map(async (recipeId) => {
        await ctx.db.patch(recipeId, {
          name: args.name,
          updated_at: Date.now(),
        });
      }),
    ]);
  },
});

export const deleteBrewLab = mutation({
  args: {
    id: v.id("brew_lab"),
  },
  handler: async (ctx, args) => {
    const [userId, brewLab] = await Promise.all([
      getAuthUserId(ctx),
      ctx.db.get(args.id),
    ]);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!brewLab) {
      throw new Error("Brew lab not found");
    }

    if (brewLab.owner_id !== userId) {
      throw new Error("User does not own this brew lab");
    }

    await Promise.all([
      ...(brewLab.associated_recipes ?? []).map(async (recipeId) => {
        await ctx.db.delete(recipeId);
      }),
      ctx.db.delete(brewLab.graph_id),
      ctx.db.delete(args.id),
    ]);
  },
});

export const deleteBrewLabRecipe = mutation({
  args: {
    id: v.id("brew_lab"),
    recipeId: v.id("recipe"),
  },
  handler: async (ctx, args) => {
    const [userId, brewLab] = await Promise.all([
      getAuthUserId(ctx),
      ctx.db.get(args.id),
    ]);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!brewLab) {
      throw new Error("Brew lab not found");
    }

    if (brewLab.owner_id !== userId) {
      throw new Error("User does not own this brew lab");
    }

    await Promise.all([
      ctx.db.delete(args.recipeId),
      ctx.db.patch(brewLab._id, {
        associated_recipes: (brewLab.associated_recipes ?? []).filter(
          (recipeId: string) => recipeId !== args.recipeId,
        ),
      }),
    ]);
  },
});

export const getBrewLab = query({
  args: {
    id: v.id("brew_lab"),
  },
  handler: async (ctx, args) => {
    const [userId, brewLab] = await Promise.all([
      getAuthUserId(ctx),
      ctx.db.get(args.id),
    ]);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!brewLab) {
      throw new Error("Brew lab not found");
    }

    if (brewLab.owner_id !== userId) {
      throw new Error("User does not own this brew lab");
    }

    return brewLab;
  },
});

export const getBrewLabList = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await ctx.db
      .query("brew_lab")
      .withIndex("by_owner", (q) => q.eq("owner_id", userId))
      .collect();
  },
});

export const getAssociatedRecipes = query({
  args: {
    id: v.id("brew_lab"),
  },
  handler: async (ctx, args) => {
    const [userId, brewLab] = await Promise.all([
      getAuthUserId(ctx),
      ctx.db.get(args.id),
    ]);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!brewLab) {
      throw new Error("Brew lab not found");
    }

    if (brewLab.owner_id !== userId) {
      throw new Error("User does not own this brew lab");
    }

    if (!brewLab.associated_recipes) {
      return [];
    }

    const found = await Promise.all(
      brewLab.associated_recipes.map(async (recipeId) => {
        return await ctx.db.get(recipeId);
      }),
    ).then((recipes) => recipes.filter((recipe) => recipe !== null));

    return found;
  },
});
