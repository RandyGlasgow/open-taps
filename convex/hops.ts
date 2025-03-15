import { query } from "./_generated/server";

export const getHops = query({
  args: {},
  handler: async (ctx) => {
    const hops = await ctx.db.query("hop_catalog").collect();

    return hops.sort((a, b) => a.display_name.localeCompare(b.display_name));
  },
});
