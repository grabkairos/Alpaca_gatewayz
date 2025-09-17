
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ModelData } from '@/lib/data';
import { ArrowUp, ArrowDown, Bot, Building, Eye, MessageSquare, Boxes, Server, Box, Code, Sliders, Puzzle, Dna, Mic, Minus, Triangle } from 'lucide-react';
import { cn, stringToColor } from '@/lib/utils';
import Link from 'next/link';

const categoryIcons: Record<ModelData['category'], React.ElementType> = {
  Language: MessageSquare,
  Vision: Eye,
  Multimodal: Boxes,
  'Audio & Speech Models': Mic,
  'Code Models': Code,
  'Reinforcement Learning': Puzzle,
  'Embedding Models': Sliders,
  'Domain-Specific': Dna,
};

const providerIcons: Record<ModelData['provider'], React.ElementType> = {
  OpenAI: Bot,
  Google: Bot,
  Anthropic: Bot,
  Meta: Bot,
  Mistral: Bot,
  Other: Server,
};

interface TopModelsTableProps {
  models: ModelData[];
}

const CategoryCell = ({ model }: { model: ModelData }) => {
  const CategoryIcon = categoryIcons[model.category] || Box;
  const content = (
    <Badge variant="outline" className="flex items-center gap-1.5 w-fit" style={{ backgroundColor: stringToColor(model.category) }}>
      <CategoryIcon className="h-3 w-3" />
      {model.category}
    </Badge>
  );

  if (model.category !== 'Multimodal' || !model.subCategories || model.subCategories.length === 0) {
    return <TableCell>{content}</TableCell>;
  }

  return (
    <TableCell>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">{content}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">Modalities:</p>
          <ul className="list-disc list-inside">
            {model.subCategories.map(sc => <li key={sc}>{sc}</li>)}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TableCell>
  );
};

export default function TopModelsTable({ models }: TopModelsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 20 Models</CardTitle>
        <CardDescription>Detailed comparison of leading AI models.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Model</TableHead>
              <TableHead className="hidden sm:table-cell">Organization</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Top Provider</TableHead>
              <TableHead className="text-right">Tokens (T)</TableHead>
              <TableHead className="hidden lg:table-cell text-right">Value</TableHead>
              <TableHead className="text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model, index) => {
              const ProviderIcon = providerIcons[model.provider] || Server;
              const isPositiveChange = model.change >= 0;
              const rank = index + 1;

              const getPositionChangeColor = () => {
                if (model.positionChange > 0) return 'text-green-400';
                if (model.positionChange < 0) return 'text-red-400';
                return 'text-muted-foreground';
              };

              return (
                <TableRow key={model.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("flex items-center gap-1 text-xs w-6", getPositionChangeColor())}>
                        {model.positionChange !== 0 && (
                           <Triangle className={cn("h-2 w-2 fill-current", model.positionChange > 0 ? 'transform rotate-180' : '')} />
                        )}
                        {model.positionChange !== 0 ? Math.abs(model.positionChange) : <Minus className="h-2 w-2" />}
                      </div>
                      <span className="font-bold text-lg">{rank}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/models/${encodeURIComponent(model.name)}`} className="flex items-center gap-2 hover:underline">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                      <span>{model.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Link href={`/organizations/${encodeURIComponent(model.organization)}`} className="flex items-center gap-2 hover:underline">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{model.organization}</span>
                    </Link>
                  </TableCell>
                  <CategoryCell model={model} />
                  <TableCell className="hidden md:table-cell">
                     <div className="flex items-center gap-2">
                      <ProviderIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{model.provider}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{model.tokens.toFixed(1)}T</TableCell>
                  <TableCell className="hidden lg:table-cell text-right">{model.value}</TableCell>
                  <TableCell className="text-right">
                    <span className={cn('flex items-center justify-end gap-1', isPositiveChange ? 'text-green-400' : 'text-red-400')}>
                      {isPositiveChange ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      {Math.abs(model.change)}%
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
