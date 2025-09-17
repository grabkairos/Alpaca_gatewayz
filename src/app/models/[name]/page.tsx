
"use client";

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { models, type Model } from '@/lib/models-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { addDays, format } from 'date-fns';
import TopAppsTable from '@/components/dashboard/top-apps-table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProvidersDisplay } from '@/components/models/provider-card';
import { Maximize } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { providerData } from '@/lib/provider-data';
import { generateChartData, generateStatsTable } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { stringToColor } from '@/lib/utils';

const Section = ({ title, description, children, className }: { title: string, description?: string, children: React.ReactNode, className?: string }) => (
    <section className={cn("py-8", className)}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
        <div className="mt-6">{children}</div>
    </section>
);

const ChartCard = ({ modelName, title, dataKey, yAxisFormatter }: { modelName: string, title: string; dataKey: "throughput" | "latency"; yAxisFormatter: (value: any) => string; }) => {
    const providers = useMemo(() => providerData[modelName] || [], [modelName]);
    const chartData = useMemo(() => generateChartData(providers, dataKey), [providers, dataKey]);
    const statsTable = useMemo(() => generateStatsTable(providers, dataKey), [providers, dataKey]);
    
    return (
        <Dialog>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium">{title}</CardTitle>
                    <DialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="w-6 h-6">
                            <Maximize className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </DialogTrigger>
                </CardHeader>
                <CardContent>
                     <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <Tooltip
                                    formatter={(value, name) => [`${value}${dataKey === 'latency' ? 's' : ' tps'}`, name]}
                                    labelFormatter={(label) => format(new Date(label), "PPP")}
                                     contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                      }}
                                />
                                {providers.map((p, i) => (
                                     <Line key={p.name} type="monotone" dataKey={p.name} stroke={`hsl(var(--chart-${(i % 5) + 1}))`} dot={false} strokeWidth={2} />
                                ))}
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={false} />
                                <YAxis tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
             <DialogContent className="max-w-4xl h-auto flex flex-col bg-card text-card-foreground">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                     <p className="text-sm text-muted-foreground">Median {title} of the top providers for this model.</p>
                </DialogHeader>
                <div className="flex-grow my-4">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="date" tickFormatter={(label) => format(new Date(label), 'MMM d')} />
                             <YAxis tickFormatter={yAxisFormatter} />
                            <Tooltip
                                formatter={(value, name) => [`${value}${dataKey === 'latency' ? 's' : ' tps'}`, name]}
                                labelFormatter={(label) => format(new Date(label), "PPP")}
                                 contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                  }}
                             />
                            <Legend />
                            {providers.map((p, i) => (
                                <Line key={p.name} type="monotone" dataKey={p.name} stroke={`hsl(var(--chart-${(i % 5) + 1}))`} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Provider</TableHead>
                            <TableHead className="text-right">Min {title}</TableHead>
                            <TableHead className="text-right">Max {title}</TableHead>
                            <TableHead className="text-right">Avg {title}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {statsTable.map(stat => (
                            <TableRow key={stat.provider}>
                                <TableCell className="font-medium">{stat.provider}</TableCell>
                                <TableCell className="text-right">{stat.min.toFixed(2)}{dataKey === 'latency' ? 's' : ' tps'}</TableCell>
                                <TableCell className="text-right">{stat.max.toFixed(2)}{dataKey === 'latency' ? 's' : ' tps'}</TableCell>
                                <TableCell className="text-right">{stat.avg.toFixed(2)}{dataKey === 'latency' ? 's' : ' tps'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )
}

export default function ModelProfilePage() {
    const params = useParams();
    const modelName = useMemo(() => {
        const name = params.name as string;
        return name ? decodeURIComponent(name) : '';
    }, [params.name]);

    const model = useMemo(() => {
        return models.find(m => m.name === modelName);
    }, [modelName]);
    
    const relatedModels = useMemo(() => {
      if(!model) return [];
      return models.filter(m => m.developer === model.developer && m.name !== model.name).slice(0,3);
    }, [model])


    if (!model) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <h1 className="text-2xl font-bold">Model not found.</h1>
            </div>
        );
    }

    return (
      <TooltipProvider>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-screen-2xl">
            <header className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{model.name}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" style={{ backgroundColor: stringToColor(model.category) }}>{model.category}</Badge>
                            <Badge variant="outline" style={{ backgroundColor: stringToColor(model.series) }}>{model.series}</Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button>Chat</Button>
                        <Button variant="outline">Compare</Button>
                    </div>
                </div>
                 <div className="mt-4 text-muted-foreground">
                    <p>{model.description}</p>
                    <Link href="#" className="text-primary hover:underline mt-2 inline-block">Paper &rarr;</Link>
                </div>
            </header>

            <nav className="border-b">
                <div className="flex gap-6">
                    {['Overview', 'Providers', 'Apps', 'Activity', 'Uptime', 'API'].map(item => (
                        <Button key={item} variant="ghost" className="rounded-none border-b-2 border-transparent hover:border-primary data-[active]:border-primary data-[active]:text-primary">
                            {item}
                        </Button>
                    ))}
                </div>
            </nav>

            <main>
                <Section 
                  title={`Providers for ${model.name}`}
                  description="OpenRouter routes requests to the best providers that are able to handle your prompt size and parameters, with fallbacks to maximize uptime."
                  className="pt-8 pb-0"
                >
                    <ProvidersDisplay modelName={model.name} />
                </Section>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <ChartCard 
                        modelName={model.name}
                        title="Throughput"
                        dataKey="throughput"
                        yAxisFormatter={(value) => `${value} tps`}
                    />
                     <ChartCard 
                        modelName={model.name}
                        title="Latency"
                        dataKey="latency"
                        yAxisFormatter={(value) => `${value}s`}
                    />
                </div>
                
                <TopAppsTable />

                <Section title={`Uptime from our API and our providers`}>
                    <Card>
                        <CardContent className="h-[200px] p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={generateChartData([], 'throughput').slice(0,30)}>
                                    <Tooltip 
                                        formatter={(value) => [value, "Uptime"]}
                                    />
                                    <Area type="monotone" dataKey="value" strokeWidth={2} stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2) / 0.1)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Section>

                <Section title="Is My Data Private?">
                    <p className="text-muted-foreground">Yes, your data is private by default. See our <Link href="#" className="text-primary hover:underline">privacy policy</Link>.</p>
                </Section>

                <Section title={`More models from ${model.developer}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedModels.map(relatedModel => (
                            <Link key={relatedModel.name} href={`/models/${encodeURIComponent(relatedModel.name)}`}>
                                <Card className="hover:border-primary h-full">
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold">{relatedModel.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-2 truncate">{relatedModel.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </Section>
            </main>
        </div>
        </TooltipProvider>
    );
}

    
