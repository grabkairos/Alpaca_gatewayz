
export type ProviderInfo = {
    name: string;
    location: string;
    quantization: string;
    context: number;
    maxOutput: number;
    inputCost: number;
    outputCost: number;
    latency: number | null;
    throughput: number | null;
    uptime: number; // 0 to 1
};

export const providerData: Record<string, ProviderInfo[]> = {
    'Qwen: Qwen2 72B A16B 2507': [
        { name: 'DeepInfra', location: 'US', quantization: 'fp8', context: 33, maxOutput: 16, inputCost: 0.12, outputCost: 0.39, latency: 0.77, throughput: 39.18, uptime: 1 },
        { name: 'Nebius AI Studio', location: 'DE', quantization: 'fp8', context: 131, maxOutput: 131, inputCost: 0.13, outputCost: 0.40, latency: 0.65, throughput: 25.45, uptime: 0.8 },
        { name: 'NextBit', location: 'US', quantization: 'int4', context: 66, maxOutput: 66, inputCost: 0.20, outputCost: 0.40, latency: null, throughput: null, uptime: 0.5 },
        { name: 'NovitaAI', location: 'US', quantization: 'fp8', context: 32, maxOutput: 32, inputCost: 0.38, outputCost: 0.40, latency: 0.74, throughput: 31.45, uptime: 0.9 },
    ],
    'Google: Gemini 2.1 Pro': [
        { name: 'Google', location: 'US', quantization: 'fp16', context: 1024, maxOutput: 8192, inputCost: 0.50, outputCost: 1.50, latency: 0.55, throughput: 50.00, uptime: 0.99 },
    ],
     'Anthropic: Claude 3.5 Sonnet': [
        { name: 'Anthropic', location: 'US', quantization: 'fp16', context: 200, maxOutput: 4096, inputCost: 0.25, outputCost: 1.25, latency: 0.45, throughput: 60.00, uptime: 0.98 },
        { name: 'AWS Bedrock', location: 'US', quantization: 'fp16', context: 200, maxOutput: 4096, inputCost: 0.28, outputCost: 1.30, latency: 0.50, throughput: 55.00, uptime: 0.95 },
    ],
    'Meta: Llama 3.1 405B': [
        { name: 'Fireworks', location: 'US', quantization: 'fp8', context: 128, maxOutput: 4096, inputCost: 0.90, outputCost: 2.50, latency: 0.9, throughput: 20.0, uptime: 0.92 },
    ]
};

// Add default provider data for all other models
import { models } from './models-data';
models.forEach(model => {
    if (!providerData[model.name]) {
        providerData[model.name] = [{
            name: model.developer,
            location: 'US',
            quantization: 'fp16',
            context: model.context,
            maxOutput: 4096,
            inputCost: model.inputCost,
            outputCost: model.outputCost,
            latency: Math.random() * 0.5 + 0.3, // 0.3s to 0.8s
            throughput: Math.random() * 30 + 20, // 20-50 tps
            uptime: Math.random() * 0.1 + 0.9 // 90% - 100%
        }];
    }
});
