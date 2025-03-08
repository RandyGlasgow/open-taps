import { Chip } from "@/components/ui/chip";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { BrewLabCard } from "./BrewLabCard";

export const BrewLabCardGroup = ({
  brewLab,
}: {
  brewLab: Doc<"brew_lab">[];
}) => {
  const style = useQuery(api.beer_styles.getBeerStyleById, {
    id: brewLab[0]?.style as Id<"beer_style_catalog">,
  });
  return (
    <div key={brewLab[0]._id} className="relative">
      <div className="sticky top-0 z-10 bg-background text-zinc-500 font-semibold text-sm py-2 border-b border-zinc-200 mb-2 flex items-center gap-2">
        {style?.display_name}
        <Chip variant="default">{brewLab.length}</Chip>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-1 pb-2.5">
        {brewLab.map((brewLab) => (
          <BrewLabCard key={brewLab._id} brewLab={brewLab} />
        ))}
      </div>
    </div>
  );
};
