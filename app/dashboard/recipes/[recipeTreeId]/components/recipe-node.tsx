import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Handle, Position, useNodeId, useReactFlow } from "@xyflow/react";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";

export const BaseNode = ({ asRoot = false }: { asRoot?: boolean }) => {
  const nodeId = useNodeId() as Id<"node">;

  const node = useQuery(api.recipe.getRecipe, { nodeId });

  return (
    <Card className="w-96 h-56 group relative">
      <NodeContextArea nodeId={nodeId}>
        {!asRoot && <Handle type="target" position={Position.Top} />}
        <div className="flex flex-col gap-2 overflow-hidden">
          <pre className="overflow-scroll">{JSON.stringify(node, null, 2)}</pre>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="flex justify-center items-center"
        ></Handle>
      </NodeContextArea>
    </Card>
  );
};
export const RootRecipeNode = () => <BaseNode asRoot />;
export const RecipeNode = () => <BaseNode />;

const NodeContextArea = ({
  children,
  nodeId,
}: {
  children: React.ReactNode;
  nodeId: Id<"node">;
}) => {
  const { recipeTreeId } = useParams<{ recipeTreeId: Id<"recipe_tree"> }>();
  const rf = useReactFlow();
  const deleteNode = useMutation(api.graph.deleteNode);
  const updateGraph = useMutation(api.graph.updateGraph);
  const recipeTree =
    useQuery(
      api.recipe.getRecipeTree,
      !recipeTreeId
        ? "skip"
        : {
            id: recipeTreeId,
          },
    ) || "loading";

  const [alertAboutRootNodes, setAlertAboutRootNodes] = useState(false);

  const handleDelete = async () => {
    if (recipeTree === "loading") return;

    // remove the node from the graph
    let graphObject = rf.toObject();
    const foundNode = graphObject.nodes.find((n) => n.id === nodeId);
    if (!foundNode) return;

    if (foundNode.type === "root_recipe_node" && graphObject.nodes.length > 1) {
      setAlertAboutRootNodes(true);
      return;
    }

    const filteredNodes = (graphObject.nodes = graphObject.nodes.filter(
      (n) => n.id !== nodeId,
    ));
    const filteredEdges = graphObject.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId,
    );
    graphObject = {
      ...graphObject,
      nodes: filteredNodes,
      edges: filteredEdges,
    };

    await updateGraph({
      id: recipeTree.graph_id,
      json_graph: JSON.stringify(graphObject),
    })
      .then(() => {
        // set the nodes and edges in the react flow
        rf.setNodes(graphObject.nodes);
        rf.setEdges(graphObject.edges);
      })
      .then(() => deleteNode({ id: nodeId }));
  };

  return (
    <>
      <AlertDialog
        open={alertAboutRootNodes}
        onOpenChange={setAlertAboutRootNodes}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cannot Delete Root Node</AlertDialogTitle>
            <AlertDialogDescription>
              The root recipe cannot be deleted while it has child recipes.
              Please delete all child recipes first before attempting to delete
              the root recipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertAboutRootNodes(false)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex flex-col gap-2 overflow-hidden">{children}</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
