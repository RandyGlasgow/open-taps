import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createBrewJournal = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const brewJournal = await ctx.db.insert("brew_journal", {
      name: args.name,
      description: args.description,
      user_id: userId,
      updated_at: Date.now(),
      json_data: "{}",
      associated_entries: [],
      notes: [],
    });

    return brewJournal;
  },
});

export const getBrewJournals = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    return await ctx.db
      .query("brew_journal")
      .filter((q) => q.eq(q.field("user_id"), userId))
      .collect();
  },
});

export const getBrewJournal = query({
  args: {
    id: v.id("brew_journal"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const brewJournal = await ctx.db.get(args.id);
    if (!brewJournal) {
      throw new Error("Brew journal not found");
    }

    if (brewJournal.user_id !== userId) {
      throw new Error("You are not allowed to access this brew journal");
    }

    return brewJournal;
  },
});
