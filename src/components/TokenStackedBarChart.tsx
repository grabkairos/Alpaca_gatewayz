'use client';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import mockData from '@/lib/mock_token_generation_data.json';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const TokenStackedBarChart = () => {
  // Extract all labels (dates)
  const labels = mockData.dates.map(date => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Define consistent colors for each model
  const modelColors: Record<string, string> = {
    'DeepSeek v3': '#1e40af',
    'Claude Sonnet 4': '#ea580c',
    'Gemini 2.5 Pro': '#3b82f6',
    'Gemini 2.0 Flash': '#eab308',
    'Gemini 2.5 Flash': '#2563eb',
    'GPT-4o-mini': '#10b981',
    'Mistral Nemo': '#8b5cf6',
    'Llama 3.3': '#14b8a6',
    'Grok 3 Beta': '#4f46e5',
    'Others': '#f97316',
  };

  const datasets = mockData.models.map(model => ({
    label: model.name,
    data: model.data.map(value => value / 1e9), // Convert to billions
    backgroundColor: modelColors[model.name] || '#6b7280',
    stack: 'Stack 0',
  }));

  const data = {
    labels,
    datasets,
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            if (value >= 1000) return `${context.dataset.label}: ${(value / 1000).toFixed(1)}T`;
            if (value >= 1) return `${context.dataset.label}: ${value.toFixed(1)}B`;
            return `${context.dataset.label}: ${(value * 1000).toFixed(0)}M`;
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category',
        stacked: true,
        ticks: {
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20,
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tokens Generated',
          font: {
            size: 13,
            weight: 'bold',
          },
        },
        ticks: {
          callback: function (value: any) {
            if (value >= 1000) return `${(value / 1000).toFixed(1)}T`;
            if (value >= 1) return `${value.toFixed(0)}B`;
            return `${(value * 1000).toFixed(0)}M`;
          },
          font: {
            size: 11,
          },
        },
        grid: {
          color: '#e5e7eb',
        },
      },
    },
  };

  return (
    <div className="w-full h-[32rem]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default TokenStackedBarChart;
