import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const updateBrewJournal = mutation({
  args: {
    id: v.id("brew_journal"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    json_data: v.optional(v.string()),
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
      throw new Error("You are not allowed to update this brew journal");
    }

    const { id, ...rest } = args;
    await ctx.db.patch(id, {
      ...rest,
      updated_at: Date.now(),
    });
  },
});

export const createBrewJournalEntry = mutation({
  args: {
    id: v.id("brew_journal"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    // double check that the brew journal exists
    const brewJournal = await ctx.db.get(args.id);
    if (!brewJournal) {
      throw new Error("Brew journal not found");
    }

    // double check that the user is the owner of the brew journal
    if (brewJournal.user_id !== userId) {
      throw new Error(
        "You are not allowed to create an entry for this brew journal",
      );
    }

    const brewJournalEntry = await ctx.db.insert("brew_journal_entry", {
      brew_journal_id: args.id,
      json_data: "{}",
      notes: [],
    });
    return brewJournalEntry;
  },
});

export const deleteBrewJournalEntry = mutation({
  args: {
    id: v.id("brew_journal_entry"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const brewJournalEntry = await ctx.db.get(args.id);
    if (!brewJournalEntry) {
      throw new Error("Brew journal entry not found");
    }

    const brewJournal = await ctx.db.get(brewJournalEntry.brew_journal_id);
    if (!brewJournal) {
      throw new Error("Brew journal not found");
    }

    if (brewJournal.user_id !== userId) {
      throw new Error("You are not allowed to delete this brew journal entry");
    }

    await ctx.db.delete(brewJournalEntry._id);
  },
});
