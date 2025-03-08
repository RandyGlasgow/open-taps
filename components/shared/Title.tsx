import { cn } from "@/lib/utils";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

export function Title({
  children,
  className,
}: PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
>) {
  return <h1 className={cn("text-2xl font-bold", className)}>{children}</h1>;
}
