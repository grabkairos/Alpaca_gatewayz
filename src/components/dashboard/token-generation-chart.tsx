
"use client";

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import type { ModelData } from '@/lib/data';
import { format, getMonth } from 'date-fns';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TokenGenerationChartProps {
  models: ModelData[];
  chartData: any[];
  timeRange: 'year' | 'month' | 'week';
}

export default function TokenGenerationChart({ models, chartData: rawChartData, timeRange }: TokenGenerationChartProps) {
    const top10Models = models.slice(0, 10);
    const otherModels = models.slice(10, 20);

    const chartData = rawChartData.map(dataPoint => {
        const newDataPoint = { ...dataPoint };
        
        let othersTotal = 0;
        otherModels.forEach(model => {
            if (newDataPoint[model.name]) {
                othersTotal += newDataPoint[model.name];
                delete newDataPoint[model.name];
            }
        });
        
        newDataPoint['Others'] = othersTotal;
        return newDataPoint;
    });


    const chartConfig = top10Models.reduce((acc, model, index) => {
        acc[model.name] = {
            label: model.name,
            color: `hsl(var(--chart-${(index % 11) + 1}))`,
        };
        return acc;
    }, {} as ChartConfig);

    chartConfig['Others'] = {
        label: 'Others',
        color: 'hsl(var(--muted-foreground))',
    };
  
  const yAxisFormatter = (value: number) => {
    if (value >= 1000) return `${value / 1000}T`;
    if (value > 0) return `${value}B`;
    return '0';
  };

  const xAxisFormatter = (value: string) => {
    const date = new Date(value);
    if (timeRange === 'year') {
        const month = getMonth(date);
        if (month % 2 === 0) { // Show every other month
            return format(date, 'MMM');
        }
        return "";
    }
    if (timeRange === 'month') {
        return format(date, 'd');
    }
    if (timeRange === 'week') {
        return format(date, 'EEE');
    }
    return value;
  };
  
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Tokens Generated</CardTitle>
        <CardDescription>Unit: Trillions of Tokens</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="h-[450px] w-full">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 10, bottom: 60, left: 0 }}
            accessibilityLayer
            barCategoryGap="5%"
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={xAxisFormatter}
              interval={timeRange === 'year' ? 'preserveStartEnd' : 0}
              tick={{ dy: 10 }}
            />
            <YAxis 
              tickFormatter={yAxisFormatter}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[0, (dataMax: number) => Math.ceil(dataMax / 500) * 500]}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Legend 
              content={({ payload }) => (
                <ScrollArea className="w-full whitespace-nowrap absolute -bottom-14">
                  <div className="flex justify-center items-center gap-x-4 gap-y-2 pb-4 px-4">
                    {payload?.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-muted-foreground">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" className="invisible" />
                </ScrollArea>
              )}
            />
            {Object.keys(chartConfig).map(modelName => (
              <Bar 
                key={modelName}
                dataKey={modelName} 
                stackId="a" 
                fill={chartConfig[modelName]?.color ? `var(--color-${modelName})` : `hsl(var(--chart-${(Math.floor(Math.random() * 11) + 1)}))`}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
