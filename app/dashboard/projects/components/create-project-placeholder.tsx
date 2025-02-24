import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BeakerIcon, FlaskConical } from "lucide-react";
import { CreateProjectDialog } from "./create-project-dialog";

export function CreateProjectPlaceholder() {
  return (
    <div className="h-full flex flex-col gap-4 justify-center items-center">
      <h2 className="text-2xl font-bold">Hmmm...</h2>
      <p className="text-sm text-muted-foreground text-center">
        Looks like you don't have any brew projects yet.
        <br />
        Let's fix that!
      </p>
      <CreateProjectDialog
        trigger={
          <Button>
            <span>Create Brew Project</span>
            <FlaskConical className="w-4 h-4" />
          </Button>
        }
      />
    </div>
  );
}
