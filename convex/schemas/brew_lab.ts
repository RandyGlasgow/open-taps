import { defineTable } from "convex/server";
import { v } from "convex/values";

export const brew_lab_schema = defineTable({
  name: v.string(),
  style: v.id("catalog_beer_style"),
  description: v.optional(v.string()),
  owner_id: v.id("users"),
  updated_at: v.number(),
  graph_id: v.id("graph"),
  associated_recipes: v.optional(v.array(v.id("recipe"))),
}).index("by_owner", ["owner_id"]);
