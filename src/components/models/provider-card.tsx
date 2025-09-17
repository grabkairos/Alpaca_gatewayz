
"use client";

import { useState } from 'react';
import { providerData, type ProviderInfo } from '@/lib/provider-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronDown, Copy, Globe, Info, Save, Sliders, ExternalLink, Filter } from 'lucide-react';
import Link from 'next/link';

const UptimeIndicator = ({ uptime }: { uptime: number }) => {
    const bars = [
        { color: uptime >= 0.33 ? (uptime >= 0.66 ? 'bg-green-500' : 'bg-yellow-500') : 'bg-red-500', height: 'h-full' },
        { color: uptime >= 0.66 ? 'bg-green-500' : 'bg-yellow-500', height: 'h-2/3' },
        { color: 'bg-green-500', height: 'h-1/3' },
    ].reverse();

    return (
        <div className="flex items-end h-4 w-4 gap-px">
           {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={`w-1 rounded-sm ${uptime > (index / 3) ? (uptime > 0.66 ? 'bg-green-500' : (uptime > 0.33 ? 'bg-yellow-500' : 'bg-red-500')) : 'bg-muted'}`} style={{ height: `${(index + 1) * 33.3}%` }} />
            ))}
        </div>
    );
};

const ProviderCard = ({ provider }: { provider: ProviderInfo }) => {
  return (
    <Card className="p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
        {/* Left side: Provider Info */}
        <div className="flex items-center gap-3">
          <div className="flex-grow">
            <div className="flex items-center gap-2">
                <Link href="#" className="font-semibold hover:underline">{provider.name}</Link>
                <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3" /></Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Button variant="outline" size="sm" className="h-6 px-2 text-xs gap-1">
                <Info className="h-3 w-3" /> US
              </Button>
              <Button variant="outline" size="sm" className="h-6 px-2 text-xs">fp8</Button>
               <Button variant="ghost" size="icon" className="h-6 w-6"><Save className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6"><Info className="h-3 w-3" /></Button>
                 <Button variant="ghost" size="icon" className="h-6 w-6"><Globe className="h-3 w-3" /></Button>
            </div>
          </div>
        </div>

        {/* Right side: Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-x-6 gap-y-2 items-center">
          <div className="text-center md:text-left">
            <p className="text-xs text-muted-foreground">Context</p>
            <p className="font-medium">{provider.context}K</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-muted-foreground">Max Output</p>
            <p className="font-medium">{provider.maxOutput}K</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-muted-foreground">Input</p>
            <p className="font-medium">${provider.inputCost.toFixed(2)}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-muted-foreground">Output</p>
            <p className="font-medium">${provider.outputCost.toFixed(2)}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-muted-foreground">Latency</p>
            <p className="font-medium">{provider.latency ? `${provider.latency.toFixed(2)}s` : '--'}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-muted-foreground">Throughput</p>
            <p className="font-medium">{provider.throughput ? `${provider.throughput.toFixed(2)} tps` : '--'}</p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <UptimeIndicator uptime={provider.uptime} />
          </div>
        </div>
      </div>
    </Card>
  );
};


export const ProvidersDisplay = ({ modelName }: { modelName: string }) => {
    const [showIgnored, setShowIgnored] = useState(false);
    const providers = providerData[modelName] || [];
  
    return (
      <div>
        <div className="flex flex-wrap gap-4 items-center mb-6">
            <Select>
                <SelectTrigger className="w-full sm:w-[200px] h-9">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="Filter quantization" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="fp16">fp16</SelectItem>
                    <SelectItem value="int8">int8</SelectItem>
                    <SelectItem value="int4">int4</SelectItem>
                </SelectContent>
            </Select>
             <Select>
                <SelectTrigger className="w-full sm:w-[180px] h-9">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="latency">Latency</SelectItem>
                    <SelectItem value="throughput">Throughput</SelectItem>
                    <SelectItem value="cost">Cost</SelectItem>
                </SelectContent>
            </Select>
            <div className="flex items-center space-x-2 ml-auto">
                <Label htmlFor="show-ignored">Show ignored</Label>
                <Switch id="show-ignored" checked={showIgnored} onCheckedChange={setShowIgnored} />
            </div>
        </div>

        <div>
            {providers.map(provider => (
                <ProviderCard key={provider.name} provider={provider} />
            ))}
        </div>
      </div>
    );
  };
