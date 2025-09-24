
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { models } from "@/lib/models-data"

export type ModelOption = {
    value: string;
    label: string;
    category: string;
};

export const allModels: ModelOption[] = models.map(model => ({
    value: model.name.toLowerCase(),
    label: model.name,
    category: model.series
}));

const modelGroups = allModels.reduce((groups, model) => {
    const category = model.category;
    if (!groups[category]) {
        groups[category] = [];
    }
    groups[category].push(model);
    return groups;
}, {} as Record<string, typeof allModels>);


interface ModelSelectProps {
    selectedModel: ModelOption | null;
    onSelectModel: (model: ModelOption | null) => void;
}

export function ModelSelect({ selectedModel, onSelectModel }: ModelSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between  bg-muted/30 hover:bg-muted/50"
        >
          {selectedModel
            ? selectedModel.label
            : "Select model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search model..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            {Object.entries(modelGroups).map(([groupName, groupModels]) => (
                <CommandGroup key={groupName} heading={groupName}>
                    {groupModels.map((model) => (
                    <CommandItem
                        key={model.value}
                        value={model.value}
                        onSelect={(currentValue) => {
                            const selected = allModels.find(m => m.value === currentValue);
                            onSelectModel(selected || null);
                            setOpen(false);
                        }}
                    >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            selectedModel?.value === model.value ? "opacity-100" : "opacity-0"
                        )}
                        />
                        {model.label}
                    </CommandItem>
                    ))}
                </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
