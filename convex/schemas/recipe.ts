import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recipe_schema = defineTable({
  name: v.string(),
  owner_id: v.id("users"),
  updated_at: v.number(),
  version: v.object({
    major: v.number(),
    minor: v.number(),
    patch: v.number(),
  }),

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

  ingredients: v.array(
    v.object({
      type: v.union(
        v.literal("fermentable"),
        v.literal("hop"),
        v.literal("yeast"),
        v.literal("other"),
      ),
      name: v.string(),
      amount: v.object({
        value: v.number(),
        unit: v.union(
          v.literal("kilograms"),
          v.literal("pounds"),
          v.literal("grams"),
        ),
      }),
    }),
  ),
})
  .index("by_owner", ["owner_id"])
  .index("by_brew_lab", ["brew_lab_id"])
  .index("by_brew_lab_by_owner", ["brew_lab_id", "owner_id"])
  .index("by_brew_lab_by_owner_id_by_major_version", [
    "brew_lab_id",
    "owner_id",
    "version.major",
  ])
  .index("by_brew_lab_by_owner_id_by_minor_version", [
    "brew_lab_id",
    "owner_id",
    "version.major",
    "version.minor",
  ])
  .index("by_brew_lab_by_owner_id_by_patch_version", [
    "brew_lab_id",
    "version.major",
    "version.minor",
    "version.patch",
  ]);
