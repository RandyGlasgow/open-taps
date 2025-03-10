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

export const pickFromObject = <
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  obj: T,
  keys: K[],
) => {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>,
  );
};

export const omitFromObject = <
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  obj: T,
  keys: K[],
) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (!keys.includes(key as K)) {
        // @ts-expect-error - this is safe because we know the key is not in the keys array
        acc[key as keyof T] = obj[key as keyof T];
      }
      return acc;
    },
    {} as Omit<T, K>,
  );
};
