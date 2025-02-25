"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-bold">Recipe Trees</h1>
      <ProjectTable />
    </>
  );
}

const ProjectTable = () => {
  const recipeTrees = useQuery(api.recipe.getAllRecipeTrees) || "loading";

  if (recipeTrees === "loading") {
    return <Skeleton className="w-full h-full" />;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipeTrees.map((recipeTree) => (
        <Link
          href={`/dashboard/recipes/${recipeTree._id}`}
          key={recipeTree._id}
        >
          <Card>
            <CardHeader>
              <CardTitle>{recipeTree.name}</CardTitle>
              <CardDescription>{recipeTree.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
};
