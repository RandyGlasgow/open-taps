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
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

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
        value={beerStyles?.find((style) => style.name === value)?._id || ""}
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
            ? beerStyles?.find((style) => style.name === value)?.name
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
            <CommandGroup heading="Beer Styles">
              {beerStyles?.map((style) => (
                <CommandItem
                  keywords={[style.name, style.category]}
                  key={style._id}
                  value={style.name}
                  onSelect={() => {
                    setValue(style.name);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col gap-1">
                    {style.name}
                    <div className="flex gap-1 text-xs">
                      <span
                        className="rounded-full bg-muted px-2 py-0.5
                        data-[type=ale]:bg-amber-200 data-[type=ale]:text-amber-900
                        data-[type=lager]:bg-blue-200 data-[type=lager]:text-blue-900
                        data-[type=hybrid]:bg-green-200 data-[type=hybrid]:text-green-900 capitalize"
                        data-type={style.category}
                      >
                        {style.category}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                        {style.origin}
                      </span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto",
                      value === style.name ? "opacity-100" : "opacity-0",
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
