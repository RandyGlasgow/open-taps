import { OptionalRestArgsOrSkip, useQuery } from "convex/react";
import { FunctionReference } from "convex/server";

export const useLoadingQuery = <Query extends FunctionReference<"query">>(
  query: Query,
  ...args: OptionalRestArgsOrSkip<Query>
) => useQuery(query, ...args) || "loading";
