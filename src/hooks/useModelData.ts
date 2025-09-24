
import { useState, useEffect, useMemo } from 'react';
import type { ModelData, AppData } from '@/lib/data';
import { topModels, monthlyModelTokenData, weeklyModelTokenData, yearlyModelTokenData, adjustModelDataForTimeRange, topApps, adjustAppDataForTimeRange } from '@/lib/data';
import type { TimeFrameOption } from '@/components/dashboard/top-apps-table';
import { useModels, useModelProviders } from '@/hooks/use-api';


export type TimeRange = 'year' | 'month' | 'week';

// Helper functions to transform API data
const getCategoryFromModel = (model: any): ModelData['category'] => {
  const name = model.name.toLowerCase();
  if (name.includes('coder') || name.includes('code')) return 'Code Models';
  if (name.includes('vision') || name.includes('image')) return 'Vision';
  if (name.includes('multimodal') || name.includes('image')) return 'Multimodal';
  if (name.includes('audio') || name.includes('speech')) return 'Audio & Speech Models';
  if (name.includes('embedding')) return 'Embedding Models';
  if (name.includes('research') || name.includes('agent')) return 'Domain-Specific';
  return 'Language';
};

const getProviderFromModel = (model: any): ModelData['provider'] => {
  const id = model.id.toLowerCase();
  if (id.includes('openai')) return 'OpenAI';
  if (id.includes('google') || id.includes('gemini')) return 'Google';
  if (id.includes('anthropic') || id.includes('claude')) return 'Anthropic';
  if (id.includes('meta') || id.includes('llama')) return 'Meta';
  if (id.includes('mistral')) return 'Mistral';
  return 'Other';
};

const parseTokensFromModel = (model: any): number => {
  // Use context length as a proxy for token capacity
  const contextLength = model.context_length || 0;
  if (contextLength > 1000000) return 20.0; // Very large models
  if (contextLength > 100000) return 15.0;  // Large models
  if (contextLength > 10000) return 10.0;   // Medium models
  return 5.0; // Smaller models
};

const getModelValue = (model: any): string => {
  // Estimate value based on pricing and capabilities
  const promptPrice = parseFloat(model.pricing?.prompt || '0');
  const completionPrice = parseFloat(model.pricing?.completion || '0');
  const avgPrice = (promptPrice + completionPrice) / 2;
  
  if (avgPrice > 0.01) return '$1B+';
  if (avgPrice > 0.001) return '$500M+';
  if (avgPrice > 0.0001) return '$100M+';
  return '$10M+';
};

export function useModelData(selectedTimeRange: TimeRange, selectedCategory: ModelData['category'] | 'All', appTimeFrame?: TimeFrameOption) {
  const [isClient, setIsClient] = useState(false);
  
  // API integration - fetch real models data
  const { data: apiModels, loading: modelsLoading, error: modelsError } = useModels();
  const { data: apiProviders, loading: providersLoading, error: providersError } = useModelProviders();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use API data if available, fallback to mock data
  const modelsData = useMemo(() => {
    if (apiModels && Array.isArray(apiModels) && !modelsLoading) {
      // Transform API data to match existing UI structure
      console.log(apiModels,"apiModels");
      return apiModels.map((model: any) => ({
        name: model.name,
        organization: model.id.split('/')[0] || 'Unknown', // Extract organization from model ID
        category: getCategoryFromModel(model), // Determine category from model data
        provider: getProviderFromModel(model), // Determine provider from model data
        tokens: parseTokensFromModel(model), // Extract token count from pricing/context
        value: getModelValue(model), // Calculate model value
        change: Math.random() * 20 - 10, // Random change for now
        positionChange: Math.floor(Math.random() * 6) - 3, // Random position change
      }));
    }
    return topModels;
  }, [apiModels, modelsLoading]);

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
        ? modelsData 
        : modelsData.filter((model: ModelData) => model.category === selectedCategory);
      return initialModels.slice(0, 20);
    }
    
    const adjustedModels = adjustModelDataForTimeRange(modelsData, selectedTimeRange);
    
    const categoryFilteredModels = selectedCategory === 'All'
      ? adjustedModels
      : adjustedModels.filter(model => model.category === selectedCategory);
    
    return categoryFilteredModels.slice(0, 20);
  }, [isClient, selectedTimeRange, selectedCategory, modelsData]);

  const adjustedApps = useMemo(() => {
    if (!isClient || !appTimeFrame) {
        return topApps.slice(0, 20);
    }
    return adjustAppDataForTimeRange(topApps, appTimeFrame);
  }, [isClient, appTimeFrame]);

  return { 
    modelsData,
    filteredModels, 
    chartData, 
    adjustedApps,
    loading: modelsLoading || providersLoading,
    error: modelsError || providersError
  };
}
