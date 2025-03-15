import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { createPortal } from "react-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";

const PORTAL_ID = "portal-to-breadcrumbs";
export const DashboardBreadcrumb = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList id={PORTAL_ID}>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">
            <HomeIcon className="w-4 h-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

type BreadcrumbBuilderType = {
  alias: string;
  pathname: string;
};

export const InjectBreadcrumbs = ({
  pathname,
  loading = false,
}: {
  pathname: BreadcrumbBuilderType[];
  loading?: boolean;
}) => {
  if (loading) {
    return null;
  }
  const portal = document.getElementById(PORTAL_ID);
  if (portal) {
    return createPortal(
      pathname.map((breadcrumb) => (
        <Fragment key={breadcrumb.pathname}>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={breadcrumb.pathname}>{breadcrumb.alias}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Fragment>
      )),
      portal,
    );
  }
};
