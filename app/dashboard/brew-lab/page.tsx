"use client";

import { DialogNewRecipe } from "@/components/domains/BrewLab/Dialogs/NewBrewLab/DialogNewLab";
import { BrewLabLanding } from "@/components/domains/BrewLab/Landing/Landing";
import { Title } from "@/components/shared/Title";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function Page() {
  return (
    <>
      <Title className="flex justify-between items-center">
        <div>Brew Labs</div>
        <DialogNewRecipe>
          <Button size="sm">
            <PlusIcon className="size-4" />
            New Recipe
          </Button>
        </DialogNewRecipe>
      </Title>
      <BrewLabLanding />
    </>
  );
}
