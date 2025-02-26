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

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [viewport, setViewport] = useState(initialViewport);

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
  const handleAddNode = async () => {
    const nodeId = await createNode({ graphId: graph._id });
    rf.addNodes([
      {
        id: nodeId,
        type: nodes.length === 0 ? "root_recipe_node" : "recipe_tree_node",
        position: { x: 0, y: 0 },
        data: { node_id: nodeId },
      },
    ]);
  };
  const update = (json: ReactFlowJsonObject) =>
    updateGraph({ id: graph._id, json_graph: JSON.stringify(json) });

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
      <Panel>
        <Button onClick={handleAddNode}>Add Node</Button>
        <Button onClick={() => update(rf.toObject())}>Save Graph</Button>
        <Button
          onClick={() => {
            const { nodes: n, edges: e } = getLayoutElements(nodes, edges, 1.5);
            setNodes(n);
            setEdges(e);
            update({ nodes: n, edges: e, viewport: rf.getViewport() });
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
