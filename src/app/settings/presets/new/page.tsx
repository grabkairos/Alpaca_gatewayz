
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChevronLeft, Info, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { models, type Model } from "@/lib/models-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

const ParameterInput = ({ label, description, includeSwitch = true }: { label: string, description: string, includeSwitch?: boolean }) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <Label htmlFor={label.toLowerCase().replace(' ', '-')}>{label}</Label>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <div className="flex items-center gap-4">
                {includeSwitch && <Switch id={label.toLowerCase().replace(' ', '-')} />}
                <Input type="number" className="w-24" placeholder="1.00" />
            </div>
        </div>
    )
}

const modelGroups = models.reduce((groups, model) => {
    const category = model.series;
    if (!groups[category]) {
        groups[category] = [];
    }
    groups[category].push(model);
    return groups;
}, {} as Record<string, Model[]>);

export default function NewPresetPage() {
    const [providerPrefs, setProviderPrefs] = useState(false);
    const [selectedModels, setSelectedModels] = useState<Model[]>([]);
    const [open, setOpen] = useState(false);

    const handleModelSelect = (model: Model) => {
        setSelectedModels(prev => 
            prev.find(m => m.name === model.name)
                ? prev.filter(m => m.name !== model.name)
                : [...prev, model]
        );
    };


  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                 <Link href="/settings/presets">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">New Preset</h1>
            </div>
            <Button>Save Preset</Button>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Info</CardTitle>
                    <CardDescription>Give your preset a name and description for identification and organization.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                        <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" />
                    </div>
                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" />
                    </div>
                        <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>System Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea placeholder="Enter system prompt..." />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Models</CardTitle>
                    <CardDescription>Specify which model of this preset is for and OpenRouter will use it automatically. If multiple models are selected, then all will be billable.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-2">
                     <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                             <Button variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Model
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
                                                    key={model.name}
                                                    value={model.name}
                                                    onSelect={() => handleModelSelect(model)}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span>{model.name}</span>
                                                    <Checkbox
                                                        checked={selectedModels.some(m => m.name === model.name)}
                                                        className="mr-2"
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    ))}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {selectedModels.map(model => (
                        <Badge key={model.name} variant="secondary" className="flex items-center gap-1">
                            {model.name}
                            <button onClick={() => handleModelSelect(model)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Provider Routing</CardTitle>
                    <CardDescription>Configure and order routing and extensions for allowed providers, fallbacks, etc.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-2">
                        <Switch id="provider-prefs" checked={providerPrefs} onCheckedChange={setProviderPrefs} />
                        <Label htmlFor="provider-prefs">Include Provider Preferences</Label>
                    </div>
                    
                    {providerPrefs && (
                    <div className="space-y-4">
                        <ProviderRoutingSection title="Allow Fallback" description="Whether to allow fallback to problem to solve is not in a certain - Yes, No, Auto" />
                        <ProviderRoutingSection title="Regular" description="Whether to filter providers to only those that support The parameters that are provided." />
                        <ProviderRoutingSection title="Data Continuation" description="Data continuation setting. If an available model is required for results, the request will use an..." />

                        <div>
                            <Label>Order</Label>
                            <p className="text-sm text-muted-foreground mb-2">An ordered list of providers to use. The router will attempt to use the first provider in the list. If this list is unsupported, your request will not be routed to any model. If no providers are available, your request will fail with an error message.</p>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="openai">OpenAI</SelectItem>
                                    <SelectItem value="google">Google</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                    <CardDescription>Generation default parameters.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ParameterInput label="Temperature" description="Controls the randomness of the output. Lower values are more deterministic." />
                    <ParameterInput label="Top P" description="Nucleus sampling. Considers the tokens with the highest probability mass." />
                    <ParameterInput label="Top K" description="Limits the next token selection from a pool of K most likely tokens." />
                    <ParameterInput label="Max Tokens" description="Maximum number of tokens in the generated output." includeSwitch={false} />
                    <ParameterInput label="Frequency Penalty" description="Reduces repetition of tokens that have already appeared in the text so far." />
                    <ParameterInput label="Presence Penalty" description="Reduces repetition based on whether tokens appear in the text so far." />
                    <ParameterInput label="Repetition Penalty" description="Penalizes repetition. Values > 1 discourage repetition, 1 is neutral." />
                    <ParameterInput label="Min P" description="Minimum probability for a token to be considered." />
                    <ParameterInput label="Top A" description="Selects from the smallest set of tokens whose cumulative probability exceeds P." />
                    <ParameterInput label="Seed" description="Random seed for deterministic outputs (when supported)." includeSwitch={false}/>
                    
                    <div>
                        <Label>Stop Sequences</Label>
                            <p className="text-xs text-muted-foreground mb-2">Sequences where the model will stop generating further tokens.</p>
                            <Input placeholder="Enter stop sequences"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}


const ProviderRoutingSection = ({title, description}: {title: string, description: string}) => (
    <div>
        <Label className="flex items-center gap-1">{title} <Info className="h-3 w-3 text-muted-foreground"/></Label>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="flex gap-4">
            <div className="flex items-center space-x-2">
                <Checkbox id={`${title}-yes`} />
                <Label htmlFor={`${title}-yes`} className="font-normal">Yes</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id={`${title}-no`} />
                <Label htmlFor={`${title}-no`} className="font-normal">No</Label>
            </div>
        </div>
    </div>
)

    