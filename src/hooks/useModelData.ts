
import { useState, useEffect, useMemo } from 'react';
import type { ModelData, AppData } from '@/lib/data';
import { topModels, monthlyModelTokenData, weeklyModelTokenData, yearlyModelTokenData, adjustModelDataForTimeRange, topApps, adjustAppDataForTimeRange } from '@/lib/data';
import type { TimeFrameOption } from '@/components/dashboard/top-apps-table';


export type TimeRange = 'year' | 'month' | 'week';

export function useModelData(selectedTimeRange: TimeRange, selectedCategory: ModelData['category'] | 'All', appTimeFrame?: TimeFrameOption) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const chartData = useMemo(() => {
    switch (selectedTimeRange) {
      case 'week':
        return weeklyModelTokenData;
      case 'month':
        return monthlyModelTokenData;
      case 'year':
      default:
        return yearlyModelTokenData;
    }
  }, [selectedTimeRange]);

  const filteredModels = useMemo(() => {
    if (!isClient) {
      // For server-side rendering, return a stable list
      const initialModels = selectedCategory === 'All' 
        ? topModels 
        : topModels.filter(model => model.category === selectedCategory);
      return initialModels.slice(0, 20);
    }
    
    const adjustedModels = adjustModelDataForTimeRange(topModels, selectedTimeRange);
    
    const categoryFilteredModels = selectedCategory === 'All'
      ? adjustedModels
      : adjustedModels.filter(model => model.category === selectedCategory);
    
    return categoryFilteredModels.slice(0, 20);
  }, [isClient, selectedTimeRange, selectedCategory]);

  const adjustedApps = useMemo(() => {
    if (!isClient || !appTimeFrame) {
        return topApps.slice(0, 20);
    }
    return adjustAppDataForTimeRange(topApps, appTimeFrame);
  }, [isClient, appTimeFrame]);

  return { filteredModels, chartData, adjustedApps };
}
