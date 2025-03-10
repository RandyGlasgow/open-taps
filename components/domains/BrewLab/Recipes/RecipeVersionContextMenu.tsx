import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { useMutation, useQuery } from "convex/react";
import { Trash2 } from "lucide-react";
import { PropsWithChildren, useEffect } from "react";

export const RecipeVersionContextMenu = ({
  children,
  recipe,
}: PropsWithChildren<{ recipe: Doc<"recipe"> }>) => {
  const highestMajor = useQuery(api.recipe.get.getMaxMajorVersion, {
    brewLabId: recipe.brew_lab_id,
  });

  useEffect(() => {
    console.log({ highestMajor });
  }, [highestMajor]);
  const createNewMajorVersion = useMutation(api.recipe.createNewMajorVersion);
  const createNewMinorVersion = useMutation(api.recipe.createNewMinorVersion);
  const createNewPatchVersion = useMutation(api.recipe.createNewPatchVersion);
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <span className="text-sm font-medium p-2">Change</span>
        <ContextMenuSeparator />
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <ContextMenuItem
              className="flex items-center gap-2 justify-between cursor-pointer"
              onClick={() => createNewMajorVersion({ recipeId: recipe._id })}
            >
              Recipe
              <VersioningIcon type="major" recipe={recipe} />
            </ContextMenuItem>
          </TooltipTrigger>
          <TooltipContent side="right" avoidCollisions>
            <TooltipArrow />
            Major changes to style or core ingredients
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <ContextMenuItem
              className="flex items-center gap-2 justify-between group cursor-pointer"
              onClick={() => createNewMinorVersion({ recipeId: recipe._id })}
            >
              Process
              <VersioningIcon type="minor" recipe={recipe} />
            </ContextMenuItem>
          </TooltipTrigger>
          <TooltipContent side="right" avoidCollisions>
            <TooltipArrow />
            Changes to brewing techniques or equipment
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <ContextMenuItem
              className="flex items-center gap-2 justify-between group cursor-pointer"
              onClick={() => createNewPatchVersion({ recipeId: recipe._id })}
            >
              Adjust
              <VersioningIcon type="patch" recipe={recipe} />
            </ContextMenuItem>
          </TooltipTrigger>
          <TooltipContent side="right" avoidCollisions>
            <TooltipArrow />
            Minor tweaks to quantities or timing
          </TooltipContent>
        </Tooltip>
        <ContextMenuSeparator />
        <ContextMenuItem className="flex items-center gap-2 cursor-pointer">
          <Trash2 className="w-4 h-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

type VersionType = "major" | "minor" | "patch";

interface VersioningIconProps {
  type: VersionType;
  recipe: Doc<"recipe">;
}

const VersioningIcon = ({ type, recipe }: VersioningIconProps) => {
  const highestMajor = useQuery(api.recipe.get.getMaxMajorVersion, {
    brewLabId: recipe.brew_lab_id,
  });
  const highestMinor = useQuery(api.recipe.get.getMaxMinorVersion, {
    brewLabId: recipe.brew_lab_id,
    majorVersion: recipe.version.major,
  });
  const highestPatch = useQuery(api.recipe.get.getMaxPatchVersion, {
    brewLabId: recipe.brew_lab_id,
    majorVersion: recipe.version.major,
    minorVersion: recipe.version.minor,
  });
  switch (type) {
    case "major":
      return (
        <span className="text-sm font-medium text-zinc-400">
          v
          <span className="text-foreground font-bold">
            {highestMajor ? highestMajor + 1 : 1}
          </span>
          .0.0
        </span>
      );
    case "minor":
      return (
        <span className="text-sm font-medium text-zinc-400">
          v{recipe.version.major}.
          <span className="text-foreground font-bold">
            {highestMinor ? highestMinor + 1 : 1}
          </span>
          .0
        </span>
      );
    case "patch":
      return (
        <span className="text-sm font-medium text-zinc-400">
          v{recipe.version.major}.{recipe.version.minor}.
          <span className="text-foreground font-bold">
            {highestPatch ? highestPatch + 1 : 1}
          </span>
        </span>
      );
  }
};
