/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as beer_styles from "../beer_styles.js";
import type * as brew_lab from "../brew_lab.js";
import type * as http from "../http.js";
import type * as recipe from "../recipe.js";
import type * as schemas_brew_lab from "../schemas/brew_lab.js";
import type * as schemas_recipe from "../schemas/recipe.js";
import type * as user from "../user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  beer_styles: typeof beer_styles;
  brew_lab: typeof brew_lab;
  http: typeof http;
  recipe: typeof recipe;
  "schemas/brew_lab": typeof schemas_brew_lab;
  "schemas/recipe": typeof schemas_recipe;
  user: typeof user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
