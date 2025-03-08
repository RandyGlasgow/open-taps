import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const RecipeCard = ({ id }: { id: Id<"recipe"> }) => {
  const recipe = useQuery(api.recipe.getById, { id });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {recipe?.name} <Chip>{recipe?.version}</Chip>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
