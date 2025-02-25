import { ReactFlowProvider } from "@xyflow/react";
import AddNodeOnEdgeDrop from "./auto-add-node";

export const GraphDisplay = () => {
  return (
    <ReactFlowProvider>
      <AddNodeOnEdgeDrop />
    </ReactFlowProvider>
  );
};
