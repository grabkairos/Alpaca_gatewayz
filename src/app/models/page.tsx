
"use client"

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { models, type Model } from "@/lib/models-data";
import { BookText, Bot, ChevronDown, ChevronUp, Code, FileText, ImageIcon, LayoutGrid, LayoutList, Search, Sliders as SlidersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { stringToColor } from '@/lib/utils';

const ModelCard = ({ model }: { model: Model }) => (
  <Link href={`/models/${encodeURIComponent(model.name)}`}>
    <Card className="p-6 flex flex-col h-full hover:border-primary">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {model.name} {model.isFree && <Badge>Free</Badge>}
          </h3>
          <Badge variant="outline" className="mt-2" style={{ backgroundColor: stringToColor(model.category) }}>{model.category}</Badge>
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">{model.tokens}</div>
      </div>
      <p className="text-muted-foreground mt-4 text-sm flex-grow">{model.description}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-4 border-t">
        <span>by {model.developer}</span>
        <span>{model.context}K context</span>
        <span>${model.inputCost}/M input</span>
        <span>${model.outputCost}/M output</span>
      </div>
    </Card>
  </Link>
);

export default function ModelsPage() {
  const [layout, setLayout] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  const [contextLength, setContextLength] = useState(64);
  const [promptPricing, setPromptPricing] = useState(0.5);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('tokens-desc');

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (value: string, checked: boolean) => {
    setter(prev => checked ? [...prev, value] : prev.filter(v => v !== value));
  };
  
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedModalities([]);
    setContextLength(64);
    setPromptPricing(0.5);
    setSelectedSeries([]);
    setSelectedCategories([]);
    setSelectedParameters([]);
    setSelectedProviders([]);
    setSortBy('tokens-desc');
  };

  const filteredModels = useMemo(() => {
    let sortedModels = [...models];

    const parseTokens = (tokenStr: string) => {
      const num = parseFloat(tokenStr);
      if (tokenStr.includes('B')) return num * 1e9;
      if (tokenStr.includes('M')) return num * 1e6;
      return num;
    }

    sortedModels.sort((a, b) => {
        switch (sortBy) {
            case 'tokens-desc':
                return parseTokens(b.tokens) - parseTokens(a.tokens);
            case 'tokens-asc':
                return parseTokens(a.tokens) - parseTokens(b.tokens);
            case 'price-desc':
                return (b.inputCost + b.outputCost) - (a.inputCost + a.outputCost);
            case 'price-asc':
                return (a.inputCost + a.outputCost) - (b.inputCost + b.outputCost);
            default:
                return 0;
        }
    });

    return sortedModels.filter((model) => {
      const searchTermMatch =
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const modalityMatch = selectedModalities.length === 0 || selectedModalities.every(m => model.modalities.includes(m));
      const contextMatch = model.context >= contextLength;
      const priceMatch = (model.inputCost + model.outputCost) / 2 <= promptPricing || model.isFree;
      const seriesMatch = selectedSeries.length === 0 || selectedSeries.includes(model.series);
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(model.category);
      const parameterMatch = selectedParameters.length === 0 || selectedParameters.every(p => model.supportedParameters.includes(p));
      const providerMatch = selectedProviders.length === 0 || selectedProviders.includes(model.developer);

      return searchTermMatch && modalityMatch && contextMatch && priceMatch && seriesMatch && categoryMatch && parameterMatch && providerMatch;
    });
  }, [searchTerm, selectedModalities, contextLength, promptPricing, selectedSeries, selectedCategories, selectedParameters, selectedProviders, sortBy]);

  const allSeries = useMemo(() => Array.from(new Set(models.map(m => m.series))), []);
  const allCategories = useMemo(() => Array.from(new Set(models.map(m => m.category))), []);
  const allParameters = useMemo(() => Array.from(new Set(models.flatMap(m => m.supportedParameters))), []);
  const allProviders = useMemo(() => Array.from(new Set(models.map(m => m.developer))), []);


  return (
    <SidebarProvider>
      <div className="relative flex h-[calc(100vh-theme(spacing.14))]">
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="hidden lg:flex"
        >
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel>Input Modalities</SidebarGroupLabel>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="text-modal" checked={selectedModalities.includes('Text')} onCheckedChange={(c) => handleCheckboxChange(setSelectedModalities)('Text', !!c)} />
                  <Label htmlFor="text-modal" className="flex items-center gap-2 font-normal"><BookText className="w-4 h-4"/>Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="image-modal" checked={selectedModalities.includes('Image')} onCheckedChange={(c) => handleCheckboxChange(setSelectedModalities)('Image', !!c)} />
                  <Label htmlFor="image-modal" className="flex items-center gap-2 font-normal"><ImageIcon className="w-4 h-4"/>Image</Label>
                </div>
                  <div className="flex items-center space-x-2">
                  <Checkbox id="file-modal" checked={selectedModalities.includes('File')} onCheckedChange={(c) => handleCheckboxChange(setSelectedModalities)('File', !!c)} />
                  <Label htmlFor="file-modal" className="flex items-center gap-2 font-normal"><FileText className="w-4 h-4"/>File</Label>
                </div>
              </div>
            </SidebarGroup>

            <FilterSlider label="Context Length" value={contextLength} onValueChange={setContextLength} min={4} max={1024} step={4} unit="K" />
            <FilterSlider label="Prompt Pricing" value={promptPricing} onValueChange={setPromptPricing} min={0} max={10} step={0.1} unit="$" />

            <FilterDropdown 
              label="Series" 
              items={allSeries} 
              selectedItems={selectedSeries} 
              onSelectionChange={handleCheckboxChange(setSelectedSeries)}
              icon={<Bot className="w-4 h-4"/>} 
            />
            <FilterDropdown 
              label="Categories" 
              items={allCategories} 
              selectedItems={selectedCategories} 
              onSelectionChange={handleCheckboxChange(setSelectedCategories)}
              icon={<Code className="w-4 h-4"/>} 
            />
            <FilterDropdown 
              label="Supported Parameters" 
              items={allParameters} 
              selectedItems={selectedParameters} 
              onSelectionChange={handleCheckboxChange(setSelectedParameters)}
              icon={<SlidersIcon className="w-4 h-4"/>} 
            />
            <FilterDropdown 
              label="Providers" 
              items={allProviders} 
              selectedItems={selectedProviders} 
              onSelectionChange={handleCheckboxChange(setSelectedProviders)}
              icon={<ChevronUp className="w-4 h-4"/>} 
            />
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                  <SidebarTrigger className="lg:hidden" />
                  <h1 className="text-2xl font-bold">Models</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{filteredModels.length} models</span>
                <Button variant="ghost" onClick={resetFilters}>Reset Filters</Button>
              </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Filter models"
                  className="pl-9 bg-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="tokens-desc">Tokens (High to Low)</SelectItem>
                  <SelectItem value="tokens-asc">Tokens (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              </SelectContent>
              </Select>
              <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
              <Button
                  variant={layout === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setLayout('grid')}
              >
                  <LayoutGrid className="w-5 h-5" />
              </Button>
              <Button
                  variant={layout === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setLayout('list')}
              >
                  <LayoutList className="w-5 h-5" />
              </Button>
              </div>
          </div>

          <div
              className={
              layout === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'
                  : 'flex flex-col gap-6'
              }
          >
              {filteredModels.map((model) => (
              <ModelCard key={model.name} model={model} />
              ))}
          </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

const FilterSlider = ({ label, value, onValueChange, min, max, step, unit }: { label: string, value: number, onValueChange: (value: number) => void, min: number, max: number, step: number, unit: string }) => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <Slider defaultValue={[value]} min={min} max={max} step={step} onValueChange={(v) => onValueChange(v[0])} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{min}{unit}</span>
                <span>{value}{unit}</span>
                <span>{max}{unit}+</span>
            </div>
        </SidebarGroup>
    );
};

const FilterDropdown = ({ label, items, icon, selectedItems, onSelectionChange }: { label: string, items: string[], icon: React.ReactNode, selectedItems: string[], onSelectionChange: (value: string, checked: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const displayedItems = items.slice(0, 3);
  const moreItems = items.slice(3);

  return (
    <SidebarGroup>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full">
        <SidebarGroupLabel className="flex justify-between items-center cursor-pointer">
            <span className="flex items-center gap-2">{icon} {label}</span>
            {isOpen ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
        </SidebarGroupLabel>
      </button>
      {isOpen && (
        <div className="flex flex-col gap-2 mt-2">
          {displayedItems.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox id={item.toLowerCase()} checked={selectedItems.includes(item)} onCheckedChange={(c) => onSelectionChange(item, !!c)} />
              <Label htmlFor={item.toLowerCase()} className="font-normal">{item}</Label>
            </div>
          ))}
          {moreItems.length > 0 && <Label className="font-normal text-muted-foreground">More...</Label>}
        </div>
      )}
    </SidebarGroup>
  );
};
