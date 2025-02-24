"use client";

import { NavBrewLogs } from "@/components/nav-brew-logs";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Command } from "lucide-react";
import * as React from "react";

// const data = {
//   navMain: [
//     {
//       title: "Projects",
//       url: "/dashboard/projects",
//       icon: FolderIcon,
//       isActive: true,
//       items: [],
//     },
//     // {
//     //   title: "Models",
//     //   url: "#",
//     //   icon: Bot,
//     //   items: [
//     //     {
//     //       title: "Genesis",
//     //       url: "#",
//     //     },
//     //     {
//     //       title: "Explorer",
//     //       url: "#",
//     //     },
//     //     {
//     //       title: "Quantum",
//     //       url: "#",
//     //     },
//     //   ],
//     // },
//     // {
//     //   title: "Documentation",
//     //   url: "#",
//     //   icon: BookOpen,
//     //   items: [
//     //     {
//     //       title: "Introduction",
//     //       url: "#",
//     //     },
//     //     {
//     //       title: "Get Started",
//     //       url: "#",
//     //     },
//     //     {
//     //       title: "Tutorials",
//     //       url: "#",
//     //     },
//     //     {
//     //       title: "Changelog",
//     //       url: "#",
//     //     },
//     //   ],
//     // },
//     // {
//     //   title: "Settings",
//     //   url: "#",
//     //   icon: Settings2,
//     //   items: [
//     //     {
//     //       title: "General",
//     //       url: "#",
//     //     },
//     //     {
//     //       title: "Team",
//     //       url: "#",
//     //     },
//     //     {
//     //       title: "Billing",
//     //       url: "#",
//     //     },
//     //     {
//     //       title: "Limits",
//     //       url: "#",
//     //     },
//     //   ],
//     // },
//   ],
//   navSecondary: [
//     // {
//     //   title: "Support",
//     //   url: "#",
//     //   icon: LifeBuoy,
//     // },
//     // {
//     //   title: "Feedback",
//     //   url: "#",
//     //   icon: Send,
//     // },
//   ],
//   projects: [
//     // {
//     //   name: "Design Engineering",
//     //   url: "#",
//     //   icon: Frame,
//     // },
//     // {
//     //   name: "Sales & Marketing",
//     //   url: "#",
//     //   icon: PieChart,
//     // },
//     // {
//     //   name: "Travel",
//     //   url: "#",
//     //   icon: Map,
//     // },
//   ],
// };

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavBrewLogs />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
