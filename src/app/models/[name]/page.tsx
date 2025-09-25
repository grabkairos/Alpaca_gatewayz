
"use client";

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { models, type Model } from '@/lib/models-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { stringToColor } from '@/lib/utils';
import { ChevronDown, Github } from 'lucide-react';
import { LinkIcon } from 'lucide-react';

const Section = ({ title, description, children, className }: { title: string, description?: string, children: React.ReactNode, className?: string }) => (
    <section className={cn("py-8", className)}>
        <div className="flex items-center gap-2">
            <h2 className="text-2xl flex-1 font-bold">{title}</h2>
            {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
        <div className="mt-6">{children}</div>
    </section>
);

// Generate mock activity data for the chart
const generateActivityData = () => {
    const data = [];
    const startDate = new Date('2024-06-08');
    const endDate = new Date('2024-07-16');
    
    // Generate data points for specific dates shown in the design
    const keyDates = [
        '2024-07-08', '2024-08-26', '2024-10-14', '2024-12-02', 
        '2025-01-20', '2025-03-10', '2025-04-28', '2025-06-16'
    ];
    
    // Generate data for all days between start and end
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        
        // Create realistic usage patterns with peaks and valleys
        let basePromptTokens = 800000000000; // Base around 800B
        let baseCompletionTokens = 200000000000; // Base around 200B
        
        // Add variation based on day of week and some randomness
        const dayOfWeek = d.getDay();
        const randomFactor = Math.random() * 0.6 + 0.7; // 0.7 to 1.3
        
        // Weekend effect
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            basePromptTokens *= 0.8;
            baseCompletionTokens *= 0.8;
        }
        
        // Add some peaks for specific periods
        if (keyDates.includes(dateStr)) {
            basePromptTokens *= 1.4; // Peak periods
            baseCompletionTokens *= 1.4;
        }
        
        data.push({
            date: dateStr,
            promptTokens: Math.floor(basePromptTokens * randomFactor),
            completionTokens: Math.floor(baseCompletionTokens * randomFactor),
        });
    }
    
    return data;
};

// Generate mock top apps data
const generateTopAppsData = () => {
    return Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: "Autonomous Coding Agent That Is...",
        tokensGenerated: "21.7B",
        weeklyGrowth: "+13.06%",
        logo: "G" // Google logo placeholder
    }));
};

export default function ModelProfilePage() {
    const params = useParams();
    const modelName = useMemo(() => {
        const name = params.name as string;
        return name ? decodeURIComponent(name) : '';
    }, [params.name]);

    const model = useMemo(() => {
        return models.find(m => m.name === modelName);
    }, [modelName]);

    const activityData = useMemo(() => generateActivityData(), []);
    const topAppsData = useMemo(() => generateTopAppsData(), []);

    if (!model) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <h1 className="text-2xl font-bold">Model not found.</h1>
            </div>
        );
    }
    console.log(model,"model123123123123");
    return (
        <TooltipProvider>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-screen-2xl">
                {/* Header Section */}
                <header className="mb-8 mt-7">
                    <div className="flex flex-wrap items-centergap-4">
                        <div className="flex-1  justify-between ">
                            <h1 className="text-3xl font-bold">{model.name}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm ">Created Apr 14, 2025 | By <a href={`/developers/${model.developer}`} className="text-blue-500 hover:underline">{model.developer}</a></span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="bg-black text-white px-2 py-1 text-sm">Free</Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800 px-2 py-1 text-sm">Multi-Lingual</Badge>
                                </div>
                            </div>
                            
                        </div>
                        <div className="flex items-top gap-2">
                            <Button>Chat</Button>
                            <Button>Create API Key</Button>
                        </div>
                    </div>
                    <div className="mt-4 ">
                        <p>{model.description}</p>
                    </div>
                </header>

                <main>
                    {/* Providers Section */}
                    <Section 
                        title={`Providers for ${model.name}`}
                        description="2 Providers"
                        className="pt-8 pb-0"
                    >
                        <div className="space-y-4">
                            {[1, 2].map((_, index) => (
                                <Card key={index} className="px-4 py-2">
                                    <div className="grid grid-cols-24 gap-6 items-center">
                                        {/* Left Section - Provider Info */}
                                        <div className="col-span-6">
                                            <div className="flex flex-col items-start gap-1">
                                                <div className="flex items-center gap-2">
                                                    <img src="/devicon_google.svg" alt="OpenAI" className="w-4 h-4" />
                                                    <h3 className="font-semibold text-lg">OpenAI</h3>
                                                </div>
                                                <div className="flex gap-1 mt-1">
                                                    <Link href="/" target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                                                            <LinkIcon className="h-6 w-6 text-muted-foreground" />
                                                        </Button>
                                                    </Link>
                                                    <Link href="/" target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                                                            <Github className="h-6 w-6 text-muted-foreground" />
                                                        </Button>
                                                    </Link>
                                                    <Link href="/" target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                                                            <img src="/icon_logo-x.svg" alt="Twitter" className="h-4 w-4 text-muted-foreground" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Middle Section - Metrics` */}
                                        <div className="col-span-2 text-right">
                                            <div className="text-lg ">Tokens</div>
                                            <div className="text-lg ">170,02m</div>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <div className="text-lg ">Value</div>
                                            <div className="text-lg ">$10.35m</div>
                                        </div>
                                        <div className="col-span-3 text-right">
                                            <div className="text-lg ">Max Output</div>
                                            <div className="text-lg ">4096k</div>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <div className="text-lg ">Input</div>
                                            <div className="text-lg ">$0.15</div>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <div className="text-lg ">Output</div>
                                            <div className="text-lg ">$0.60</div>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <div className="text-lg ">Latency</div>
                                            <div className="text-lg ">0.49s</div>
                                        </div>
                                        <div className="col-span-3 text-right">
                                            <div className="text-lg ">Throughput</div>
                                            <div className="text-lg ">24.99 Tps</div>
                                        </div>
                                        
                                        {/* Right Section - Status Indicator */}
                                        <div className="col-span-2 flex items-center justify-end">
                                           <img src="/ant-design_signal-filled.svg" alt="Online" className="w-9 h-9" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Section>

                    {/* Recent Activity Section */}
                    <Section title={`Recent Activity Of ${model.name}`} className="pt-16">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Total usage per day on Gatewayz</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis 
                                                dataKey="date" 
                                                tickFormatter={(value) => format(new Date(value), 'MMM d')}
                                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                                tickLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <YAxis 
                                                tickFormatter={(value) => {
                                                    if (value >= 1000000000000) return `${(value / 1000000000000).toFixed(1)}T`;
                                                    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                                                    return value.toString();
                                                }}
                                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                                tickLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <Tooltip 
                                                formatter={(value: any, name: any) => [
                                                    name === 'promptTokens' ? `${(Number(value) / 1000000000000).toFixed(1)}T` : `${(Number(value) / 1000000000000).toFixed(1)}T`,
                                                    name === 'promptTokens' ? 'Prompt Tokens' : 'Completion Tokens'
                                                ]}
                                                labelFormatter={(label) => format(new Date(label), "PPP")}
                                                contentStyle={{
                                                    backgroundColor: 'white',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '6px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Legend 
                                                wrapperStyle={{ paddingTop: '20px' }}
                                                iconType="rect"
                                            />
                                            <Bar dataKey="promptTokens" stackId="a" fill="#3b82f6" name="Prompt Tokens" />
                                            <Bar dataKey="completionTokens" stackId="a" fill="#9ca3af" name="Completion Tokens" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </Section>

                    {/* Top Apps Section */}
                    <Section title={``}>
                        <div className="grid grid-cols-24 gap-4 items-center mb-8">
                            <div className="col-span-12">
                                <h2 className="text-2xl font-bold">Top Apps Using {model.name}</h2>
                            </div>
                            <div className="col-span-12">
                                <div className="flex gap-4 justify-end">
                                    <Button variant="outline" className="w-[140px] justify-between">
                                        Top This Year <ChevronDown className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" className="w-[120px] justify-between">
                                        Sort By: All <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Apps Grid */}
                        <div className="grid grid-cols-24 gap-6">
                            {topAppsData.map((app) => (
                                <Card key={app.id} className="p-6 col-span-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center">
                                                <img src="/devicon_google.svg" alt="Google" className="w-12 h-12 rounded-full" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">Google</h3>
                                                <p className="text-sm text-gray-500">Google • AI Assistant</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-2xl font-bold">{app.tokensGenerated}</p>
                                                <p className="text-sm text-gray-500">Tokens Generated</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-green-500">
                                                    {app.weeklyGrowth}
                                                </p>
                                                <p className="text-sm text-gray-500">Weekly Growth</p>
                                            </div>
                                        </div>
                                        
                                        <Button variant="outline" className="w-full">
                                            View App →
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                           
                        </div>
                        <div className='flex justify-center items-center mt-6'>
                                <Button variant="outline">Load More</Button>
                        </div>
                    </Section>
                </main>
            </div>
        </TooltipProvider>
    );
}

    
