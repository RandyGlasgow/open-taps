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
import { Id } from "@/convex/_generated/dataModel";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
import { PropsWithChildren } from "react";

export const RecipeVersionContextMenu = ({
  children,
  recipeId,
}: PropsWithChildren<{ recipeId: Id<"recipe"> }>) => {
  const createNewVersion = useMutation(api.recipe.createNewVersion);
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <span className="text-sm font-medium p-2">Change</span>
        <ContextMenuSeparator />
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <ContextMenuItem
              className="flex items-center gap-2 justify-between group cursor-pointer"
              onClick={() => createNewVersion({ recipeId, type: "major" })}
            >
              Recipe
              <VersioningIcon type="major" />
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
              onClick={() => createNewVersion({ recipeId, type: "minor" })}
            >
              Process
              <VersioningIcon type="minor" />
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
              onClick={() => createNewVersion({ recipeId, type: "patch" })}
            >
              Adjust
              <VersioningIcon type="patch" />
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
}

const VersioningIcon = ({ type }: VersioningIconProps) => {
  switch (type) {
    case "major":
      return (
        <span className="text-sm font-medium text-zinc-400 group flex items-center">
          v
          <span className="text-foreground font-bold block group-hover:hidden">
            1
          </span>
          <span className="text-foreground font-bold hidden group-hover:block">
            2
          </span>
          .0.0
        </span>
      );
    case "minor":
      return (
        <span className="text-sm font-medium text-zinc-400 group flex items-center">
          v1.
          <span className="text-foreground font-bold block group-hover:hidden">
            1
          </span>
          <span className="text-foreground font-bold hidden group-hover:block">
            2
          </span>
          .0
        </span>
      );
    case "patch":
      return (
        <span className="text-sm font-medium text-zinc-400 group flex items-center">
          v 1.0.
          <span className="text-foreground font-bold block group-hover:hidden">
            1
          </span>
          <span className="text-foreground font-bold hidden group-hover:block">
            2
          </span>
        </span>
      );
  }
};
