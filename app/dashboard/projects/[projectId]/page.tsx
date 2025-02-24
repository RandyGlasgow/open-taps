"use client";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Panel, ReactFlow, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Note = ({ data }: { data: unknown }) => {
  console.log(data);
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Add Node 2</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const nodeTypes = {
  note: Note,
};

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "1" },
    notes: [],
    type: "note",
  },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" }, notes: [] },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function Page() {
  const { projectId } = useParams<{ projectId: Id<"brew_journal"> }>();
  const project =
    useQuery(api.brew_journal.getBrewJournal, { id: projectId }) || "loading";

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
        className="w-full h-full rounded-md border-dashed border border-gray-300"
        ref={reactFlowRef}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <ReactFlow
              nodes={initialNodes}
              edges={initialEdges}
              nodeTypes={nodeTypes}
            >
              <PanelActions />
            </ReactFlow>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Add Node</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </>
  );
}

const PanelActions = () => {
  const { toObject } = useReactFlow();
  const [data, setData] = useState<unknown>(null);
  useEffect(() => {
    setData(toObject());
  }, [toObject]);

  return (
    <Panel className="z-10">
      <Button onClick={() => console.log(data)}>Add Node</Button>
    </Panel>
  );
};
