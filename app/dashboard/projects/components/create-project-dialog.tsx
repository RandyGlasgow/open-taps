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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

export function CreateProjectDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const beerStyles = useQuery(api.beer_styles.getBeerStyles) || "loading";
  const postProject = useMutation(api.brew_journal.createBrewJournal);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    console.log(data);

    // verify that the name is not empty
    if (!data.name) {
      console.error("Name is required");
      return;
    }

    postProject({
      description: String(`${data.idea}`),
      name: String(`${data.name}`),
    }).then(() => {
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <TooltipArrow />
          Create a new brew log
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogTitle className="sr-only">Create Brew Project</DialogTitle>
        <DialogHeader>Create Brew Log</DialogHeader>
        <DialogDescription asChild>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Give this project a name"
            />

            <Label htmlFor="beer_style">Style</Label>
            <Select name="beer_style" onValueChange={console.log}>
              <SelectTrigger id="beer_style">
                <SelectValue placeholder="What are you brewing?" />
              </SelectTrigger>
              <SelectContent side="bottom" className="max-h-[250px]">
                {beerStyles === "loading" ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  beerStyles?.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.display_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

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
