import { useRouter } from "next/navigation";

export const knownRoutes = {
  home: "/",
  signIn: "/signin",
  signUp: "/signup",
  dashboard: "/dashboard",
  cellar: "/dashboard/cellar",
  brewLab: "/dashboard/brew-lab",
  afterSignIn: "/dashboard/after-signin",
} as const;

type KnownRoutes = (typeof knownRoutes)[keyof typeof knownRoutes];
type RouteWithId = `${KnownRoutes}/${string}`;

type ReturnOfUseRouter = Omit<ReturnType<typeof useRouter>, "push"> & {
  push: (path: RouteWithId | KnownRoutes) => void;
};
export const useRoute = () => useRouter() as ReturnOfUseRouter;
export const routeTo = (route: KnownRoutes | RouteWithId) => {
  return route;
};
