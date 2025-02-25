import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useDebounceInterval, useTimeoutToggle } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import {
  addEdge,
  Background,
  Controls,
  Edge,
  Node,
  OnConnectEnd,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { GraphNode, RootNode } from "./graph-node";

let id_base = 1;
const getId = () => `${id_base++}`;

const AddNodeOnEdgeDrop = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, toObject } = useReactFlow();
  const onConnect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  type Params = Parameters<OnConnectEnd>;
  const onConnectEnd = useCallback(
    (event: Params[0], connectionState: Params[1]) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY + 20,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setNodes((nds) => nds.concat(newNode as any));
        setEdges((eds) =>
          eds.concat({
            id,
            source: connectionState.fromNode!.id,
            target: id,
          }),
        );
      }
    },
    [screenToFlowPosition, setEdges, setNodes],
  );

  const { projectId } = useParams<{ projectId: Id<"brew_journal"> }>();
  const brewJournal =
    useQuery(api.brew_journal.getBrewJournal, {
      id: projectId,
    }) || "loading";

  const updateJournal = useMutation(api.brew_journal.updateBrewJournal);

  const [isUpdating, toggleIsUpdating] = useTimeoutToggle(false, "3s");
  const update = useCallback(
    () =>
      updateJournal({
        id: projectId,
        json_data: JSON.stringify(toObject()),
      })
        .then(() => {
          toggleIsUpdating();
        })
        .catch(() => {
          toast.error("Failed to update journal");
        }),
    [projectId, toObject, updateJournal, toggleIsUpdating],
  );
  useDebounceInterval(update, "10m");

  useEffect(() => {
    if (brewJournal !== "loading") {
      const jsonData = JSON.parse(brewJournal.json_data);
      setNodes(jsonData.nodes);
      setEdges(jsonData.edges);
    }
  }, [brewJournal, setEdges, setNodes]);

  return (
    <ReactFlow
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={{ log_entry: GraphNode, root_node: RootNode }}
    >
      <Controls />
      <Panel position="top-right">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={update}
              className={cn(
                "rounded-full bg-green-500 w-3 h-3 data-[updating=true]:animate-pulse overflow-hidden whitespace-nowrap",
              )}
              data-updating={isUpdating}
            />
          </TooltipTrigger>
          <TooltipContent>
            <TooltipArrow />
            Auto save
          </TooltipContent>
        </Tooltip>
      </Panel>
      <Background />
    </ReactFlow>
  );
};

export default AddNodeOnEdgeDrop;
