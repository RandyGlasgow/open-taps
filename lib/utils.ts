import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const consolidateFunctions = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...functions: ((...args: any[]) => void)[]
) => {
  return (...args: unknown[]) => {
    functions.forEach((fn) => fn(...args));
  };
};
