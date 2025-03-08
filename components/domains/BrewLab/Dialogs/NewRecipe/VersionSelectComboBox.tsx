"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

export function VersionSelectComboBox({
  brewLabId,
  onSelect,
}: {
  brewLabId: Id<"brew_lab">;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const recipes = useQuery(api.recipe.getAllRecipesByBrewLabId, { brewLabId });
  const versions = recipes?.map((recipe) => recipe.version);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? versions?.find((version) => version === value)
            : "What version are you brewing?"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: buttonRef.current?.offsetWidth }}
        onWheel={(e) => e.stopPropagation()}
      >
        <Command onValueChange={setValue}>
          <CommandInput placeholder="Search for a style..." />
          <CommandList>
            <CommandEmpty>
              🤔 It looks like we don&apos;t have that version yet.
            </CommandEmpty>
            <CommandGroup>
              {versions?.map((version) => (
                <CommandItem
                  key={version}
                  value={version}
                  onSelect={() => {
                    setValue(version);
                    setOpen(false);
                    onSelect(version);
                  }}
                >
                  {version}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === version ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
