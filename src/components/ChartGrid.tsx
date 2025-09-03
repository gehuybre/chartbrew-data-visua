import { ChartRenderer } from './ChartRenderer';
import { Card } from '@/components/ui/card';

interface ChartGridItem {
  id: string;
  title?: string;
  configPath: string;
  width?: number;
  height?: number;
}

interface ChartGridProps {
  charts: ChartGridItem[];
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ChartGrid({ 
  charts, 
  columns = 2, 
  gap = 'md',
  className = '' 
}: ChartGridProps) {
  const getGridClasses = () => {
    const columnClasses = {
      1: 'grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'xl:grid-cols-4'
    };
    
    const gapClasses = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8'
    };
    
    return `grid ${columnClasses[columns]} ${gapClasses[gap]}`;
  };

  const getChartSize = () => {
    // Responsive chart sizes based on grid columns
    const sizes = {
      1: { width: 800, height: 400 },
      2: { width: 600, height: 350 },
      3: { width: 450, height: 300 },
      4: { width: 350, height: 250 }
    };
    
    return sizes[columns];
  };

  const { width: defaultWidth, height: defaultHeight } = getChartSize();

  return (
    <div className={`chart-grid ${getGridClasses()} ${className}`}>
      {charts.map((chart) => (
        <div key={chart.id} className="chart-grid-item">
          {chart.title && (
            <Card className="p-4 mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {chart.title}
              </h3>
            </Card>
          )}
          
          <ChartRenderer
            configPath={chart.configPath}
            width={chart.width || defaultWidth}
            height={chart.height || defaultHeight}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}

// Convenience components for common layouts
export function ChartGrid2x2({ charts, className = '' }: { charts: ChartGridItem[], className?: string }) {
  return (
    <ChartGrid
      charts={charts}
      columns={2}
      gap="md"
      className={className}
    />
  );
}

export function ChartGrid3x1({ charts, className = '' }: { charts: ChartGridItem[], className?: string }) {
  return (
    <ChartGrid
      charts={charts}
      columns={3}
      gap="sm"
      className={className}
    />
  );
}

export function ChartGrid4x1({ charts, className = '' }: { charts: ChartGridItem[], className?: string }) {
  return (
    <ChartGrid
      charts={charts}
      columns={4}
      gap="sm"
      className={className}
    />
  );
}

export function ChartGridSingle({ chart, className = '' }: { chart: ChartGridItem, className?: string }) {
  return (
    <ChartGrid
      charts={[chart]}
      columns={1}
      gap="lg"
      className={className}
    />
  );
}