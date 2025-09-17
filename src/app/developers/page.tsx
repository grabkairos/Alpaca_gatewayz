
"use client"

import { useMemo, useState } from 'react';
import { models, type Model } from "@/lib/models-data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Search, ArrowRight, Package, BarChart, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type Organization = {
    name: string;
    models: Model[];
    totalTokens: string;
    topModel: string;
    performanceChange: number; // For trending sort
}

const OrganizationCard = ({ org }: { org: Organization }) => (
    <Card className="flex flex-col">
        <CardContent className="p-6 pb-2 flex-grow">
            <div className="flex items-center gap-4 mb-4">
                <Image 
                    src={`https://placehold.co/48x48.png`}
                    alt={`${org.name} logo`}
                    width={48}
                    height={48}
                    className="rounded-lg"
                    data-ai-hint={`${org.name} logo`}
                />
                <h3 className="text-xl font-bold">{org.name}</h3>
            </div>
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{org.models.length} Models</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <BarChart className="w-4 h-4" />
                    <span>{org.totalTokens} Tokens</span>
                </div>
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Bot className="w-4 h-4" />
                    <span className="truncate">Top Model: {org.topModel}</span>
                </div>
            </div>
        </CardContent>
        <CardFooter className="p-6 pt-4">
             <Link href={`/organizations/${encodeURIComponent(org.name)}`} className="w-full">
                <Button variant="outline" className="w-full">
                    View Profile <ArrowRight className="ml-2" />
                </Button>
            </Link>
        </CardFooter>
    </Card>
);


export default function DevelopersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'top' | 'trending'>('top');
    const [timeFrame, setTimeFrame] = useState<'month' | 'week' | 'today'>('month');

    const timeFrameLabels: Record<typeof timeFrame, string> = {
        month: 'Past Month',
        week: 'Past Week',
        today: 'Today',
    };

    const organizations: Organization[] = useMemo(() => {
        const orgMap = new Map<string, Model[]>();

        models.forEach(model => {
            if (!orgMap.has(model.developer)) {
                orgMap.set(model.developer, []);
            }
            orgMap.get(model.developer)!.push(model);
        });

        const timeMultiplier = {
            month: 1,
            week: 1/4,
            today: 1/30,
        };
        const volatility = {
            month: 1,
            week: 1.5,
            today: 3,
        };
        
        const parseTokens = (tokenStr: string) => {
            const num = parseFloat(tokenStr);
            if (tokenStr.includes('B')) return num * 1e9;
            if (tokenStr.includes('M')) return num * 1e6;
            return num;
        };

        const orgArray = Array.from(orgMap.entries()).map(([name, orgModels]) => {

            const total = orgModels.reduce((acc, model) => acc + parseTokens(model.tokens), 0);
            const adjustedTotal = total * timeMultiplier[timeFrame] * (1 + (Math.random() - 0.5) * 0.1);
            
            let totalTokensFormatted: string;
            if (adjustedTotal >= 1e9) totalTokensFormatted = `${(adjustedTotal / 1e9).toFixed(1)}B`;
            else if (adjustedTotal >= 1e6) totalTokensFormatted = `${(adjustedTotal / 1e6).toFixed(1)}M`;
            else totalTokensFormatted = adjustedTotal.toLocaleString();

            const topModel = orgModels.sort((a,b) => parseTokens(b.tokens) - parseTokens(a.tokens))[0]?.name || 'N/A';
            
            // Fake performance change for trending sort
            const performanceChange = (Math.random() - 0.3) * 20 * volatility[timeFrame];

            return {
                name,
                models: orgModels,
                totalTokens: totalTokensFormatted,
                topModel,
                performanceChange,
            };
        });

        return orgArray;

    }, [timeFrame]);

    const filteredOrgs = useMemo(() => {
        const parseTokens = (tokenStr: string) => {
            const num = parseFloat(tokenStr);
            if (tokenStr.includes('B')) return num * 1e9;
            if (tokenStr.includes('M')) return num * 1e6;
            return num;
        };

        const sorted = organizations.sort((a,b) => {
            if (activeTab === 'trending') {
                return b.performanceChange - a.performanceChange;
            }
            // Default to top models
            return parseTokens(b.totalTokens) - a.totalTokens;
        });

        return sorted.filter(org => 
            org.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [organizations, searchTerm, activeTab]);


    return (
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Developers</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Discover the organizations building the future of AI.
                </p>
            </header>
            
            <div className="max-w-xl mx-auto mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filter developers..."
                        className="pl-9 bg-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <Button 
                        variant={activeTab === 'top' ? 'secondary' : 'ghost'} 
                        onClick={() => setActiveTab('top')}
                    >
                        Top Models
                    </Button>
                    <Button 
                        variant={activeTab === 'trending' ? 'secondary' : 'ghost'}
                        onClick={() => setActiveTab('trending')}
                    >
                        Trending
                    </Button>
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-[160px] justify-between">
                        {timeFrameLabels[timeFrame]} <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                        <DropdownMenuItem onSelect={() => setTimeFrame('month')}>Past Month</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeFrame('week')}>Past Week</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTimeFrame('today')}>Today</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <main>
                {filteredOrgs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredOrgs.map(org => (
                            <OrganizationCard key={org.name} org={org} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground mt-12">No developers found.</p>
                )}
            </main>
        </div>
    );
}
