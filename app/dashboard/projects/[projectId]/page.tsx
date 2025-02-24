"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProvider,
  Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ActionMenuBar } from "../components/graph/action-menu-bar";
import { GraphActionsContextMenu } from "../components/graph/graph-actions-context-menu";
import { LogEntryNode } from "../components/graph/nodes";

const nodeTypes = {
  logEntry: LogEntryNode,
};

export default function Page() {
  const { projectId } = useParams<{ projectId: Id<"brew_journal"> }>();

  const brewJournal =
    useQuery(
      api.brew_journal.getBrewJournal,
      projectId
        ? {
            id: projectId,
          }
        : "skip",
    ) || "loading";

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    zoom: 1,
  });

  useEffect(() => {
    if (!brewJournal || brewJournal === "loading") return;

    const { nodes, edges, viewport } = JSON.parse(brewJournal.json_data);
    setNodes(nodes);
    setEdges(edges);
    setViewport(viewport);
  }, [brewJournal]);

  const onNodesChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

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
        <ReactFlowProvider>
          <GraphActionsContextMenu>
            <ReactFlow
              viewport={viewport}
              nodeTypes={nodeTypes}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onViewportChange={setViewport}
              attributionPosition="top-right"
            >
              <ActionMenuBar />
              <Controls position="bottom-right" />
              <Background />
            </ReactFlow>
          </GraphActionsContextMenu>
        </ReactFlowProvider>
      </div>
    </>
  );
}
