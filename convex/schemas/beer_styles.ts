import { defineTable } from "convex/server";
import { v } from "convex/values";

const measureObject = (
  relative_unit: "plato" | "percent" | "ibu" | "srm" | "ebc",
) =>
  v.object({
    relative_unit: v.literal(relative_unit),
    min: v.number(),
    max: v.number(),
  });

export const beer_style_catalog_schema = defineTable({
  category: v.union(v.literal("ale"), v.literal("lager"), v.literal("hybrid")),
  origin: v.string(),
  name: v.string(),
  original_gravity_plato: measureObject("plato"),
  original_gravity: measureObject("percent"),
  final_gravity_plato: measureObject("plato"),
  final_gravity: measureObject("percent"),
  color_srm: measureObject("srm"),
  color_ebc: measureObject("ebc"),
  hop_bitterness: measureObject("ibu"),

  // characteristics
  characteristics_body: v.string(),
  characteristics_color: v.string(),
  characteristics_clarity: v.string(),
  characteristics_malt_aroma_flavor: v.string(),
  characteristics_hop_aroma_flavor: v.string(),
  characteristics_bitterness: v.string(),
  characteristics_fermentation: v.string(),
});
