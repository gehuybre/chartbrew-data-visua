import { ChartData } from '@/types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ChartViewerProps {
  chart: ChartData;
  className?: string;
}

const CHART_COLORS = [
  'var(--chart-primary)',
  'var(--chart-secondary)', 
  'var(--chart-tertiary)',
  'var(--chart-quaternary)',
  'var(--chart-quinary)'
];

export function ChartViewer({ chart, className = "" }: ChartViewerProps) {
  const renderChart = () => {
    const commonProps = {
      data: chart.data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chart.type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240)" />
            <XAxis 
              dataKey={Object.keys(chart.data[0] || {})[0]} 
              stroke="oklch(0.55 0.08 240)"
              fontSize={12}
              fontFamily="Inter"
            />
            <YAxis 
              stroke="oklch(0.55 0.08 240)"
              fontSize={12}
              fontFamily="Inter"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontFamily: 'Inter'
              }}
            />
            <Legend fontFamily="Inter" />
            <Bar 
              dataKey={Object.keys(chart.data[0] || {})[1]} 
              fill={CHART_COLORS[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240)" />
            <XAxis 
              dataKey={Object.keys(chart.data[0] || {})[0]} 
              stroke="oklch(0.55 0.08 240)"
              fontSize={12}
              fontFamily="Inter"
            />
            <YAxis 
              stroke="oklch(0.55 0.08 240)"
              fontSize={12}
              fontFamily="Inter"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontFamily: 'Inter'
              }}
            />
            <Legend fontFamily="Inter" />
            <Line 
              type="monotone" 
              dataKey={Object.keys(chart.data[0] || {})[1]} 
              stroke={CHART_COLORS[0]}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: CHART_COLORS[0], strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie
              data={chart.data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey={Object.keys(chart.data[0] || {})[1]}
              label={({ name, value }) => `${name}: ${value}${typeof value === 'number' && value < 100 ? '%' : ''}`}
              labelStyle={{ fontFamily: 'Inter', fontSize: 12 }}
            >
              {chart.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontFamily: 'Inter'
              }}
            />
            <Legend fontFamily="Inter" />
          </PieChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240)" />
            <XAxis 
              dataKey={Object.keys(chart.data[0] || {})[0]} 
              stroke="oklch(0.55 0.08 240)"
              fontSize={12}
              fontFamily="Inter"
            />
            <YAxis 
              stroke="oklch(0.55 0.08 240)"
              fontSize={12}
              fontFamily="Inter"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontFamily: 'Inter'
              }}
            />
            <Legend fontFamily="Inter" />
            <Area
              type="monotone"
              dataKey={Object.keys(chart.data[0] || {})[1]}
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
              fill={CHART_COLORS[0]}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      default:
        return <div className="flex items-center justify-center h-64 text-muted-foreground">Unsupported chart type</div>;
    }
  };

  return (
    <div className={`bg-card rounded-lg border p-6 ${className}`}>
      <h3 className="font-inter font-medium text-lg mb-4 text-foreground">
        {chart.title}
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}