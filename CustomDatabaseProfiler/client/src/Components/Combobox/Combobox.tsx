import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@shadcn-ui/lib/utils";
import { Button } from "@shadcn-ui/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@shadcn-ui/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn-ui/components/ui/popover";
import { GradientBorderWrapper } from "../GradientBorderWrapper/GradientBorderWrapper";

const storageEngines = [
    {
        value: "LSM-Tree",
        label: "LSM-Tree",
    },
    {
        value: "SSTable",
        label: "SSTable",
    },
];

export type ComboboxProps = {
    onChange?: (value: string) => void;
};

export const Combobox: React.FC<ComboboxProps> = ({ onChange }) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    return (
        <GradientBorderWrapper className="w-fit">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="min-w-[100px] justify-center text-lg text-ellipsis"
                    >
                        {value
                            ? storageEngines.find((framework) => framework.value === value)?.label
                            : "Select A Storage Engine"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search storage engine..." />
                        <CommandList>
                            <CommandEmpty>No Storage Engine found.</CommandEmpty>
                            <CommandGroup>
                                {storageEngines.map((storageEngines) => (
                                    <CommandItem
                                        key={storageEngines.value}
                                        value={storageEngines.value}
                                        onSelect={(currentValue) => {
                                            const selectedValue = currentValue === value ? "" : currentValue;
                                            setValue(currentValue === value ? "" : currentValue);
                                            onChange?.(selectedValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === storageEngines.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {storageEngines.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </GradientBorderWrapper>
    );
}
