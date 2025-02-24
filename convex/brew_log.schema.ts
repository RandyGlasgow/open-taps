import { defineTable } from "convex/server";
import { v } from "convex/values";

const brew_log_schema = defineTable({
  owner_id: v.id("user"),
  project_id: v.id("project"),
  name: v.string(),
  description: v.string(),
  updated_at: v.number(),
});
