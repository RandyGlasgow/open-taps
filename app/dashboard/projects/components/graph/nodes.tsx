import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Handle, Position, useNodeId, useReactFlow } from "@xyflow/react";
import { useMutation } from "convex/react";
import { Maximize, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";

export const LogEntryNode = () => {
  const { getNode, toObject } = useReactFlow();
  const id = useNodeId();
  const deleteBrewJournalEntry = useMutation(
    api.brew_journal.deleteBrewJournalEntry,
  );
  const updateBrewJournal = useMutation(api.brew_journal.updateBrewJournal);
  const { projectId } = useParams<{ projectId: Id<"brew_journal"> }>();

  const deleteNode = useCallback(() => {
    const node = getNode(id!) as unknown as {
      data: { brewJournalEntryId: Id<"brew_journal_entry"> };
    };
    if (!node) return;
    deleteBrewJournalEntry({ id: node.data.brewJournalEntryId }).then(() => {
      const graph = toObject();
      updateBrewJournal({
        id: projectId,
        json_data: JSON.stringify({
          ...graph,
          nodes: graph.nodes.filter((n) => n.id !== id),
        }),
      });
    });
  }, [
    id,
    projectId,
    updateBrewJournal,
    deleteBrewJournalEntry,
    getNode,
    toObject,
  ]);

  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Entry: {id}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col gap-2">Log Entry: {id}</div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex items-center gap-2">
            <Handle position={Position.Right} type="source" />
            <Handle position={Position.Top} type="source" />
            <Card className="text-sm font-medium p-2 border rounded-md bg-background">
              <CardHeader>
                <CardTitle>Log Entry: {id}</CardTitle>
              </CardHeader>
            </Card>
            <Handle position={Position.Left} type="source" />
            <Handle position={Position.Bottom} type="source" />
            <Handle position={Position.Bottom} type="target" />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={deleteNode}
              className="w-full flex items-center gap-2 justify-between"
            >
              Delete
              <Trash className="w-4 h-4" />
            </Button>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(true)}
              className="w-full flex items-center gap-2 justify-between"
            >
              Expand
              <Maximize className="w-4 h-4" />
            </Button>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
