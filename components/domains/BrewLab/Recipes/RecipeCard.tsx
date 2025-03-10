import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Doc } from "@/convex/_generated/dataModel";
import { RecipeVersionContextMenu } from "./RecipeVersionContextMenu";

export const RecipeCard = ({ recipe }: { recipe: Doc<"recipe"> }) => {
  if (!recipe) {
    return null;
  }

  return (
    <RecipeVersionContextMenu recipe={recipe}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {recipe?.name}{" "}
            <Chip>{`v${recipe?.version.major}.${recipe?.version.minor}.${recipe?.version.patch}`}</Chip>
          </CardTitle>
        </CardHeader>
      </Card>
    </RecipeVersionContextMenu>
  );
};
