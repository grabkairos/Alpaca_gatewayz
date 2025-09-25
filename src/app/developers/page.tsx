
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
    id: string;
    name: string;
    models: Model[];
    totalTokens: string;
    topModel: string;
    performanceChange: number; // For trending sort
}

const OrganizationCard = ({ org }: { org: Organization }) => (
    <Card className="flex flex-col bg-card border border-gray-400 rounded-lg">
        <CardContent className="p-6 pb-2 flex-grow">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12  rounded-full flex items-center justify-center">
                    <img src={"/devicon_google.svg"} alt={org.name} className="w-12 h-12 rounded-full" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">{org.name}</h3>
                    <p className="text-sm ">4 Models</p>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold">21.7B</p>
                        <p className="text-xs ">Tokens Generated</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-green-600">+13.06%</p>
                        <p className="text-xs ">Weekly Growth</p>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="p-6 pt-4">
             <Link href={`/organizations/${encodeURIComponent(org.name)}`} className="w-full">
                <Button variant="outline" className="w-full bg-white border border-gray-400">
                    View Profile <ArrowRight className="ml-2 h-4 w-4" />
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
        // Create 8 Google cards to match the design
        const googleCards = Array.from({ length: 8 }, (_, index) => ({
            id: `google-${index}`,
            name: "Google",
            models: models.filter(m => m.developer === "Google").slice(0, 4),
            totalTokens: "21.7B",
            topModel: "Gemini Pro",
            performanceChange: 13.06,
        }));

        return googleCards;

    }, [timeFrame]);

    const filteredOrgs = useMemo(() => {
        return organizations.filter(org => 
            org.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [organizations, searchTerm, activeTab]);


    return (
        <div className="min-h-[calc(100vh-130px)] bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Developers</h1>
                    <p className="mt-2 text-lg ">
                        Discover The Organisations Building The Future Of AI
                    </p>
                </header>
                
                <div className="max-w-xl mx-auto mb-6">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search Organisation..."
                            className="pr-9 bg-white border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <Button 
                            variant={activeTab === 'top' ? 'default' : 'ghost'} 
                            onClick={() => setActiveTab('top')}
                            className={activeTab === 'top' ? 'bg-gray-100 text-foreground' : ''}
                        >
                            Top Developers
                        </Button>
                        <Button 
                            variant={activeTab === 'trending' ? 'default' : 'ghost'}
                            onClick={() => setActiveTab('trending')}
                            className={activeTab === 'trending' ? 'bg-gray-100 text-foreground' : ''}
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
                      <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredOrgs.map(org => (
                                <OrganizationCard key={org.id} org={org} />
                            ))}
                        
                        </div>
                        <div className='flex justify-center items-center mt-6'>
                        <Button variant="outline">Load More</Button>
                        </div>
                    </div>
                    ) : (
                        <p className="text-center text-muted-foreground mt-12">No developers found.</p>
                    )}
                </main>
            </div>
        </div>
    );
}
