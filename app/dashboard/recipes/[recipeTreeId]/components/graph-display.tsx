import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useDebounceInterval, useTimeoutToggle } from "@/hooks/use-debounce";
import dagre from "@dagrejs/dagre";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import {
  Background,
  ConnectionLineType,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  Panel,
  ReactFlow,
  ReactFlowJsonObject,
  useEdgesState,
  useNodesState,
  useReactFlow,
  Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { RecipeNode, RootRecipeNode } from "./recipe-node";

const NodeTypes = {
  recipe_tree_node: RecipeNode,
  root_recipe_node: RootRecipeNode,
};

const getRandomId = () => Math.random().toString(36).substring(2, 15);

const parseGraph = (graph?: Doc<"graph"> | "loading") => {
  if (!graph || graph === "loading") {
    return { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } };
  }
  return JSON.parse(graph.json_graph) as ReactFlowJsonObject;
};

const dg = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutElements = (
  nodes: Node[],
  edges: Edge[],
  scaling: number = 1,
) => {
  // Define a scaling factor to control the distance between nodes

  dg.setGraph({ rankdir: "TB" });

  // We need to use the node type to infer dimensions since we can't directly measure DOM elements
  // during this calculation phase
  const getScaledDimensions = (node: Node) => {
    const { width = 160, height = 160 } = node.measured ?? {};
    return { width: width * scaling, height: height * scaling };
  };
  nodes.forEach((n) => dg.setNode(n.id, getScaledDimensions(n)));

  edges.forEach((edge) => {
    dg.setEdge(edge.source, edge.target);
  });

  dagre.layout(dg);

  const newNodes = nodes.map((node) => {
    const { x, y } = dg.node(node.id);
    const { width = 160, height = 160 } = node.measured ?? {};
    return { ...node, position: { x: x - width / 2, y: y - height / 2 } };
  });

  return { nodes: newNodes as Node[], edges };
};

export const GraphDisplay = ({ graph }: { graph: Doc<"graph"> }) => {
  const {
    nodes: initialNodes,
    edges: initialEdges,
    viewport: initialViewport,
  } = useMemo(() => parseGraph(graph), [graph]);

  const createNode = useMutation(api.recipe.createRecipe);
  const updateGraph = useMutation(api.graph.updateGraph);
  const rf = useReactFlow();
  const [isSaving, toggleIsSaving] = useTimeoutToggle(false, "2s");

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [viewport, setViewport] = useState(initialViewport);

  const update = useCallback(
    () =>
      updateGraph({
        id: graph._id,
        json_graph: JSON.stringify({ nodes, edges, viewport }),
      }).then(() => toggleIsSaving()),
    [updateGraph, graph._id, nodes, edges, viewport, toggleIsSaving],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onConnect = useCallback((params: any) => rf.addEdges([params]), [rf]);
  const onConnectEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any, connectionState: any) => {
      (async () => {
        const nodeId = await createNode({
          graphId: graph._id,
          version: ``,
        });
        // when a connection is dropped on the pane it's not valid
        if (!connectionState.isValid) {
          // we need to remove the wrapper bounds, in order to get the correct position
          const { clientX, clientY } =
            "changedTouches" in event ? event.changedTouches[0] : event;
          const randomX = Math.random() * 200;
          const posOrNeg = Math.random() > 0.5 ? randomX : -randomX;
          const newNode = {
            id: nodeId,
            position: rf.screenToFlowPosition({
              x: clientX + posOrNeg,
              y: clientY + 50,
            }),
            type: "recipe_tree_node",
            data: { label: `Node ${nodeId}` },
            origin: [0.5, 0.0],
          } satisfies Node;

          const newEdge = {
            id: getRandomId(),
            source: connectionState.fromNode.id,
            target: nodeId,
            type: ConnectionLineType.SmoothStep,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              height: 25,
              width: 25,
            },
          } satisfies Edge;

          // intercept the node creation and add it to the graph json
          const { nodes: newNodes, edges: newEdges } = {
            nodes: [...rf.getNodes(), newNode],
            edges: [...rf.getEdges(), newEdge],
          };

          updateGraph({
            id: graph._id,
            json_graph: JSON.stringify({
              ...parseGraph(graph),
              nodes: newNodes,
              edges: newEdges,
            }),
          }).then(() => toggleIsSaving());
          setNodes(newNodes);
          setEdges(newEdges);
        }
      })();
    },
    [createNode, graph, rf, setEdges, setNodes, updateGraph, toggleIsSaving],
  );

  useDebounceInterval(update, "10m");

  return (
    <ReactFlow
      nodeTypes={NodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      viewport={viewport}
      onViewportChange={setViewport}
    >
      <Panel position="top-right">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={update}
              className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse data-[saving=false]:animate-none"
              data-saving={isSaving}
            ></button>
          </TooltipTrigger>
          <TooltipContent>
            <TooltipArrow />
            <p>{isSaving ? "Saving..." : "Connected"}</p>
          </TooltipContent>
        </Tooltip>
      </Panel>
      <GraphMenuBar
        graphId={graph._id}
        nodes={nodes}
        edges={edges}
        viewport={viewport}
      />
      <MemoizedMiniMap />
      <MemoizedControls />
      <MemoizedBackground />
    </ReactFlow>
  );
};

const GraphMenuBar = ({
  graphId,
  nodes,
  edges,
  viewport,
}: {
  graphId: Id<"graph">;
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
}) => {
  const { getNodes, setNodes, addNodes, setEdges } = useReactFlow();
  const updateGraph = useMutation(api.graph.updateGraph);
  const createNode = useMutation(api.recipe.createRecipe);

  const hasRootNode = useMemo(
    () => nodes.some((n) => n.type === "root_recipe_node"),
    [nodes],
  );
  const update = useCallback(
    (json: ReactFlowJsonObject) =>
      updateGraph({ id: graphId, json_graph: JSON.stringify(json) }),
    [updateGraph, graphId],
  );
  const handleAddNode = useCallback(async () => {
    const nodeId = await createNode({ graphId });
    const nodes = getNodes();
    const newNode = {
      id: nodeId,
      type: nodes.length === 0 ? "root_recipe_node" : "recipe_tree_node",
      position: { x: 0, y: 0 },
      data: { node_id: nodeId },
    };
    addNodes([newNode]);
  }, [createNode, graphId, getNodes, addNodes]);

  return (
    <Panel>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <Tooltip>
              <TooltipTrigger
                className="w-full disabled:cursor-not-allowed"
                disabled={hasRootNode}
              >
                <MenubarItem
                  className="flex items-center gap-2 justify-between"
                  disabled={hasRootNode}
                  onClick={handleAddNode}
                >
                  Root Recipe
                  <Plus className="h-4 w-4" />
                </MenubarItem>
              </TooltipTrigger>
              <TooltipContent>
                <TooltipArrow />
                {hasRootNode ? (
                  <p>
                    <strong>Hmmm...</strong>
                    <br /> It seems you already have a root recipe.
                  </p>
                ) : (
                  <p>Add a root recipe to the recipe tree.</p>
                )}
              </TooltipContent>
            </Tooltip>
            <MenubarItem>Add Recipe</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => update({ nodes, edges, viewport })}>
              Save
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Organize</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              onClick={() => {
                const { nodes: newNodes, edges: newEdges } = getLayoutElements(
                  nodes,
                  edges,
                  1,
                );
                setNodes(newNodes);
                setEdges(newEdges);
                update({ nodes: newNodes, edges: newEdges, viewport });
              }}
            >
              Dense
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                const { nodes: newNodes, edges: newEdges } = getLayoutElements(
                  nodes,
                  edges,
                  1.5,
                );
                setNodes(newNodes);
                setEdges(newEdges);
                update({ nodes: newNodes, edges: newEdges, viewport });
              }}
            >
              Balanced
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                const { nodes: newNodes, edges: newEdges } = getLayoutElements(
                  nodes,
                  edges,
                  2,
                );
                setNodes(newNodes);
                setEdges(newEdges);
                update({ nodes: newNodes, edges: newEdges, viewport });
              }}
            >
              Spacious
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Panel>
  );
};

const MemoizedBackground = memo(() => <Background />);
MemoizedBackground.displayName = "Background";

const MemoizedMiniMap = memo(() => <MiniMap />);
MemoizedMiniMap.displayName = "MiniMap";

const MemoizedControls = memo(() => <Controls />);
MemoizedControls.displayName = "Controls";
