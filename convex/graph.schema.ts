import { defineTable } from "convex/server";
import { v } from "convex/values";

export const graph_schema = defineTable({
  owner_id: v.id("users"),
  updated_at: v.number(),
  graph_type: v.union(v.literal("recipe_tree")), // Recipe Tree
  json_graph: v.string(),

  associated_nodes: v.array(v.id("node")),
});

export const node_schema = defineTable({
  graph_id: v.id("graph"),
  associated_entity_id: v.union(v.id("recipe")), // available doc
  type: v.union(v.literal("recipe_tree_node"), v.literal("root_recipe_node")),
});
