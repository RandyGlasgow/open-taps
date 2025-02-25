"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { GraphDisplay } from "./components/graph-display";

export default function Page() {
  const { recipeTreeId } = useParams<{ recipeTreeId: Id<"recipe_tree"> }>();

  const recipeTree =
    useQuery(api.recipe.getRecipeTree, {
      id: recipeTreeId,
    }) || "loading";

  const graph =
    useQuery(
      api.graph.getGraph,
      recipeTree !== "loading" && recipeTree.graph_id
        ? {
            id: recipeTree.graph_id,
          }
        : "skip",
    ) || "loading";

  return (
    <>
      {recipeTree === "loading" ? (
        <Skeleton className="h-9 w-full" />
      ) : (
        <h1 className="text-2xl font-bold h-9">{recipeTree.name}</h1>
      )}
      <div className="w-full h-full rounded-md border-dashed border border-gray-300">
        <ReactFlowProvider>
          {graph !== "loading" && <GraphDisplay graph={graph} />}
        </ReactFlowProvider>
      </div>
    </>
  );
}
