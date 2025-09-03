import { useState } from 'react';
import { ChartData } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Download, Code, Copy, Check } from '@phosphor-icons/react';
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
  const [copiedCode, setCopiedCode] = useState(false);

  // Convert chart data to CSV format
  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  // Download CSV file
  const downloadCSV = () => {
    // If chart has a CSV path, try to download that file first
    if (chart.csvPath) {
      // Create a link to download the actual CSV file
      const link = document.createElement('a');
      link.href = chart.csvPath;
      link.download = chart.csvPath.split('/').pop() || `${chart.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CSV bestand gedownload');
      return;
    }
    
    // Fallback to generating CSV from chart data
    const csvContent = convertToCSV(chart.data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${chart.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CSV bestand gedownload');
    }
  };

  // Generate iframe embed code
  const generateIframeCode = () => {
    const chartConfig = {
      id: chart.id,
      type: chart.type,
      title: chart.title,
      data: chart.data,
      config: chart.config
    };
    
    const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
    const embedUrl = `${window.location.origin}/embed/${chart.id}?config=${encodedConfig}`;
    
    return `<iframe src="${embedUrl}" width="600" height="400" frameborder="0" title="${chart.title}"></iframe>`;
  };

  // Copy iframe code to clipboard
  const copyIframeCode = async () => {
    const iframeCode = generateIframeCode();
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopiedCode(true);
      toast.success('Iframe code gekopieerd naar klembord');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      toast.error('Kon iframe code niet kopiëren');
    }
  };
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
        return <div className="flex items-center justify-center h-64 text-muted-foreground">Niet-ondersteund grafiektype</div>;
    }
  };

  return (
    <div className={`bg-card rounded-lg border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-inter font-medium text-lg text-foreground">
          {chart.title}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCSV}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            CSV
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Code size={16} />
                Embed
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Embed Code voor {chart.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Kopieer deze code om de grafiek in je website of sociale media in te voegen:
                </p>
                <div className="relative">
                  <Textarea
                    value={generateIframeCode()}
                    readOnly
                    className="font-mono text-sm min-h-[120px]"
                  />
                  <Button
                    size="sm"
                    onClick={copyIframeCode}
                    className="absolute top-2 right-2 flex items-center gap-2"
                  >
                    {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                    {copiedCode ? 'Gekopieerd!' : 'Kopiëren'}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p><strong>Afmetingen:</strong> 600px breed × 400px hoog</p>
                  <p><strong>Responsief:</strong> Pas de width en height attributen aan indien nodig</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}