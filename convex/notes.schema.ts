import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notes_schema = defineTable({
  owner_id: v.id("user"),
  project_id: v.id("project"),
  title: v.optional(v.string()),
  content: v.optional(v.string()),
  updated_at: v.number(),
});
