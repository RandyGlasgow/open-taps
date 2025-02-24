import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Panel, useReactFlow } from "@xyflow/react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DeleteLogEntryDialog } from "./delete-log-entry-dialog";

export function ActionMenuBar() {
  const actions = useReactFlow();
  const updateBrewJournal = useMutation(api.brew_journal.updateBrewJournal);
  const { projectId } = useParams<{ projectId: Id<"brew_journal"> }>();

  const save = useCallback(() => {
    updateBrewJournal({
      id: projectId,
      json_data: JSON.stringify(actions.toObject()),
    })
      .then(() =>
        toast.success("Saved", {
          richColors: true,
          classNames: {
            icon: "stroke-green-500",
            content: "p-0",
            toast: "p-0",
          },
        }),
      )
      .catch(() => toast.error("Failed to save"));
  }, [actions, projectId, updateBrewJournal]);

  const clear = useCallback(() => {
    updateBrewJournal({
      id: projectId,
      json_data: JSON.stringify({
        nodes: [],
        edges: [],
      }),
    });
  }, [projectId, updateBrewJournal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        save();
      }
    };
    window.addEventListener("keydown", handleKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [save]);

  const [open, setOpen] = useState(false);
  return (
    <Panel>
      <DeleteLogEntryDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={clear}
      />
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              onClick={save}
              className="flex items-center gap-2 justify-between"
            >
              Save
              <MenubarShortcut className="flex items-center">
                ctrl+s
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => setOpen(true)}>
              Clear Entries
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Panel>
  );
}
