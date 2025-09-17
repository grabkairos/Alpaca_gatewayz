
"use client";

import { useState } from 'react';
import ModelInsightsDashboard from '@/components/dashboard/model-insights-dashboard';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import type { ModelData } from '@/lib/data';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useModelData, type TimeRange } from '@/hooks/useModelData';

const categories: ModelData['category'][] = ['Language', 'Vision', 'Multimodal', 'Audio & Speech Models', 'Code Models', 'Reinforcement Learning', 'Embedding Models', 'Domain-Specific'];

export default function RankingsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ModelData['category'] | 'All'>('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('year');

  const { filteredModels, chartData } = useModelData(selectedTimeRange, selectedCategory);

  const timeRangeLabels: Record<TimeRange, string> = {
    year: 'Top This Year',
    month: 'Top This Month',
    week: 'Top This Week',
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">LLM Rankings</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline-gradient" className="w-full sm:w-[180px] justify-between">
                  {timeRangeLabels[selectedTimeRange]} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuItem onSelect={() => setSelectedTimeRange('year')}>Top This Year</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTimeRange('month')}>Top This Month</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTimeRange('week')}>Top This Week</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline-gradient" className="w-full sm:w-[240px] justify-between">
                  Sort By: {selectedCategory} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-80 overflow-y-auto">
                 <DropdownMenuItem onSelect={() => setSelectedCategory('All')}>
                  All
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onSelect={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <TooltipProvider>
          <ModelInsightsDashboard models={filteredModels} chartData={chartData} timeRange={selectedTimeRange} />
        </TooltipProvider>
      </div>
    </main>
  );
}
