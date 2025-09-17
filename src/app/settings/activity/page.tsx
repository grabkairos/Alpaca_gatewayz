
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Filter, Info, Maximize, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: addDays(new Date(), -29 + i).toISOString().slice(0, 10),
  spend: Math.floor(Math.random() * 20 + 5),
  tokens: Math.floor(Math.random() * 50000 + 10000),
  requests: Math.floor(Math.random() * 100 + 20),
}));

const activityLog = Array.from({ length: 7 }, (_, i) => ({
  timestamp: addDays(new Date(), -i).toLocaleString(),
  provider: "OpenAI",
  model: "GPT-4o",
  app: "API",
  tokens: Math.floor(Math.random() * 1000),
  cost: (Math.random() * 0.1).toFixed(5),
  speed: (Math.random() * 100 + 20).toFixed(2),
  finish: "stop",
}));

const ActivityChart = ({ dataKey, title, value, currency = false }: { dataKey: "spend" | "tokens" | "requests", title: string, value: string, currency?: boolean }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Maximize className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{currency && '$'}{value}</div>
      <div className="h-[120px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
              labelFormatter={(label) => format(new Date(label), "PPP")}
            />
            <Area type="monotone" dataKey={dataKey} stroke="hsl(var(--primary))" fillOpacity={1} fill={`url(#color${dataKey})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default function ActivityPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -29),
    to: new Date(),
  });

  const totalSpend = chartData.reduce((acc, item) => acc + item.spend, 0).toFixed(2);
  const totalTokens = chartData.reduce((acc, item) => acc + item.tokens, 0).toLocaleString();
  const totalRequests = chartData.reduce((acc, item) => acc + item.requests, 0).toLocaleString();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-bold">Your Activity</h1>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
                <RefreshCw className="h-5 w-5" />
            </Button>
        </div>
        <p className="text-muted-foreground">
          See how you&apos;ve been using models on OpenRouter. Privacy <Info className="inline h-4 w-4" />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ActivityChart dataKey="spend" title="Spend" value={totalSpend} currency />
        <ActivityChart dataKey="tokens" title="Tokens" value={totalTokens} />
        <ActivityChart dataKey="requests" title="Requests" value={totalRequests} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">From:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? format(date.from, "LLL dd, y") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <span className="text-sm">To:</span>
           <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-to"
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !date?.to && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.to ? format(date.to, "LLL dd, y") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filters</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Provider / Model</TableHead>
                <TableHead>App</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Speed (T/s)</TableHead>
                <TableHead className="text-right">Finish Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLog.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.provider} / {log.model}</TableCell>
                  <TableCell>{log.app}</TableCell>
                  <TableCell className="text-right">{log.tokens}</TableCell>
                  <TableCell className="text-right">${log.cost}</TableCell>
                  <TableCell className="text-right">{log.speed}</TableCell>
                  <TableCell className="text-right">{log.finish}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-center items-center gap-2 mt-4">
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">1</Button>
        <Button variant="outline" size="icon" disabled>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
