import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { createRecipeGraph } from "../lib/graph";
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
  args: { nodeId: v.id("node") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const node = await ctx.db.get(args.nodeId);
    if (!node) {
      throw new Error("Node not found");
    }
    if (node.type !== "recipe_tree_node") {
      throw new Error("Node is not a recipe tree node");
    }
    const recipe = await ctx.db.get(node.associated_entity_id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    return recipe;
  },
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
          x: 50,
          y: 50,
          zoom: 1,
        },
      }),
      associated_nodes: [],
      updated_at: date,
    });

    const recipeId = await ctx.db.insert("recipe", {
      name: args.name,
      owner_id: userId,
      updated_at: date,
      version: "v1",
    });

    // create the first node
    const nodeId = await ctx.db.insert("node", {
      type: "recipe_tree_node",
      graph_id: graphId,
      associated_entity_id: recipeId,
    });

    // update the graph with the node
    await ctx.db.patch(graphId, {
      json_graph: createRecipeGraph(nodeId),
      associated_nodes: [nodeId],
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

export const createRecipe = mutation({
  args: {
    graphId: v.id("graph"),
    version: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const recipeId = await ctx.db.insert("recipe", {
      name: "New Recipe",
      owner_id: userId,
      updated_at: Date.now(),
      version: args.version ?? "1",
    });

    const nodeId = await ctx.db.insert("node", {
      type: "recipe_tree_node",
      graph_id: args.graphId,
      associated_entity_id: recipeId,
    });

    await ctx.db.patch(args.graphId, { associated_nodes: [nodeId] });
    return nodeId;
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
