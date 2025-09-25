"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import TokenStackedBarChart from '@/components/TokenStackedBarChart';
import { CreditBalance } from '@/components/dashboard/credit-balance';
import { useModelData } from '@/hooks/useModelData';
import { LoadingSpinner, TableLoading } from '@/components/ui/loading';

export default function RankingsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Top This Year');
  const [selectedSort, setSelectedSort] = useState('All');
  const [selectedTopCount, setSelectedTopCount] = useState('Top 10');

  // Use real model data from API
  const { filteredModels, loading, error } = useModelData('year', 'All');

  // Transform API data to match the rankings table format
  const topModels = useMemo(() => {
    console.log(filteredModels,"filteredModels")
    return filteredModels.map((model, index) => ({
      rank: index + 1,
      change: Math.floor(Math.random() * 6) - 3, // Random position change
      model: model.name,
      org: model.organization,
      category: model.category,
      provider: model.provider,
      tokens: `${model.tokens.toFixed(1)}B`,
      value: model.value,
      changePercent: `${model.change > 0 ? '+' : ''}${model.change.toFixed(1)}%`,
    }));
  }, [filteredModels]);

  // Helper function to parse token values
  const parseTokens = (tokenStr: string): number => {
    const num = parseFloat(tokenStr.replace(/[BMK]/g, ''));
    if (tokenStr.includes('B')) return num * 1e9;
    if (tokenStr.includes('M')) return num * 1e6;
    if (tokenStr.includes('K')) return num * 1e3;
    return num;
  };

  // Helper function to parse value strings
  const parseValue = (valueStr: string): number => {
    const num = parseFloat(valueStr.replace(/[$BMK]/g, ''));
    if (valueStr.includes('B')) return num * 1e9;
    if (valueStr.includes('M')) return num * 1e6;
    if (valueStr.includes('K')) return num * 1e3;
    return num;
  };

  // Filter and sort the models based on selected options
  const filteredAndSortedModels = useMemo(() => {

    console.log(topModels,"topModels")
    let filtered = [...topModels];

    // Apply time range filter (this would need to be implemented based on your API)
    if (selectedTimeRange === 'Top This Month') {
      // Filter for monthly data
    } else if (selectedTimeRange === 'Top This Week') {
      // Filter for weekly data
    }

    // Apply sorting
    if (selectedSort === 'Tokens') {
      filtered.sort((a, b) => {
        const aTokens = parseTokens(a.tokens);
        const bTokens = parseTokens(b.tokens);
        return bTokens - aTokens;
      });
    } else if (selectedSort === 'Value') {
      filtered.sort((a, b) => {
        const aValue = parseValue(a.value);
        const bValue = parseValue(b.value);
        return bValue - aValue;
      });
    } else {
      // Default sort by rank
      filtered.sort((a, b) => a.rank - b.rank);
    }

    // Apply top count filter
    const count = parseInt(selectedTopCount.replace('Top ', ''));
    return filtered.slice(0, count);
  }, [selectedTimeRange, selectedSort, selectedTopCount, topModels]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">LLM Rankings</h1>
          <p className="mt-2 text-lg ">
            Discover The Current Rankings For The Best Models On The Market
          </p>
        </header>

        {/* Credit Balance
        <div className="mb-8">
          <CreditBalance />
        </div> */}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-lg text-muted-foreground">Loading model rankings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <p className="text-lg font-semibold">Failed to load rankings</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {/* Content - only show when not loading and no error */}
        {!loading && !error && (
          <>
         {/* Chart Section */}
         <div className="mb-12">
           <Card className="p-6">
             <div className="mb-4">
               <h2 className="text-2xl font-bold">Token Generation Trends</h2>
               <p className="text-muted-foreground">Track the performance of top models over time</p>
             </div>
             <TokenStackedBarChart />
           </Card>
         </div>

          {/* Controls */}
          <div className="mb-8">
            <div className="grid grid-cols-24 gap-4 items-center">
              <div className="col-span-6">
                <h1 className="text-2xl font-bold">Top 10 models</h1>
              </div>
              <div className="col-span-18">
                <div className="flex gap-4 justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-[140px] justify-between">
                        {selectedTimeRange} <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setSelectedTimeRange('Top This Year')}>Top This Year</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSelectedTimeRange('Top This Month')}>Top This Month</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSelectedTimeRange('Top This Week')}>Top This Week</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-[120px] justify-between">
                        {selectedSort} <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setSelectedSort('All')}>All</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSelectedSort('Tokens')}>Tokens</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSelectedSort('Value')}>Value</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-[120px] justify-between">
                        {selectedTopCount} <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setSelectedTopCount('Top 10')}>Top 10</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSelectedTopCount('Top 25')}>Top 25</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSelectedTopCount('Top 50')}>Top 50</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSelectedTopCount('All')}>All</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          {/* Rankings Table */}
          <div className="space-y-4">
            <Card className="p-6 py-2 border border-gray-200">
              <div className="grid grid-cols-24 gap-4 items-center">
                {/* Rank Column - 2 columns */}
                <div className="col-span-2">
                    <span className="text-sm  ">Rank</span>
                </div>

                {/* Model Info Column - 8 columns */}
                <div className="col-span-5">
                    <span className="text-sm">AI Model</span>
                </div>
                {/* Model Info Column - 8 columns */}
                <div className="col-span-3">
                    <span className="text-sm ">Model Org</span>
                </div>
                {/* Provider Column - 3 columns */}
                <div className="col-span-3 text-center">
                  <p className="text-sm text-start">Category</p>
                </div>
                {/* Provider Column - 3 columns */}
                <div className="col-span-3 text-center">
                  <p className="text-sm text-start">Top Provider</p>
                </div>

                {/* Tokens Column - 3 columns */}
                <div className="col-span-3 text-center">
                  <p className="text-sm text-end">Tokens Generated</p>
                </div>

                {/* Value Column - 3 columns */}
                <div className="col-span-3 text-center">
                  <p className="text-sm text-end">Value</p>
                </div>

                {/* Growth Column - 2 columns */}
                <div className="col-span-2 text-center">
                  <p className="text-sm text-end">Change</p>
                </div>
              </div>
            </Card>
            {filteredAndSortedModels.map((model) => (
              <Card key={model.rank} className="p-6 py-2 border border-gray-200">
                <div className="grid grid-cols-24 gap-4 items-center">
                  {/* Rank Column - 2 columns */}
                  <div className="col-span-2">
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-muted-foreground">#{model.rank}</span>
                      <div className="flex items-center space-x-1">
                        {model.change > 0 ? (
                          <ArrowUp className="w-4 h-4 text-green-500" />
                        ) : model.change < 0 ? (
                          <ArrowDown className="w-4 h-4 text-red-500" />
                        ) : null}
                        <span className={`text-sm font-medium ${model.change > 0 ? 'text-green-500' : model.change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {model.change > 0 ? '+' : ''}{model.change}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Model Info Column - 8 columns */}
                   <div className="col-span-5">
                     <div className="flex items-center space-x-3">
                       <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                         <img src="/deepseek_1.png" alt={model.model} className="w-16 h-16 rounded-full" />
                       </div>
                       <div className="flex flex-col items-start justify-center">
                         <h3 className="text-sm">{model.model}</h3>
                       </div>
                     </div>
                   </div>

                   {/* Provider Column - 3 columns */}
                  <div className="col-span-3 text-center">
                    <p className="text-start">{model.org}</p>
                  </div>
                  {/* Provider Column - 3 columns */}
                  <div className="col-span-3 text-center">
                    <p className="text-start">{model.category}</p>
                  </div>     
                  {/* Provider Column - 3 columns */}
                  <div className="col-span-3 text-center">
                    <p className="text-start">{model.provider}</p>
                  </div>

                  {/* Tokens Column - 3 columns */}
                  <div className="col-span-3 text-center">
                    <p className="text-end">{model.tokens}</p>
                  </div>

                  {/* Value Column - 3 columns */}
                  <div className="col-span-3 text-center">
                    <p className="text-end">{model.value}</p>
                  </div>

                  {/* Growth Column - 2 columns */}
                  <div className="col-span-2 text-center">
                    <p className={`text-end ${model.changePercent.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {model.changePercent}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

         {/* Top 20 Apps Section */}
         <div className="mt-16">
           <div className="grid grid-cols-24 gap-4 items-center mb-8">
             <div className="col-span-12">
               <h2 className="text-2xl font-bold">Top 20 Apps</h2>
             </div>
             <div className="col-span-12">
               <div className="flex gap-4 justify-end">
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="w-[140px] justify-between">
                       Top This Year <ChevronDown className="w-4 h-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent>
                     <DropdownMenuItem onSelect={() => setSelectedTimeRange('Top This Year')}>Top This Year</DropdownMenuItem>
                     <DropdownMenuItem onSelect={() => setSelectedTimeRange('Top This Month')}>Top This Month</DropdownMenuItem>
                     <DropdownMenuItem onSelect={() => setSelectedTimeRange('Top This Week')}>Top This Week</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>

                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="w-[120px] justify-between">
                       Sort By: All <ChevronDown className="w-4 h-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent>
                     <DropdownMenuItem onSelect={() => setSelectedSort('All')}>All</DropdownMenuItem>
                     <DropdownMenuItem onSelect={() => setSelectedSort('Tokens')}>Tokens</DropdownMenuItem>
                     <DropdownMenuItem onSelect={() => setSelectedSort('Value')}>Value</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
               </div>
             </div>
           </div>

           {/* Apps Grid */}
           <div className="grid grid-cols-24 gap-6">
             {topModels.slice(0, 20).map((model, i) => (
               <Card key={i} className="p-6 col-span-6 border border-gray-400">
                 <div className="space-y-4">
                   <div className="flex items-center space-x-3">
                     <div className="w-12 h-12 rounded-full flex items-center justify-center">
                       <img src="/devicon_google.svg" alt={model.model} className="w-12 h-12 rounded-full" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-lg">{model.model}</h3>
                       <p className="text-sm">{model.org} • {model.category}</p>
                     </div>
                   </div>
                   
                   <div className="flex justify-between items-end">
                     <div>
                       <p className="text-2xl font-bold">{model.tokens}</p>
                       <p className="text-sm ">Tokens Generated</p>
                     </div>
                     <div className="text-right">
                       <p className={`text-2xl font-bold ${model.changePercent.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                         {model.changePercent}
                       </p>
                       <p className="text-sm ">Weekly Growth</p>
                     </div>
                   </div>
                   
                   <Button variant="outline" className="w-full border border-gray-400">
                     View App →
                   </Button>
                 </div>
               </Card>
             ))}
           </div>
           <div className='flex justify-center items-center mt-6'>
              <Button variant="outline">Load More</Button>
           </div>
         </div>
          </>
        )}
      </div>
    </div>
  );
}