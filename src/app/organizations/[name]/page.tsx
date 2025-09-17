
"use client";

import { useParams } from 'next/navigation';
import { topModels, organizationsData } from '@/lib/data';
import { models as allModelsData, type Model } from '@/lib/models-data';
import { Building, Bot, BarChart, HardHat, Package, ChevronDown, Link as LinkIcon, Github, Twitter } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { addDays, format, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
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

const StatCard = ({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string | number }) => (
    <Card>
        <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <div className="bg-primary/10 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
                <p className="text-muted-foreground text-sm">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </CardContent>
    </Card>
);

type TimeFrame = 'weekly' | 'monthly' | '3months' | '6months' | 'yearly' | 'alltime';

const generateChartData = (timeFrame: TimeFrame) => {
    const now = new Date();
    let days;
    switch(timeFrame) {
        case 'weekly': days = 7; break;
        case 'monthly': days = 30; break;
        case '3months': days = 90; break;
        case '6months': days = 180; break;
        case 'alltime': days = 365 * 5; break; // 5 years for all time
        case 'yearly':
        default: days = 365; break;
    }

    return Array.from({ length: days }, (_, i) => {
        const date = addDays(now, i - days + 1);
        return {
            date: format(date, 'yyyy-MM-dd'),
            tokens: Math.floor(Math.random() * 500 + 100 + (i * 2) * (365/days) )
        };
    });
};

const getTicks = (data: { date: string }[], maxTicks = 8) => {
    if (!data || data.length === 0) return [];
    
    const tickCount = Math.min(data.length, maxTicks);
    if (tickCount <= 1) return [data[0]?.date];
    const interval = Math.max(1, Math.floor((data.length -1) / (tickCount -1)));
    
    const ticks = [];
    for (let i = 0; i < data.length; i += interval) {
        ticks.push(data[i].date);
    }
    if (ticks[ticks.length - 1] !== data[data.length - 1].date) {
        if (ticks.length >= maxTicks) {
            ticks[ticks.length -1] = data[data.length - 1].date;
        } else {
            ticks.push(data[data.length - 1].date)
        }
    }
    
    return ticks;
};


export default function OrganizationPage() {
  const params = useParams();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('yearly');

  const organizationName = useMemo(() => {
    const name = params.name as string;
    return name ? decodeURIComponent(name) : '';
  }, [params.name]);


  const orgModels = useMemo(() => {
    return allModelsData.filter(model => model.developer.toLowerCase() === organizationName.toLowerCase());
  }, [organizationName]);

  const orgRankingData = useMemo(() => {
    return topModels.find(model => model.organization.toLowerCase() === organizationName.toLowerCase());
  }, [organizationName]);
  
  const orgSocialData = useMemo(() => {
    return organizationsData.find(org => org.name.toLowerCase() === organizationName.toLowerCase());
  }, [organizationName]);
  
  const topRankedModel = useMemo(() => {
      const orgRankedModels = topModels.filter(m => m.organization.toLowerCase() === organizationName.toLowerCase());
      if (orgRankedModels.length === 0) return 'N/A';
      return orgRankedModels.sort((a,b) => b.tokens - a.tokens)[0].name;
  }, [organizationName]);

  const totalTokens = useMemo(() => {
      const total = orgModels.reduce((acc, model) => {
        const tokenValue = parseFloat(model.tokens);
        if (model.tokens.includes('B')) return acc + tokenValue * 1e9;
        if (model.tokens.includes('M')) return acc + tokenValue * 1e6;
        return acc + tokenValue;
      }, 0);
      if (total > 1e12) return `${(total / 1e12).toFixed(1)}T`;
      if (total > 1e9) return `${(total / 1e9).toFixed(1)}B`;
      if (total > 1e6) return `${(total / 1e6).toFixed(1)}M`;
      return total.toLocaleString();
  }, [orgModels]);

  const chartData = useMemo(() => generateChartData(timeFrame), [timeFrame]);
  const chartTicks = useMemo(() => getTicks(chartData), [chartData]);


  if (!organizationName) {
    return <div>Loading...</div>;
  }
  
  if (!orgRankingData && orgModels.length === 0) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <h1 className="text-2xl font-bold">Organization not found.</h1>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                <Image
                    src={`https://placehold.co/40x40.png`}
                    alt={`${organizationName} logo`}
                    width={40}
                    height={40}
                    className="rounded-lg"
                    data-ai-hint={`${organizationName} logo`}
                />
                <h1 className="text-4xl font-bold">{organizationName.charAt(0).toUpperCase() + organizationName.slice(1)}</h1>
                 <div className="flex items-center gap-2">
                  {orgSocialData?.website && (
                    <Link href={orgSocialData.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon"><LinkIcon className="h-5 w-5 text-muted-foreground" /></Button>
                    </Link>
                  )}
                  {orgSocialData?.github && (
                     <Link href={orgSocialData.github} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon"><Github className="h-5 w-5 text-muted-foreground" /></Button>
                    </Link>
                  )}
                   {orgSocialData?.twitter && (
                     <Link href={orgSocialData.twitter} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon"><Twitter className="h-5 w-5 text-muted-foreground" /></Button>
                    </Link>
                  )}
                </div>
            </div>
        </header>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Total Tokens Generated</h3>
              <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="3months">Past 3 Months</SelectItem>
                  <SelectItem value="6months">Past 6 Months</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="alltime">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    ticks={chartTicks}
                    tickFormatter={(str) => {
                      if (!str) return '';
                      const date = new Date(str);
                       if (differenceInDays(new Date(chartData[chartData.length - 1]?.date), new Date(chartData[0]?.date)) > 365 * 2) {
                        return format(date, 'yyyy');
                      }
                      if (differenceInDays(new Date(chartData[chartData.length - 1]?.date), new Date(chartData[0]?.date)) > 180) {
                        return format(date, 'MMM yy');
                      }
                      return format(date, 'MMM d');
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                     contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                      }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="tokens" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#chartGradient)" activeDot={{ r: 8 }} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard icon={BarChart} title="Total Tokens" value={totalTokens} />
            <StatCard icon={HardHat} title="Top Provider" value={orgRankingData?.provider || 'N/A'} />
            <StatCard icon={Bot} title="Top Model" value={topRankedModel} />
        </div>

        <main>
            <h2 className="text-2xl font-bold mb-6">Models by {organizationName.charAt(0).toUpperCase() + organizationName.slice(1)} ({orgModels.length})</h2>
            {orgModels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {orgModels.map(model => (
                        <ModelCard key={model.name} model={model} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">No models found for this organization in the detailed list.</p>
            )}
        </main>
    </div>
  );
}
