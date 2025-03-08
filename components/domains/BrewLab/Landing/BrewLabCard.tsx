import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Doc } from "@/convex/_generated/dataModel";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { EllipsisVerticalIcon, Star } from "lucide-react";
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

  return (
    <Card
      className="w-full hover:cursor-pointer"
      role="link"
      onClick={navigateToBrewLabIfNotInDropdown}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 flex items-center gap-2">
            {brewLab.name}
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
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <CardDescription
              className="line-clamp-1"
              title={brewLab.description}
            >
              {brewLab.description || "No description"}
            </CardDescription>
          </TooltipTrigger>
          {brewLab.description && (
            <TooltipContent>
              <TooltipArrow />
              {brewLab.description}
            </TooltipContent>
          )}
        </Tooltip>
      </CardHeader>
    </Card>
  );
};
