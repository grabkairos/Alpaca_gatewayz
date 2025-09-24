
"use client";

import { useParams } from 'next/navigation';
import { topModels, organizationsData } from '@/lib/data';
import { models as allModelsData, type Model } from '@/lib/models-data';
import { Building, Bot, BarChart, HardHat, Package, ChevronDown, Link as LinkIcon, Github, Twitter } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import { useModelData } from '@/hooks/useModelData';
import { useModels } from '@/hooks/use-api';
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
    <Card className="p-6 transition-colors">
      <div className="flex items-start mb-2">
        <h3 className="text-xl font-bold text-black">{model.name}</h3>
        <div className="flex gap-2">
          {model.isFree && (
            <Badge className="bg-black text-white px-2 py-1 text-xs">Free</Badge>
          )}
          <Badge 
            variant="outline" 
            className="px-2 py-1 text-xs border-purple-200 bg-purple-50 text-purple-700 ml-2"
          >
            {model.category}
          </Badge>
        </div>
      </div>
      <p className=" text-sm mb-2">{model.description}</p>
      <div className="flex items-center gap-4 text-xs border-t border-gray-200 pt-2">
        <span>By {model.developer}</span>
        <span>{model.tokens} Tokens</span>
        <span>{model.context}K Context</span>
        <span>${model.inputCost}/M Input</span>
        <span>${model.outputCost}/M Output</span>
      </div>
    </Card>
  </Link>
);

const StatCard = ({ title, value }: { title: string, value: string | number }) => (
    <Card className="bg-gray-50 border border-gray-200">
        <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-black mb-1">{value}</div>
            <div className="text-sm text-gray-600">{title}</div>
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

    // Generate data that matches the design pattern with realistic token values
    return Array.from({ length: days }, (_, i) => {
        const date = addDays(now, i - days + 1);
        
        // Create a realistic growth pattern similar to the design
        let baseValue = 400; // Start around 400B
        if (timeFrame === 'monthly') {
            // For monthly view, create a pattern that goes from ~400B to ~2T
            const progress = i / (days - 1);
            baseValue = 400 + (progress * 1600); // 400B to 2000B (2T)
        } else if (timeFrame === 'yearly') {
            // For yearly view, create a pattern that spans from Jul 8, 2024 to Jun 16
            const progress = i / (days - 1);
            baseValue = 400 + (progress * 1600); // Similar pattern
        }
        
        // Add some realistic fluctuation
        const fluctuation = Math.sin(i * 0.3) * 100 + Math.random() * 50;
        
        return {
            date: format(date, 'yyyy-MM-dd'),
            tokens: Math.max(0, baseValue + fluctuation)
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
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('monthly');

  const organizationName = useMemo(() => {
    const name = params.name as string;
    return name ? decodeURIComponent(name) : '';
  }, [params.name]);

  const { modelsData } = useModelData('year', 'All');
  console.log(modelsData,"modelsData");
  const { data: apiModels, loading: modelsLoading, error: modelsError } = useModels();

  console.log(apiModels,"apiModels");
  const orgModels = useMemo(() => {
    console.log(allModelsData,"allModelsData");
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

  const totalValue = useMemo(() => {
      // Calculate total value based on input/output costs and estimated usage
      const total = orgModels.reduce((acc, model) => {
        const inputCost = parseFloat(model.inputCost.toString());
        const outputCost = parseFloat(model.outputCost.toString());
        const tokenValue = parseFloat(model.tokens);
        
        // Estimate value based on token usage and costs
        let estimatedTokens = tokenValue;
        if (model.tokens.includes('B')) estimatedTokens = tokenValue * 1e9;
        if (model.tokens.includes('M')) estimatedTokens = tokenValue * 1e6;
        
        // Rough calculation: assume 70% input, 30% output
        const estimatedValue = (estimatedTokens * 0.7 * inputCost / 1e6) + (estimatedTokens * 0.3 * outputCost / 1e6);
        return acc + estimatedValue;
      }, 0);
      
      if (total > 1e9) return `$${(total / 1e9).toFixed(1)}B`;
      if (total > 1e6) return `$${(total / 1e6).toFixed(1)}M`;
      if (total > 1e3) return `$${(total / 1e3).toFixed(1)}K`;
      return `$${total.toFixed(0)}`;
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
                <img src="/devicon_google.svg" alt={`${organizationName} logo`} className="rounded-lg" />
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
                      <Button variant="ghost" size="icon"><img src="/icon_logo-x.svg" alt="Twitter" className="h-4 w-4 text-muted-foreground" /></Button>
                    </Link>
                  )}
                </div>
            </div>
        </header>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Tokens Generated</h3>
              <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
                <SelectTrigger className="w-[140px] bg-white border border-gray-300 rounded-[12px]">
                  <SelectValue placeholder="Past Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Past Month</SelectItem>
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
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    ticks={chartTicks}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
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
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => {
                      if (value >= 1000) {
                        return `${(value / 1000).toFixed(1)}T`;
                      } else if (value >= 1) {
                        return `${value}B`;
                      }
                      return value.toString();
                    }}
                    domain={[0, 2600]}
                    ticks={[0, 650, 1300, 1950, 2600]}
                  />
                  <Tooltip 
                     contentStyle={{
                        backgroundColor: 'white',
                        borderColor: '#E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value: number) => {
                        if (value >= 1000) {
                          return [`${(value / 1000).toFixed(1)}T`, 'Tokens'];
                        } else if (value >= 1) {
                          return [`${value}B`, 'Tokens'];
                        }
                        return [value.toString(), 'Tokens'];
                      }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tokens" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#chartGradient)" 
                    activeDot={{ r: 6, fill: '#3B82F6' }} 
                    dot={false} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Tokens" value={totalTokens} />
            <StatCard title="Total Value" value={totalValue} />
            <StatCard title="Top Provider" value={orgRankingData?.provider || organizationName} />
            <StatCard title="Top Model" value={topRankedModel} />
        </div>

        <main>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Models By {organizationName.charAt(0).toUpperCase() + organizationName.slice(1)}</h2>
                <span className="text-sm text-gray-500">{orgModels.length} Models</span>
            </div>
            {orgModels.length > 0 ? (
                <div className="space-y-4">
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
