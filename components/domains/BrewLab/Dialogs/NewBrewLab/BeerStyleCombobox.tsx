"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

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
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
export function BeerStyleCombobox({
  name,
  onChange,
}: {
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const beerStyles = useQuery(api.beer_styles.getBeerStyles);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input
        type="hidden"
        value={
          beerStyles?.find((style) => style.display_name === value)?._id || ""
        }
        onChange={onChange}
        name={name}
      />
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? beerStyles?.find((style) => style.display_name === value)
                ?.display_name
            : "What style are you brewing?"}
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
              🤔 It looks like we don&apos;t have that style yet.
            </CommandEmpty>
            <CommandGroup>
              {beerStyles?.map((style) => (
                <CommandItem
                  key={style._id}
                  value={style.display_name}
                  onSelect={() => {
                    setValue(style.display_name);
                    setOpen(false);
                  }}
                >
                  {style.display_name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === style.display_name
                        ? "opacity-100"
                        : "opacity-0",
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
