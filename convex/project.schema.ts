import { defineTable } from "convex/server";
import { v } from "convex/values";

export const projectSchema = defineTable({
  name: v.string(),
  description: v.string(),
  owner_id: v.id("users"),
  collaborators: v.array(v.id("users")),
  updated_at: v.number(),
  is_public: v.boolean(),
  json_data: v.optional(v.string()),
});
