"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { PropsWithChildren, useState } from "react";
import { BeerStyleCombobox } from "./BeerStyleCombobox";
export function DialogNewRecipe({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  const postProject = useMutation(api.brew_lab.createBrewLab);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    console.log({ data });

    // verify that the name is not empty
    if (!data.name) {
      console.error("Name is required");
      return;
    }

    const recipeTreeId = await postProject({
      description: String(`${data.idea}`),
      style: String(data.style) as Id<"beer_style_catalog">,
      name: String(`${data.name}`),
    });

    if (recipeTreeId) {
      router.push(`/dashboard/brew-lab/${recipeTreeId}`);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{children}</DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <TooltipArrow />
          Create a new brew log
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Brew Project</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Give this project a name"
            />

            <Label htmlFor="style">Style</Label>
            <BeerStyleCombobox name="style" />

            <Label htmlFor="idea">Description</Label>
            <Textarea
              id="idea"
              name="idea"
              placeholder="What's the idea?"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="hover:animate-pulse">
                Let&apos;s brew!
              </Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
