import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRoute } from "@/constants/routes";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { EllipsisVerticalIcon, File, Star } from "lucide-react";
import { useRef } from "react";

export const BrewLabCard = ({ brewLab }: { brewLab: Doc<"brew_lab"> }) => {
  const router = useRoute();
  const refToElement = useRef<HTMLDivElement>(null);

  const navigateToBrewLabIfNotInDropdown: React.MouseEventHandler = (event) => {
    if (refToElement.current?.contains(event.target as Node)) {
      return;
    }
    router.push(`/dashboard/brew-lab/${brewLab._id}`);
  };
  const deleteBrewLab = useMutation(api.brew_lab.deleteBrewLab);

  return (
    <Card
      className="w-full hover:cursor-pointer"
      role="link"
      onClick={navigateToBrewLabIfNotInDropdown}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div>{brewLab.name}</div>
              {brewLab.associated_recipes?.length && (
                <Chip variant="outline">
                  <File className="size-3" />
                  {brewLab.associated_recipes?.length}
                </Chip>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Star className="w-4 h-4 text-yellow-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add to your cellar</TooltipContent>
            </Tooltip>
          </CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <EllipsisVerticalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent ref={refToElement}>
              <DropdownMenuItem>Add to Cellar</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteBrewLab({ id: brewLab._id })}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-1" title={brewLab.description}>
          {brewLab.description || "No description"}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
