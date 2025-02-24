"use client";
import React, { useEffect, useRef } from "react";
import { ReactFlow } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function Page() {
  const { projectId } = useParams<{ projectId: Id<"user_project"> }>();
  const project =
    useQuery(api.project.getProject, { id: projectId }) || "loading";

  const reactFlowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // find the a tag with the href that contains the phrase reactflow
    const aTags = reactFlowRef.current?.querySelectorAll("a");
    aTags?.forEach((a) => {
      if (a.href.includes("reactflow")) {
        a.remove();
      }
    });
  }, []);

  if (project === "loading") {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <>
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <div
        className="w-full h-full rounded-md p-2 border-dashed border border-gray-300"
        ref={reactFlowRef}
      >
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          attributionPosition="bottom-center"
        />
      </div>
    </>
  );
}
