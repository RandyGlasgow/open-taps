"use client";
import { CreateProjectPlaceholder } from "./components/create-project-placeholder";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  LockIcon,
  MoreHorizontalIcon,
  PlusIcon,
  UnlockIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { Doc } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreateProjectDialog } from "./components/create-project-dialog";
import { checkForPipeAndSplit } from "@/lib/helpers/check-and-split";

export default function Page() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Project</h1>
        <CreateProjectDialog
          trigger={
            <Button size="icon">
              <PlusIcon className="w-4 h-4" />
            </Button>
          }
        />
      </div>

      <ProjectTable />
    </>
  );
}

const ProjectTable = () => {
  const projects = useQuery(api.project.getProjects) || "loading";

  if (projects === "loading") {
    return <Skeleton className="w-full h-full" />;
  }
  const { name, id } = checkForPipeAndSplit(projects[0].slug || "");
  return (
    <Table>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project._id}>
            <TableCell className="group flex flex-col gap-2">
              <Link href={`/dashboard/projects/${project._id}`}>
                <div className="font-bold group-hover:underline flex items-center gap-2 justify-between">
                  <span>{project.name}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-muted-foreground">
                        {project.is_public ? (
                          <UnlockIcon className="h-3 w-3" />
                        ) : (
                          <LockIcon className="h-3 w-3" />
                        )}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <TooltipArrow />
                      {project.is_public ? "Public" : "Private"}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Earum, fugit! Iusto nemo minus ipsa. Quos quis animi quisquam
                  voluptas quasi at, eius tempore incidunt, blanditiis
                  consequuntur corrupti magnam dignissimos debitis beatae? Iure
                  aut adipisci
                </div>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
