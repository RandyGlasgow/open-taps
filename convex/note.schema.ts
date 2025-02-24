import { defineTable } from "convex/server";
import { v } from "convex/values";

export const note_schema = defineTable({
  title: v.string(),
  content: v.string(),
  updated_at: v.number(),
  created_by: v.id("users"),
});
