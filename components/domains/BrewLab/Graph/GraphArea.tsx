"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ReactFlowProvider } from "@xyflow/react";
import { useQuery } from "convex/react";
export const GraphArea = ({ id }: { id: Id<"brew_lab"> }) => {
  const brewLab = useQuery(api.brew_lab.getAssociatedRecipes, { id });
  return (
    <ReactFlowProvider>
      <div className="max-h-[calc(100vh-9rem)] h-full w-full border rounded-md border-dashed border-gray-300">
        <pre>{JSON.stringify(brewLab, null, 2)}</pre>
      </div>
    </ReactFlowProvider>
  );
};
