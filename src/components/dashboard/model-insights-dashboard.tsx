import TokenGenerationChart from './token-generation-chart';
import TopModelsTable from './top-models-table';
import type { ModelData } from '@/lib/data';
import TopAppsTable from './top-apps-table';

interface ModelInsightsDashboardProps {
  models: ModelData[];
  chartData: any[];
  timeRange: 'year' | 'month' | 'week';
}

export default function ModelInsightsDashboard({ models, chartData, timeRange }: ModelInsightsDashboardProps) {
  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="flex flex-col gap-8">
        <TokenGenerationChart models={models} chartData={chartData} timeRange={timeRange} />
        <TopModelsTable models={models} />
        <TopAppsTable />
      </div>
    </div>
  );
}
