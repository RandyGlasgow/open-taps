import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllRecipeTrees = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const recipeTrees = await ctx.db
      .query("recipe_tree")
      .withIndex("by_owner", (q) => q.eq("owner_id", userId))
      .collect();
    return recipeTrees;
  },
});

export const getRecipeTree = query({
  args: { id: v.id("recipe_tree") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const recipeTree = await ctx.db.get(args.id);
    if (!recipeTree) {
      throw new Error("Recipe tree not found");
    }
    if (recipeTree.owner_id !== userId) {
      throw new Error("Unauthorized");
    }
    return recipeTree;
  },
});

export const getRecipe = query({
  args: {
    treeId: v.id("recipe_tree"),
    recipeId: v.id("recipe"),
  },
  handler: async (ctx, args) => {},
});

export const createRecipeTree = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const date = Date.now();
    const graphId = await ctx.db.insert("graph", {
      owner_id: userId,
      graph_type: "recipe_tree",
      json_graph: JSON.stringify({
        nodes: [],
        edges: [],
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      }),
      updated_at: date,
    });

    return await ctx.db.insert("recipe_tree", {
      graph_id: graphId,
      updated_at: date,
      owner_id: userId,
      name: args.name,
      description: args.description,
    });
  },
});

export const updateRecipeTree = mutation({
  args: {
    id: v.id("recipe_tree"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    json_graph: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...args }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const recipeTree = await ctx.db.get(id);
    if (!recipeTree) {
      throw new Error("Recipe tree not found");
    }
    if (recipeTree.owner_id !== userId) {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch(id, Object.assign(recipeTree, args));
  },
});
