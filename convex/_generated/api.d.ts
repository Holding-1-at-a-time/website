/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as api_bookings from "../api/bookings.js";
import type * as api_reviews from "../api/reviews.js";
import type * as api_services from "../api/services.js";
import type * as auth from "../auth.js";
import type * as functions_bookings from "../functions/bookings.js";
import type * as functions_seed from "../functions/seed.js";
import type * as functions_services from "../functions/services.js";
import type * as migrations_001_populate_initial_data from "../migrations/001_populate_initial_data.js";
import type * as model_bookings from "../model/bookings.js";
import type * as model_reviews from "../model/reviews.js";
import type * as model_services from "../model/services.js";
import type * as types from "../types.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "api/bookings": typeof api_bookings;
  "api/reviews": typeof api_reviews;
  "api/services": typeof api_services;
  auth: typeof auth;
  "functions/bookings": typeof functions_bookings;
  "functions/seed": typeof functions_seed;
  "functions/services": typeof functions_services;
  "migrations/001_populate_initial_data": typeof migrations_001_populate_initial_data;
  "model/bookings": typeof model_bookings;
  "model/reviews": typeof model_reviews;
  "model/services": typeof model_services;
  types: typeof types;
  validators: typeof validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
