import { defineTable } from "convex/server";
import { v } from "convex/values";

export const brew_journal_schema = defineTable({
  name: v.string(),
  description: v.string(),
  updated_at: v.number(),

  // the graph data
  json_data: v.string(),

  // brew_log_entry
  associated_entries: v.array(v.id("brew_log_entry")),

  // user
  user_id: v.id("users"),
  notes: v.array(v.id("note")),
});

export const brew_journal_entry_schema = defineTable({
  brew_journal_id: v.id("brew_journal"),
  json_data: v.string(),
  notes: v.array(v.id("note")),
});
