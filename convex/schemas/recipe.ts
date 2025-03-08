import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recipe_schema = defineTable({
  name: v.string(),
  owner_id: v.id("users"),
  updated_at: v.number(),
  version: v.string(),
  brew_lab_id: v.id("brew_lab"), // which brew lab the recipe belongs to
  description: v.optional(v.string()),
  batch_size: v.object({
    value: v.number(),
    unit: v.union(
      v.literal("liters"),
      v.literal("gallons"),
      v.literal("barrels"),
    ),
  }),

  style: v.object({
    name: v.string(),
    category: v.optional(v.string()),
  }),

  status: v.union(
    v.literal("active"),
    v.literal("archived"),
    v.literal("draft"),
    v.literal("finalized"),
    v.literal("testing"),
    v.literal("retired"),
  ),

  ingredients: v.array(v.object({})),
}).index("by_owner", ["owner_id"]);
