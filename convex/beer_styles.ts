import { v } from "convex/values";
import { query } from "./_generated/server";

export const getBeerStyles = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("beer_style_catalog").collect()).sort((a, b) =>
      a.display_name.localeCompare(b.display_name),
    );
  },
});

export const getBeerStyleById = query({
  args: { id: v.id("beer_style_catalog") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
