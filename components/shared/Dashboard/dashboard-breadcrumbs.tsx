"use client";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";

export const DashboardBreadcrumb = () => {
  const pathname = usePathname();

  const memo = useMemo(() => {
    return pathname
      .split("/")
      .filter(Boolean)
      .map((part, index, array) => {
        if (index === 0) {
          return null;
        }
        return (
          <Fragment key={part}>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${array.slice(0, index).join("/")}/${part}`}>
                  {part}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        );
      });
  }, [pathname]);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">
            <HomeIcon className="w-4 h-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {memo}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
