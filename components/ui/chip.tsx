import { cva, VariantProps } from "class-variance-authority";
import { DetailedHTMLProps, HTMLAttributes } from "react";
const classNames = cva(
  "bg-zinc-100 text-zinc-800 px-2 py-1 rounded-full text-sm w-fit",
  {
    variants: {
      variant: {
        default: "bg-zinc-100 text-zinc-800",
      },
    },
  },
);
export const Chip = ({
  children,
  variant,
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
  VariantProps<typeof classNames>) => {
  return (
    <div className={classNames({ variant, className })} {...props}>
      {children}
    </div>
  );
};
