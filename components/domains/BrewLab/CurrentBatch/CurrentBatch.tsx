import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

export const CurrentBatch = () => {
  const { id } = useParams<{ id: Id<"brew_lab"> }>();
  const brewLab = useQuery(api.brew_lab.getBrewLab, { id });
  return <pre>{JSON.stringify(brewLab, null, 2)}</pre>;
};
