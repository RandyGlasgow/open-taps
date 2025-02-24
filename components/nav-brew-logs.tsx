"use client";

import { CreateProjectDialog } from "@/app/dashboard/projects/components/create-project-dialog";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { LinkIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function NavBrewLogs() {
  const projects = useQuery(api.brew_journal.getBrewJournals) || "loading";
  const pathname = usePathname();

  const active = (id: string) => pathname.includes(`/dashboard/projects/${id}`);
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between w-full">
        <Link href="/dashboard/projects" className="hover:underline">
          <SidebarGroupLabel className="text-nowrap">
            Brew Logs
          </SidebarGroupLabel>
        </Link>
        <CreateProjectDialog
          trigger={
            <Button
              size="sm"
              variant="outline"
              className="w-auto px-1 py-1 h-auto"
            >
              <PlusIcon className="h-3" />
            </Button>
          }
        />
      </div>
      <SidebarMenuSub>
        <SidebarMenu>
          {projects === "loading" ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            projects.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex w-full items-center gap-2",
                    active(item._id) && "font-bold",
                  )}
                >
                  <Link href={`/dashboard/projects/${item._id}`}>
                    <LinkIcon className="text-muted-foreground h-2 w-2" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarMenuSub>
    </SidebarGroup>
  );
}
