"use client";

import * as React from "react";
import { ChevronsUpDown, Check, PlusCircle } from "lucide-react";

import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@ui/components/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/dialog";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/popover";

type Publication = {
  label: string;
  value: string;
};

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface PublicationSwitcherProps extends PopoverTriggerProps {
  publications: Publication[];
}

export default function PublicationSwitcher({
  className,
  publications,
}: PublicationSwitcherProps) {
  const groups = [
    {
      label: "Publications",
      Publications: publications,
    },
  ];

  const [open, setOpen] = React.useState(false);
  const [showNewPublicationDialog, setShowNewPublicationDialog] =
    React.useState(publications.length === 0);
  const [selectedPublication, setSelectedPublication] = React.useState<
    Publication | undefined
  >(groups[0].Publications[0]);

  return (
    <Dialog
      open={showNewPublicationDialog}
      onOpenChange={setShowNewPublicationDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a Publication"
            className={cn("w-[275px] justify-between", className)}
          >
            {selectedPublication?.label}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[275px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No Publication found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.Publications.map((Publication) => (
                    <CommandItem
                      key={Publication.value}
                      onSelect={() => {
                        setSelectedPublication(Publication);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      {Publication.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedPublication.value === Publication.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewPublicationDialog(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Publication
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent disableClose={publications.length === 0}>
        <form action={"/api/publication"} method={"POST"}>
          <DialogHeader>
            <DialogTitle>Add Publication</DialogTitle>
            <DialogDescription>
              Add a new Hashnode publication to get started! You can create a
              API key here:{" "}
              <a
                className="hover:text-blue-600 hover:underline underline-offset-4"
                href="https://hashnode.com/settings/developer"
              >
                https://hashnode.com/settings/developer
              </a>
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="host">Publication Host</Label>
                <Input
                  id="host"
                  name="host"
                  placeholder="code42cate.hashnode.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api_key">API Key</Label>
                <Input
                  id="api_key"
                  name="api_key"
                  placeholder="****"
                  type="password"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            {publications.length > 0 && (
              <Button
                type="submit"
                variant="outline"
                onClick={() => setShowNewPublicationDialog(false)}
              >
                Cancel
              </Button>
            )}
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
