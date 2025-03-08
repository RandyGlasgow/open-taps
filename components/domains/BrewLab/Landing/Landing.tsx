import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { BrewLabCardGroup } from "./BrewLabCardGroup";

const groupBrewLabs = (brewLabs: Doc<"brew_lab">[]) => {
  const groupedBrewLabs = brewLabs.reduce(
    (acc, brewLab) => {
      const brewType = brewLab.style || "Uncategorized";
      if (!acc[brewType]) {
        acc[brewType] = [];
      }
      acc[brewType].push(brewLab);
      return acc;
    },
    {} as Record<string, Doc<"brew_lab">[]>,
  );

  return groupedBrewLabs;
};

export const BrewLabLanding = () => {
  const brewLabs = useQuery(api.brew_lab.getBrewLabList) || [];

  const groupedBrewLabs = groupBrewLabs(brewLabs);
  console.log(groupedBrewLabs);

  return Object.entries(groupedBrewLabs).map(([brewType, brewLabs]) => (
    <BrewLabCardGroup key={brewType} brewLab={brewLabs} />
  ));
};
