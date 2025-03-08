"use client";
import { CurrentBatch } from "@/components/domains/BrewLab/CurrentBatch/CurrentBatch";
import { Recipes } from "@/components/domains/BrewLab/Recipes/Recipes";
import { Title } from "@/components/shared/Title";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useQuery } from "convex/react";
import { FileStack, FileText, Network, StarIcon } from "lucide-react";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: Id<"brew_lab"> }>();

  const brewLab = useQuery(api.brew_lab.getBrewLab, { id }) || "loading";

  return (
    <Tabs defaultValue="current-batch">
      <div className="flex justify-between items-center">
        {brewLab === "loading" ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <Title>{brewLab.name}</Title>
        )}
        <TabsList>
          <TabsTrigger
            value="current-batch"
            className="flex gap-2 items-center"
          >
            Current Batch
            <StarIcon className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex gap-2 items-center">
            Recipes <FileStack className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="graph" className="flex gap-2 items-center">
            Graph <Network className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex gap-2 items-center">
            Notes <FileText className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="current-batch">
        <CurrentBatch />
      </TabsContent>
      <TabsContent value="recipes" className="h-full">
        <Recipes brewLabId={id} />
      </TabsContent>
      <TabsContent value="graph">
        <div className="w-full h-full rounded-md border-dashed border border-gray-300">
          <ReactFlowProvider>
            <></>
            {/* {graph !== "loading" && <GraphDisplay graph={graph} />} */}
          </ReactFlowProvider>
        </div>
      </TabsContent>
      <TabsContent value="notes">
        <div className="w-full h-full rounded-md border-dashed border border-gray-300">
          <div>Notes</div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
