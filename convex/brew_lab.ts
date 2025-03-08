import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBrewLab = mutation({
  args: {
    name: v.string(),
    style: v.optional(v.id("beer_style_catalog")),
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
    style: v.optional(v.id("beer_style_catalog")),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const brewLab = await ctx.db.get(args.id);
    if (!brewLab) {
      throw new Error("Brew lab not found");
    }

    if (brewLab.owner_id !== userId) {
      throw new Error("User does not own this brew lab");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      style: args.style,
      description: args.description,
      updated_at: Date.now(),
    });
  },
});

export const deleteBrewLab = mutation({
  args: {
    id: v.id("brew_lab"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const brewLab = await ctx.db.get(args.id);
    if (!brewLab) {
      throw new Error("Brew lab not found");
    }

    if (brewLab.owner_id !== userId) {
      throw new Error("User does not own this brew lab");
    }

    await ctx.db.delete(args.id);
  },
});

export const getBrewLab = query({
  args: {
    id: v.id("brew_lab"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const brewLab = await ctx.db.get(args.id);
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
