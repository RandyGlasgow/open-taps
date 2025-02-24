import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useDebounceInterval } from "@/hooks/use-debounce";
import { useReactFlow } from "@xyflow/react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export const GraphActionsContextMenu = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getNodes, toObject } = useReactFlow();
  const updateBrewJournal = useMutation(api.brew_journal.updateBrewJournal);
  const createBrewJournalEntry = useMutation(
    api.brew_journal.createBrewJournalEntry,
  );

  const { projectId } = useParams<{ projectId: Id<"brew_journal"> }>();

  const addNode = useCallback(async () => {
    const nodes = getNodes();
    createBrewJournalEntry({
      id: projectId,
    }).then((id) => {
      updateBrewJournal({
        id: projectId,
        json_data: JSON.stringify({
          ...toObject(),
          nodes: [
            ...nodes,
            {
              id: `${nodes.length + 1}`,
              position: { x: 0, y: 0 },
              data: {
                brewJournalEntryId: id,
              },
              type: "logEntry",
            },
          ],
        }),
      });
    });
  }, [
    createBrewJournalEntry,
    getNodes,
    projectId,
    toObject,
    updateBrewJournal,
  ]);

  useDebounceInterval(() => {
    updateBrewJournal({
      id: projectId,
      json_data: JSON.stringify(toObject()),
    })
      .then(() => toast.success("Auto save"))
      .catch(() => toast.error("Failed to auto save"));
  }, "5m");

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={addNode}>Add Log Entry</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
