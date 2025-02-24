import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { projectSchema } from "./project.schema";
import { note_schema } from "./note.schema";
import {
  brew_journal_entry_schema,
  brew_journal_schema,
} from "./brew_log.schema";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.

const water_chem_schema = defineTable({
  title: v.string(),
  scientific_name: v.optional(v.string()),
  chemical_elements: v.optional(v.string()),
  water_impact: v.optional(v.string()),
  updated_at: v.number(),
});

const adjunct_catalog_schema = defineTable({
  title: v.string(),
  also_known_as: v.optional(v.string()),
  description: v.optional(v.string()),
  type: v.optional(v.string()),
  species: v.optional(v.string()),
  category: v.optional(v.string()),
  brewing_values: v.array(
    v.object({
      value: v.string(),
      type_id: v.id("brewing_terms_catalog"),
    }),
  ),
  updated_at: v.number(),
});

const brewing_terms_catalog_schema = defineTable({
  display_name: v.string(),
  name: v.string(),
  description: v.string(),
  updated_at: v.number(),
  source: v.optional(v.string()),
});

const beer_style_catalog_schema = defineTable({
  display_name: v.string(),
  name: v.string(),
  description: v.string(),
  updated_at: v.number(),
});

const brand_catalog_schema = defineTable({
  display_name: v.string(),
  name: v.string(),
  url: v.string(),
  updated_at: v.number(),
});

const yeast_catalog_schema = defineTable({
  display_name: v.string(),
  name: v.string(),
  brand_id: v.id("brand_catalog"),
  type: v.optional(v.string()),
  form: v.optional(v.string()),
  species: v.optional(v.string()),
  brewing_values: v.array(
    v.object({
      value: v.string(),
      type_id: v.id("brewing_terms_catalog"),
    }),
  ),
  comparable_yeast: v.array(v.string()),
  common_beer_styles: v.array(v.id("beer_style_catalog")),
  url: v.optional(v.string()),
  description: v.optional(v.string()),
  updated_at: v.number(),
});

const tag_catalog_schema = defineTable({
  display_name: v.string(),
  name: v.string(),
  type: v.optional(v.string()),
  updated_at: v.number(),
});

const hop_catalog_schema = defineTable({
  display_name: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  origin: v.optional(v.string()),
  flavor_profile: v.optional(v.string()),
  tags: v.array(v.id("tag_catalog")),
  ownership_id: v.optional(v.id("brand_catalog")),
  international_code: v.optional(v.string()),
  country_of_origin: v.optional(v.string()),
  purpose: v.optional(v.string()),
  brewing_values: v.array(
    v.object({
      value: v.string(),
      type_id: v.id("brewing_terms_catalog"),
    }),
  ),
  beer_styles: v.array(v.id("beer_style_catalog")),
  updated_at: v.number(),
});

export default defineSchema({
  ...authTables,
  water_chem: water_chem_schema,
  adjunct_catalog: adjunct_catalog_schema,
  brewing_terms_catalog: brewing_terms_catalog_schema,
  beer_style_catalog: beer_style_catalog_schema,
  brand_catalog: brand_catalog_schema,
  yeast_catalog: yeast_catalog_schema,
  tag_catalog: tag_catalog_schema,
  hop_catalog: hop_catalog_schema,

  // project
  // user_project: projectSchema,

  // note
  note: note_schema,

  // brew_journal
  brew_journal: brew_journal_schema,
  brew_journal_entry: brew_journal_entry_schema,
});
