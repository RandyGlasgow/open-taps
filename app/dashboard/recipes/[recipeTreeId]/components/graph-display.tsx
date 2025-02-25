import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import dagre from "@dagrejs/dagre";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
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

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB",
) => {
  const nodeWidth = 160;
  const nodeHeight = 160;
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes as Node[], edges };
};

export const GraphDisplay = ({ graph }: { graph: Doc<"graph"> }) => {
  const {
    nodes: initialNodes,
    edges: initialEdges,
    viewport: initialViewport,
  } = useMemo(() => {
    return parseGraph(graph);
  }, [graph]);

  const createNode = useMutation(api.graph.createNode);
  const updateGraph = useMutation(api.graph.updateGraph);
  const rf = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [viewport, setViewport] = useState(initialViewport);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onConnect = useCallback((params: any) => rf.addEdges([params]), [rf]);
  const onConnectEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any, connectionState: any) => {
      (async () => {
        const nodeId = await createNode({ graphId: graph._id });
        // when a connection is dropped on the pane it's not valid
        if (!connectionState.isValid) {
          // we need to remove the wrapper bounds, in order to get the correct position
          const id = getRandomId();
          const { clientX, clientY } =
            "changedTouches" in event ? event.changedTouches[0] : event;
          const newNode = {
            id: nodeId,
            position: rf.screenToFlowPosition({
              x: clientX,
              y: clientY,
            }),
            type: "recipe_tree_node",
            data: { label: `Node ${nodeId}` },
            origin: [0.5, 0.0],
          } satisfies Node;

          const newEdge = {
            id,
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
          const newNodes = [...rf.getNodes(), newNode];
          const newEdges = [...rf.getEdges(), newEdge];

          await updateGraph({
            id: graph._id,
            json_graph: JSON.stringify({
              ...parseGraph(graph),
              nodes: newNodes,
              edges: newEdges,
            }),
          });
          setNodes(newNodes);
          setEdges(newEdges);
        }
      })();
    },
    [createNode, graph, rf, setEdges, setNodes, updateGraph],
  );

  return (
    <ReactFlow
      nodeTypes={NodeTypes}
      snapToGrid
      snapGrid={[10, 10]}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      viewport={viewport}
      onViewportChange={setViewport}
    >
      <Panel>
        <Button
          onClick={() =>
            rf.addNodes([
              {
                id: getRandomId(),
                type:
                  rf.getNodes().length === 0
                    ? "root_recipe_node"
                    : "recipe_tree_node",
                position: { x: 0, y: 0 },
                data: { node_id: getRandomId() },
              },
            ])
          }
        >
          Add Node
        </Button>
        <Button
          onClick={() => {
            updateGraph({
              id: graph._id,
              json_graph: JSON.stringify({ nodes, edges }),
            });
          }}
        >
          Save Graph
        </Button>
        <Button
          onClick={() => {
            const { nodes: layoutedNodes, edges: layoutedEdges } =
              getLayoutedElements(nodes, edges);
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
            updateGraph({
              id: graph._id,
              json_graph: JSON.stringify({
                nodes: layoutedNodes,
                edges: layoutedEdges,
                viewport: rf.getViewport(),
              }),
            });
          }}
        >
          Organize
        </Button>
      </Panel>
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};
