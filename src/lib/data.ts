
import type { ProviderInfo } from "./provider-data";

export type ModelData = {
  name: string;
  organization: string;
  category: 'Language' | 'Vision' | 'Multimodal' | 'Audio & Speech Models' | 'Code Models' | 'Reinforcement Learning' | 'Embedding Models' | 'Domain-Specific';
  subCategories?: ('Text' | 'Image' | 'Audio' | 'Video')[];
  provider: 'OpenAI' | 'Google' | 'Anthropic' | 'Meta' | 'Mistral' | 'Other';
  tokens: number;
  value: string;
  change: number;
  positionChange: number;
};

export const topModels: ModelData[] = [
  // Multimodal (5 models)
  { name: 'GPT-4o', organization: 'OpenAI', category: 'Multimodal', subCategories: ['Text', 'Image', 'Audio', 'Video'], provider: 'OpenAI', tokens: 20.0, value: '$86B', change: 15.2, positionChange: 1 },
  { name: 'Gemini 2.1 Pro', organization: 'Google', category: 'Multimodal', subCategories: ['Text', 'Image', 'Audio'], provider: 'Google', tokens: 19.5, value: '$2T', change: 9.8, positionChange: -1 },
  { name: 'Claude 3.5 Sonnet', organization: 'Anthropic', category: 'Multimodal', subCategories: ['Text', 'Image'], provider: 'Anthropic', tokens: 19.2, value: '$20B', change: 25.1, positionChange: 3 },
  { name: 'CogVLM 2', organization: 'THUDM', category: 'Multimodal', subCategories: ['Text', 'Image'], provider: 'Other', tokens: 10.4, value: '$300M', change: 8.8, positionChange: 0 },
  { name: 'Llava-NeXT', organization: 'Various', category: 'Multimodal', subCategories: ['Text', 'Image'], provider: 'Other', tokens: 9.9, value: '$50M', change: 7.3, positionChange: 2 },

  // Language (6 models)
  { name: 'Llama 3.1 405B', organization: 'Meta', category: 'Language', provider: 'Meta', tokens: 18.8, value: '$1.3T', change: 12.5, positionChange: -2 },
  { name: 'Mistral Large 2', organization: 'Mistral', category: 'Language', provider: 'Mistral', tokens: 17.5, value: '$6B', change: 30.2, positionChange: 5 },
  { name: 'Gemma 2 27B', organization: 'Google', category: 'Language', provider: 'Google', tokens: 16.8, value: '$2T', change: 8.5, positionChange: 1 },
  { name: 'Command R+', organization: 'Cohere', category: 'Language', provider: 'Other', tokens: 16.5, value: '$5B', change: 18.7, positionChange: -1 },
  { name: 'DBRX', organization: 'Databricks', category: 'Language', provider: 'Other', tokens: 16.2, value: '$43B', change: 11.3, positionChange: 0 },
  { name: 'Jamba', organization: 'AI21 Labs', category: 'Language', provider: 'Other', tokens: 12.2, value: '$1.4B', change: 7.8, positionChange: 4 },
  
  // Vision (5 models)
  { name: 'PaliGemma', organization: 'Google', category: 'Vision', provider: 'Google', tokens: 15.9, value: '$2T', change: 7.1, positionChange: 2 },
  { name: 'Florence-2', organization: 'Microsoft', category: 'Vision', provider: 'Other', tokens: 15.5, value: '$3T', change: 6.5, positionChange: -1 },
  { name: 'Segment Anything', organization: 'Meta', category: 'Vision', provider: 'Meta', tokens: 15.2, value: '$1.3T', change: 5.4, positionChange: -1 },
  { name: 'I-JEPA', organization: 'Meta', category: 'Vision', provider: 'Meta', tokens: 12.5, value: '$1.3T', change: 3.2, positionChange: 3 },
  { name: 'YOLOv10', organization: 'THUDM', category: 'Vision', provider: 'Other', tokens: 9.8, value: '$100M', change: 6.1, positionChange: 0 },

  // Code Models (5 models)
  { name: 'Devin', organization: 'Cognition', category: 'Code Models', provider: 'Other', tokens: 17.1, value: '$2B', change: 50.0, positionChange: 10 },
  { name: 'AlphaCode 2', organization: 'Google', category: 'Code Models', provider: 'Google', tokens: 14.9, value: '$2T', change: 10.1, positionChange: -3 },
  { name: 'StarCoder 2', organization: 'Hugging Face', category: 'Code Models', provider: 'Other', tokens: 14.6, value: '$4.5B', change: 14.3, positionChange: 1 },
  { name: 'Code Llama', organization: 'Meta', category: 'Code Models', provider: 'Meta', tokens: 11.9, value: '$1.3T', change: 9.5, positionChange: 2 },
  { name: 'CodeGemma', organization: 'Google', category: 'Code Models', provider: 'Google', tokens: 9.5, value: '$2T', change: 8.1, positionChange: -1 },
  
  // Domain-Specific (4 models)
  { name: 'AlphaFold 3', organization: 'Google', category: 'Domain-Specific', provider: 'Google', tokens: 14.3, value: '$2T', change: 13.8, positionChange: 3 },
  { name: 'Galactica', organization: 'Meta', category: 'Domain-Specific', provider: 'Meta', tokens: 14.0, value: '$1.3T', change: 4.9, positionChange: -1 },
  { name: 'BioMedLM', organization: 'Stanford', category: 'Domain-Specific', provider: 'Other', tokens: 11.6, value: '$30M', change: 11.1, positionChange: 0 },
  { name: 'ClimateBERT', organization: 'TU Berlin', category: 'Domain-Specific', provider: 'Other', tokens: 9.4, value: '$10M', change: 5.5, positionChange: 1 },

  // Audio & Speech Models (4 models)
  { name: 'Whisper', organization: 'OpenAI', category: 'Audio & Speech Models', provider: 'OpenAI', tokens: 13.8, value: '$86B', change: 8.2, positionChange: 2 },
  { name: 'Seamless', organization: 'Meta', category: 'Audio & Speech Models', provider: 'Meta', tokens: 13.5, value: '$1.3T', change: 9.1, positionChange: -1 },
  { name: 'AudioPaLM', organization: 'Google', category: 'Audio & Speech Models', provider: 'Google', tokens: 11.3, value: '$2T', change: 5.9, positionChange: 0 },
  { name: 'VALL-E X', organization: 'Microsoft', category: 'Audio & Speech Models', provider: 'Other', tokens: 9.3, value: '$3T', change: 7.7, positionChange: 1 },

  // Embedding Models (4 models)
  { name: 'Voyage-02', organization: 'Voyage AI', category: 'Embedding Models', provider: 'Other', tokens: 13.2, value: '$150M', change: 16.4, positionChange: 4 },
  { name: 'text-embedding-3', organization: 'OpenAI', category: 'Embedding Models', provider: 'OpenAI', tokens: 13.0, value: '$86B', change: 6.7, positionChange: -2 },
  { name: 'BGE', organization: 'BAAI', category: 'Embedding Models', provider: 'Other', tokens: 11.0, value: '$60M', change: 12.3, positionChange: 1 },
  { name: 'Nomic Embed', organization: 'Nomic', category: 'Embedding Models', provider: 'Other', tokens: 9.2, value: '$40M', change: 10.5, positionChange: -1 },
  
  // Reinforcement Learning (4 models)
  { name: 'MuZero', organization: 'Google', category: 'Reinforcement Learning', provider: 'Google', tokens: 12.8, value: '$2T', change: 4.1, positionChange: 0 },
  { name: 'Agent57', organization: 'Google', category: 'Reinforcement Learning', provider: 'Google', tokens: 10.7, value: '$2T', change: 3.5, positionChange: 0 },
  { name: 'AlphaGo', organization: 'Google', category: 'Reinforcement Learning', provider: 'Google', tokens: 10.1, value: '$2T', change: 2.1, positionChange: 0 },
  { name: 'DreamerV3', organization: 'Google', category: 'Reinforcement Learning', provider: 'Google', tokens: 9.1, value: '$2T', change: 2.9, positionChange: 0 },
].sort((a, b) => b.tokens - a.tokens);


const generateChartDataSingle = (numPoints: number, timeUnit: 'days' | 'weeks' | 'months', modelMetrics: any[]) => {
  const data = [];
  const today = new Date();

  for (let i = numPoints - 1; i >= 0; i--) {
    let date;
    if (timeUnit === 'days') {
      date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    } else if (timeUnit === 'weeks') {
      date = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    } else { // months
      date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    }
    
    const dataPoint: { [key: string]: any } = {
      date: date.toISOString().split('T')[0]
    };

    modelMetrics.forEach(metric => {
      const value = metric.base * Math.pow(metric.growth, (numPoints - i) / numPoints);
      const noise = value * (Math.random() - 0.4) * 0.3;
      dataPoint[metric.name] = Math.max(0, parseFloat((value + noise).toFixed(1)));
    });
    
    data.push(dataPoint);
  }
  return data;
};

const modelNames = topModels.map(m => m.name);
const modelMetrics = modelNames.map((name, i) => ({
  name,
  base: 10 + i * 0.5 + Math.random() * 5,
  growth: 1.05 + Math.random() * 0.1
}));

export const yearlyModelTokenData = generateChartDataSingle(52, 'weeks', modelMetrics);
export const monthlyModelTokenData = generateChartDataSingle(30, 'days', modelMetrics);
export const weeklyModelTokenData = generateChartDataSingle(7, 'days', modelMetrics);

export const adjustModelDataForTimeRange = (models: ModelData[], timeRange: 'year' | 'month' | 'week'): ModelData[] => {
  const multiplier = {
    year: 1,
    month: 1/12,
    week: 1/52,
  };

  const changeVolatility = {
    year: 1,
    month: 1.2,
    week: 1.5,
  }

  return models.map((model, index) => ({
    ...model,
    tokens: parseFloat((model.tokens * multiplier[timeRange]).toFixed(1)),
    change: parseFloat((model.change * changeVolatility[timeRange]).toFixed(1)),
    positionChange: Math.floor(model.positionChange * changeVolatility[timeRange] - (index % 3)), // Minor deterministic position shift
  })).sort((a, b) => b.tokens - a.tokens);
};

export type AppData = {
  name: string;
  description: string;
  tokens: string;
  isNew: boolean;
  iconHint: string;
  change: number;
  website: string;
  positionChange: number;
};

export const topApps: AppData[] = [
  { name: 'Cline', description: 'Autonomous coding agent right in...', tokens: '25.7B tokens', isNew: false, iconHint: 'letter C', change: 5.2, website: '#', positionChange: 0 },
  { name: 'Kilo Code', description: 'AI coding agent for VS Code', tokens: '23.3B tokens', isNew: false, iconHint: 'code brackets', change: 4.8, website: '#', positionChange: 1 },
  { name: 'Roo Code', description: 'A whole dev team of AI agents in...', tokens: '21.4B tokens', isNew: false, iconHint: 'letter R', change: -2.1, website: '#', positionChange: -1 },
  { name: 'liteLLM', description: 'Open-source library to simplify L...', tokens: '13.2B tokens', isNew: false, iconHint: 'letter L', change: 8.9, website: '#', positionChange: 3 },
  { name: 'SillyTavern', description: 'LLM frontend for power users', tokens: '6.45B tokens', isNew: false, iconHint: 'letter S', change: 12.3, website: '#', positionChange: 0 },
  { name: 'HammerAI', description: 'Chat with AI characters for free', tokens: '3.36B tokens', isNew: false, iconHint: 'hammer', change: -5.5, website: '#', positionChange: -2 },
  { name: 'Chub AI', description: 'GenAI for everyone', tokens: '2.96B tokens', isNew: false, iconHint: 'letter C chat', change: 15.7, website: '#', positionChange: 2 },
  { name: 'forge', description: '', tokens: '1.82B tokens', isNew: true, iconHint: 'anvil', change: 20.1, website: '#', positionChange: 5 },
  { name: 'OpenRouter: Chatroom', description: 'Chat with multiple LLMs at once', tokens: '1.7B tokens', isNew: false, iconHint: 'speech bubbles', change: 3.2, website: '#', positionChange: 0 },
  { name: 'RolePlai - Ai Chat', description: 'LLM frontend for power users', tokens: '1.59B tokens', isNew: true, iconHint: 'letter R play', change: 25.4, website: '#', positionChange: 4 },
  { name: 'Linkd', description: '', tokens: '1.43B tokens', isNew: true, iconHint: 'letter L link', change: 18.9, website: '#', positionChange: 1 },
  { name: 'GDevelop', description: '', tokens: '1.22B tokens', isNew: true, iconHint: 'letter G controller', change: -10.3, website: '#', positionChange: -3 },
  { name: 'shapes inc', description: 'General purpose social agents', tokens: '1.21B tokens', isNew: false, iconHint: 'shapes', change: 1.1, website: '#', positionChange: 0 },
  { name: 'Caveduck', description: 'AI character chat', tokens: '1.04B tokens', isNew: false, iconHint: 'duck', change: 7.6, website: '#', positionChange: 1 },
  { name: 'janitorai.com', description: '', tokens: '991M tokens', isNew: true, iconHint: 'janitor broom', change: 30.5, website: '#', positionChange: 6 },
  { name: '21st.dev', description: '', tokens: '934M tokens', isNew: true, iconHint: 'number 21', change: 11.8, website: '#', positionChange: 2 },
  { name: 'Infinite Worlds', description: 'Build your own adventures, share...', tokens: '890M tokens', isNew: false, iconHint: 'infinity symbol', change: -3.7, website: '#', positionChange: -2 },
  { name: 'Open WebUI', description: 'Extensible, self-hosted AI interface', tokens: '863M tokens', isNew: false, iconHint: 'letter O web', change: 6.4, website: '#', positionChange: 0 },
  { name: 'Deepwriter', description: 'Research & write anything with ag...', tokens: '748M tokens', isNew: false, iconHint: 'letter D feather', change: 9.9, website: '#', positionChange: 1 },
  { name: 'Quack', description: 'Design and interact with characters', tokens: '707M tokens', isNew: false, iconHint: 'duck sound', change: -1.2, website: '#', positionChange: -1 },
];

export const adjustAppDataForTimeRange = (apps: AppData[], timeFrame: 'Today' | 'Past 7 days' | 'Past Month'): AppData[] => {
  const multiplier = {
    'Today': 1 / 30, // daily average
    'Past 7 days': 7 / 30,
    'Past Month': 1,
  };

  const changeVolatility = {
    'Today': 1.5,
    'Past 7 days': 1.1,
    'Past Month': 1,
  };

  const formatTokens = (value: number) => {
    if (value >= 1) return `${value.toFixed(2)}B tokens`;
    return `${Math.round(value * 1000)}M tokens`;
  };

  const parseTokens = (tokenStr: string): number => {
    const value = parseFloat(tokenStr);
    if (tokenStr.includes('B')) return value;
    if (tokenStr.includes('M')) return value / 1000;
    return value;
  };
  
  return apps.map((app, index) => {
    const baseTokens = parseTokens(app.tokens); // in Billions
    const adjustedTokens = baseTokens * multiplier[timeFrame];
    const adjustedChange = app.change * changeVolatility[timeFrame];
    
    return {
      ...app,
      tokens: formatTokens(adjustedTokens),
      change: parseFloat(adjustedChange.toFixed(1)),
      positionChange: Math.floor(app.positionChange * changeVolatility[timeFrame] - (index % 2)),
    };
  }).sort((a, b) => parseTokens(b.tokens) - parseTokens(a.tokens));
};

export type OrganizationData = {
  name: string;
  website?: string;
  github?: string;
  twitter?: string;
};

export const organizationsData: OrganizationData[] = [
    { name: 'OpenAI', website: 'https://openai.com', github: 'https://github.com/openai', twitter: 'https://twitter.com/OpenAI' },
    { name: 'Google', website: 'https://ai.google', github: 'https://github.com/google', twitter: 'https://twitter.com/GoogleAI' },
    { name: 'Anthropic', website: 'https://www.anthropic.com', github: '', twitter: 'https://twitter.com/AnthropicAI' },
    { name: 'Meta', website: 'https://ai.meta.com', github: 'https://github.com/facebookresearch', twitter: 'https://twitter.com/MetaAI' },
    { name: 'Mistral', website: 'https://mistral.ai', github: 'https://github.com/mistralai', twitter: 'https://twitter.com/MistralAI' },
    { name: 'Cohere', website: 'https://cohere.com', github: 'https://github.com/cohere-ai', twitter: 'https://twitter.com/cohere' },
    { name: 'Databricks', website: 'https://www.databricks.com', github: 'https://github.com/databricks', twitter: 'https://twitter.com/databricks' },
    { name: 'AI21 Labs', website: 'https://www.ai21.com', github: 'https://github.com/AI21Labs', twitter: 'https://twitter.com/AI21Labs' },
    { name: 'Microsoft', website: 'https://www.microsoft.com/en-us/ai', github: 'https://github.com/microsoft', twitter: 'https://twitter.com/MSFTAI' },
    { name: 'Hugging Face', website: 'https://huggingface.co', github: 'https://github.com/huggingface', twitter: 'https://twitter.com/huggingface' },
    { name: 'Cognition', website: 'https://www.cognition-labs.com', github: '', twitter: 'https://twitter.com/cognition_labs' },
    { name: 'Stanford', website: 'https://cs.stanford.edu/research/areas/artificial-intelligence', github: 'https://github.com/stanford-crfm', twitter: 'https://twitter.com/StanfordHAI' },
    { name: 'Voyage AI', website: 'https://www.voyageai.com', github: '', twitter: 'https://twitter.com/voyage_ai' },
    { name: 'Nomic', website: 'https://home.nomic.ai', github: 'https://github.com/nomic-ai', twitter: 'https://twitter.com/nomic_ai' },
    { name: 'qwen', website: '#', github: '#', twitter: '#' },
    { name: 'switchpoint', website: '#', github: '#', twitter: '#' },
    { name: 'moonshotai', website: '#', github: '#', twitter: '#' },
    { name: 'THUDM', website: 'https://www.thudm.org', github: 'https://github.com/THUDM', twitter: '' },
    { name: 'Various', website: '#', github: '#', twitter: '#' },
    { name: 'TU Berlin', website: '#', github: '#', twitter: '#' },
    { name: 'BAAI', website: 'https://www.baai.ac.cn/en/', github: 'https://github.com/FlagAI-Open', twitter: '' },
];


export const generateChartData = (providers: ProviderInfo[], dataKey: 'latency' | 'throughput'): any[] => {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dataPoint: { [key: string]: any } = {
            date: date.toISOString().split('T')[0]
        };

        providers.forEach((provider, pIndex) => {
            const baseValue = provider[dataKey] || 0;
            // Use a deterministic seed based on date and provider index
            const seed = date.getDate() + pIndex;
            const pseudoRandom = Math.sin(seed) * 10000;
            const fluctuation = baseValue * ( (pseudoRandom - Math.floor(pseudoRandom)) - 0.4) * 0.2;
            dataPoint[provider.name] = Math.max(0, parseFloat((baseValue + fluctuation).toFixed(2)));
        });

        data.push(dataPoint);
    }
    return data;
};

export const generateStatsTable = (providers: ProviderInfo[], dataKey: 'latency' | 'throughput') => {
    return providers.map((provider, index) => {
        const avg = provider[dataKey] || 0;
        // Use a deterministic seed for stats
        const pseudoRandomMin = Math.sin(index) * 10000;
        const pseudoRandomMax = Math.cos(index) * 10000;
        return {
            provider: provider.name,
            min: avg * (1 - ((pseudoRandomMin - Math.floor(pseudoRandomMin)) * 0.2 + 0.1)),
            max: avg * (1 + ((pseudoRandomMax - Math.floor(pseudoRandomMax)) * 0.3 + 0.2)),
            avg: avg,
        }
    });
};

    