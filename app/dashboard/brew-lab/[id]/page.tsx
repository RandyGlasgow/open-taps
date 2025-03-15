"use client";
import { CurrentBatch } from "@/components/domains/BrewLab/CurrentBatch/CurrentBatch";
import { DialogUpdateLab } from "@/components/domains/BrewLab/Dialogs/UpdateBrewLab/DialogUpdateLab";
import { GraphArea } from "@/components/domains/BrewLab/Graph/GraphArea";
import { Recipes } from "@/components/domains/BrewLab/Recipes/Recipes";
import { InjectBreadcrumbs } from "@/components/shared/Dashboard/dashboard-breadcrumbs";
import { Title } from "@/components/shared/Title";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import "@xyflow/react/dist/style.css";
import { useQuery } from "convex/react";
import { FileStack, FileText, Network, StarIcon } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const DEFAULT_TAB = "current-batch";

export default function Page() {
  const { id } = useParams<{ id: Id<"brew_lab"> }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const brewLab = useQuery(api.brew_lab.getBrewLab, { id }) || "loading";

  return (
    <>
      <InjectBreadcrumbs
        pathname={[{ alias: "Brew Lab", pathname: `/dashboard/brew-lab/` }]}
      />
      <Tabs
        value={searchParams.get("tab") || DEFAULT_TAB}
        className="h-full relative"
        onValueChange={(value) =>
          router.replace(`/dashboard/brew-lab/${id}?tab=${value}`)
        }
      >
        <div
          className="flex justify-between items-center sticky top-0 bg-background"
          id="tabs-container"
        >
          {brewLab === "loading" ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <div className="flex justify-between items-center gap-2">
              <Title>{brewLab.name}</Title>
              <DialogUpdateLab brewLab={brewLab} />
            </div>
          )}
          <TabsList className="flex justify-between items-center">
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
        <TabsContent value="graph" className="h-full">
          <GraphArea id={id} />
        </TabsContent>
        <TabsContent value="notes">
          <div className="w-full h-full rounded-md border-dashed border border-gray-300">
            <div>Notes</div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
