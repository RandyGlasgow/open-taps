import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recipe_tree_schema = defineTable({
  graph_id: v.id("graph"),
  owner_id: v.id("users"),
  name: v.string(),
  description: v.string(),
  updated_at: v.number(),
});

export const recipe_schema = defineTable({
  owner_id: v.id("users"),
  name: v.string(),
  version: v.number(),
  updated_at: v.number(),
});
