import { v } from "convex/values";
import { query } from "./_generated/server";

export const getBeerStyles = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("catalog_beer_style").collect()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  },
});

export const getBeerStyleById = query({
  args: { id: v.id("catalog_beer_style") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
