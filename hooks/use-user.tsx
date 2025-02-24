import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export const useUser = () => useQuery(api.user.getUser) || "loading";
