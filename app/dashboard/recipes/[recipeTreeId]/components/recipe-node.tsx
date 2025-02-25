import { Card } from "@/components/ui/card";
import { Handle, Position, useNodeId } from "@xyflow/react";

export const RecipeNode = () => {
  const nodeId = useNodeId();

  // const node = useQuery(api.graph.getNode, { id: nodeId });

  return (
    <Card className="w-40 h-40">
      <Handle type="target" position={Position.Top} />
      Recipe Node {nodeId}
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export const RootRecipeNode = () => {
  return (
    <Card className="w-40 h-40">
      <Handle type="source" position={Position.Bottom} />
      Root Recipe Node
    </Card>
  );
};
