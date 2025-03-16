import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { graph_schema, node_schema } from "./graph.schema";
import { beer_style_catalog_schema as catalog_beer_style_schema } from "./schemas/beer_styles";
import { brew_lab_schema } from "./schemas/brew_lab";
import { recipe_schema } from "./schemas/recipe";
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
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    authorization: v.optional(v.array(v.literal("admin"))),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
  water_chem: water_chem_schema,
  brewing_terms_catalog: brewing_terms_catalog_schema,
  beer_style_catalog: beer_style_catalog_schema,
  brand_catalog: brand_catalog_schema,
  brew_lab: brew_lab_schema,
  catalog_beer_style: catalog_beer_style_schema,

  adjunct_catalog: adjunct_catalog_schema,
  yeast_catalog: yeast_catalog_schema,
  tag_catalog: tag_catalog_schema,
  hop_catalog: hop_catalog_schema,

  // graph
  graph: graph_schema.index("by_owner", ["owner_id", "graph_type"]),
  node: node_schema.index("by_graph", ["graph_id"]),

  // recipe
  recipe: recipe_schema,
});
