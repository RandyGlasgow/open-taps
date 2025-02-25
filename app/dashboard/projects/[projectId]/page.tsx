"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import "@xyflow/react/dist/style.css";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { GraphDisplay } from "../components/graph/graph-display";

export default function Page() {
  const { projectId } = useParams<{ projectId: Id<"brew_journal"> }>();
  const brewJournal =
    useQuery(api.brew_journal.getBrewJournal, {
      id: projectId,
    }) || "loading";

  return (
    <>
      {brewJournal === "loading" ? (
        <Skeleton className="h-9 w-full" />
      ) : (
        <h1 className="text-2xl font-bold h-9">{brewJournal.name}</h1>
      )}
      <div
        className="w-full h-full rounded-md border-dashed border border-gray-300"
        ref={null}
      >
        <GraphDisplay />
      </div>
    </>
  );
}
