import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handle, Position, useNodeId } from "@xyflow/react";
import { LucideExpand, NotebookIcon } from "lucide-react";

export const GraphNode = () => {
  const id = useNodeId();

  return (
    <Card>
      <Handle type="target" position={Position.Top} />
      <CardHeader>
        <CardTitle>Log Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <p> custom node {id}</p>
      </CardContent>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export const RootNode = () => {
  return (
    <Card className="min-w-44 max-w-96 group relative">
      <Handle type="source" position={Position.Bottom} />
      <CardHeader>
        <CardTitle>Root</CardTitle>
      </CardHeader>
      <CardContent className="">
        <p></p>
        <div
          id="notes"
          className="absolute -top-3 left-3 w-full group-hover:flex hidden items-center justify-end gap-2 "
        >
          <Button variant="outline" size="icon" className="w-6 h-6">
            <LucideExpand />
          </Button>

          <Button variant="outline" size="icon" className="w-6 h-6">
            <NotebookIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
