import { defineTable } from "convex/server";
import { v } from "convex/values";

export const brew_lab_schema = defineTable({
  name: v.string(),
  style: v.optional(v.id("beer_style_catalog")),
  description: v.optional(v.string()),
  owner_id: v.id("users"),
  updated_at: v.number(),
  graph_id: v.id("graph"),
  graph_json: v.optional(v.string()),
  current_batch_id: v.optional(v.id("batch")),
  associated_recipes: v.optional(v.array(v.id("recipe"))),
}).index("by_owner", ["owner_id"]);
