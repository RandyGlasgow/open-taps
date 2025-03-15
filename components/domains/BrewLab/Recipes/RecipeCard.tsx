import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { RecipeVersionContextMenu } from "./RecipeVersionContextMenu";

export const RecipeCard = ({ recipe }: { recipe: Doc<"recipe"> }) => {
  if (!recipe) {
    return null;
  }

  return (
    <RecipeVersionContextMenu recipe={recipe}>
      <Link
        href={`/dashboard/brew-lab/${recipe.brew_lab_id}/recipes/${recipe._id}`}
      >
        <Card className="flex-shrink-0">
          <CardHeader className="text-nowrap">
            <CardTitle className="flex items-center gap-2">
              {recipe?.name}{" "}
              <Chip>{`v${recipe?.version.major}.${recipe?.version.minor}.${recipe?.version.patch}`}</Chip>
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
    </RecipeVersionContextMenu>
  );
};
