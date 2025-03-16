import { cva, VariantProps } from "class-variance-authority";
import { DetailedHTMLProps, HTMLAttributes } from "react";
const classNames = cva(
  "bg-zinc-100 text-zinc-800 rounded-full text-sm w-fit flex items-center gap-2",
  {
    variants: {
      variant: {
        default: "bg-zinc-100 text-zinc-800",
        outline: "bg-transparent border border-zinc-300 text-zinc-800",
        muted: "bg-zinc-200 text-zinc-600",
        primary: "bg-primary text-primary-foreground",
      },
      size: {
        sm: "px-2 py-0.5",
        md: "px-3 py-1",
        lg: "px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);
export const Chip = ({
  children,
  variant,
  size,
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
  VariantProps<typeof classNames>) => {
  return (
    <div className={classNames({ variant, size, className })} {...props}>
      {children}
    </div>
  );
};
