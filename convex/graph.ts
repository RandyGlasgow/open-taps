import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getGraph = query({
  args: {
    id: v.id("graph"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const graph = await ctx.db.get(args.id);
    if (!graph) {
      throw new Error("Graph not found");
    }

    if (graph.owner_id !== userId) {
      throw new Error("Unauthorized");
    }

    return graph;
  },
});

export const updateGraph = mutation({
  args: {
    id: v.id("graph"),
    json_graph: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const graph = await ctx.db.get(args.id);
    if (!graph) {
      throw new Error("Graph not found");
    }

    if (graph.owner_id !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      json_graph: args.json_graph,
    });
  },
});

export const createNode = mutation({
  args: {
    graphId: v.id("graph"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const recipeTreeId = await ctx.db.insert("recipe", {
      name: "New Recipe",
      owner_id: userId,
      updated_at: Date.now(),
      version: "1",
    });

    const nodeId = await ctx.db.insert("node", {
      type: "recipe_tree_node",
      graph_id: args.graphId,
      associated_entity_id: recipeTreeId,
    });

    return nodeId;
  },
});

export const deleteNode = mutation({
  args: { id: v.id("node") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const node = await ctx.db.get(args.id);
    if (!node) {
      throw new Error("Node not found");
    }

    const graph = await ctx.db.get(node.graph_id);
    if (!graph) {
      throw new Error("Graph not found");
    }

    if (graph.owner_id !== userId) {
      throw new Error("Unauthorized");
    }

    // delete the node && associated entity
    await Promise.all([
      ctx.db.delete(args.id),
      ctx.db.delete(node.associated_entity_id),
    ]);
  },
});
