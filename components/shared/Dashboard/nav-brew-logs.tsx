"use client";

import { routeTo } from "@/constants/routes";
import { BookMarked, FlaskConicalIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "../../ui/sidebar";

export function NavBrewLogs() {
  const pathname = usePathname();

  const active = (str: string) => pathname.includes(str);
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel
          className="data-[active-path=true]:font-bold"
          data-active-path={active("brewhouse")}
        >
          Brewhouse
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="w-full">
            <Link
              href={routeTo("/dashboard/brew-lab")}
              className="data-[active-path=true]:font-bold"
              data-active-path={active("brewhouse")}
            >
              <SidebarMenuButton>
                <FlaskConicalIcon className="size-4" />
                Brew Lab
              </SidebarMenuButton>
            </Link>
            <Link
              href={routeTo("/dashboard/cellar")}
              className="data-[active-path=true]:font-bold"
              data-active-path={active("cellar")}
            >
              <SidebarMenuButton>
                <BookMarked className="size-4" />
                Cellar
              </SidebarMenuButton>
            </Link>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
