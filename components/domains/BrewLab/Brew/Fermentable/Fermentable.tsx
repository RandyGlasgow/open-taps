import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

export const Fermentable = ({ recipe }: { recipe: Doc<"recipe"> }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle>Fermentable</CardTitle>
          <FermentableDialog recipeId={recipe._id} />
        </div>
      </CardHeader>
      <CardContent>
        <pre>{JSON.stringify(recipe, null, 2)}</pre>
      </CardContent>
    </Card>
  );
};

const FermentableDialog = ({ recipeId }: { recipeId: Id<"recipe"> }) => {
  const [open, setOpen] = useState(false);
  const hops = useQuery(api.hops.getHops);
  const addFermentable = useMutation(api.recipe.addFermentable);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Add Fermentable
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="min-h-[100px]">
          <DialogTitle className="sr-only">Add Fermentable</DialogTitle>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            {hops?.map((hop) => (
              <CommandItem
                key={hop._id}
                value={hop.display_name}
                onSelect={() => {
                  addFermentable({
                    recipeId: recipeId,
                    fermentableId: hop._id,
                    type: "hop",
                  });
                }}
              >
                {hop.display_name}
              </CommandItem>
            ))}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
};
