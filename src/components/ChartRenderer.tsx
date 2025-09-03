import { useEffect, useRef, useState } from 'react';
import { ChartConfig, colorPalettes } from '../types/chartConfig';
import { loadChartConfig, loadCSVData } from '../data/reportLoader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Code, FileBarChart } from '@phosphor-icons/react';
import { toast } from 'sonner';
import * as d3 from 'd3';

interface ChartRendererProps {
  configPath: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ChartRenderer({ configPath, width = 800, height = 400, className = '' }: ChartRendererProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [config, setConfig] = useState<ChartConfig | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChart();
  }, [configPath]);

  const loadChart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const chartConfig = await loadChartConfig(configPath);
      setConfig(chartConfig);
      
      const csvData = await loadCSVData(chartConfig.dataSource);
      setData(csvData);
      
      renderChart(chartConfig, csvData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chart');
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = (config: ChartConfig, data: any[]) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Get colors based on palette
    const colors = getChartColors(config.colors);

    switch (config.type) {
      case 'line':
        renderLineChart(g, data, config, chartWidth, chartHeight, colors);
        break;
      case 'bar':
        renderBarChart(g, data, config, chartWidth, chartHeight, colors);
        break;
      case 'pie':
        renderPieChart(g, data, config, chartWidth, chartHeight, colors);
        break;
      case 'area':
        renderAreaChart(g, data, config, chartWidth, chartHeight, colors);
        break;
      default:
        console.warn(`Chart type ${config.type} not implemented yet`);
    }

    // Add title
    if (config.title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', '600')
        .style('fill', 'var(--foreground)')
        .text(config.title);
    }

    // Add subtitle
    if (config.subtitle) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 45)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'var(--muted-foreground)')
        .text(config.subtitle);
    }
  };

  const getChartColors = (colorConfig: ChartConfig['colors']): string[] => {
    switch (colorConfig.palette) {
      case 'highlight':
        return colorPalettes.highlight;
      case 'custom':
        return colorConfig.customColors || colorPalettes.default;
      default:
        return colorPalettes.default;
    }
  };

  const renderLineChart = (g: any, data: any[], config: ChartConfig, width: number, height: number, colors: string[]) => {
    if (!config.xAxis || !config.yAxis) return;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d[config.xAxis!.field]))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d[config.yAxis!.field]) as [number, number])
      .nice()
      .range([height, 0]);

    // Add axes
    if (config.grid?.show) {
      g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''))
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('stroke', config.grid.color || 'var(--border)');

      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''))
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('stroke', config.grid.color || 'var(--border)');
    }

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format(config.yAxis.format || '')));

    // Add line
    const line = d3.line<any>()
      .x(d => xScale(d[config.xAxis!.field])! + xScale.bandwidth() / 2)
      .y(d => yScale(d[config.yAxis!.field]));

    if (config.lines?.smooth) {
      line.curve(d3.curveCardinal);
    }

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colors[0])
      .attr('stroke-width', config.lines?.width || 2)
      .attr('stroke-dasharray', config.lines?.style === 'dashed' ? '5,5' : 'none')
      .attr('d', line);

    // Add dots
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', (d: any) => xScale(d[config.xAxis!.field])! + xScale.bandwidth() / 2)
      .attr('cy', (d: any) => yScale(d[config.yAxis!.field]))
      .attr('r', 4)
      .attr('fill', colors[0]);
  };

  const renderBarChart = (g: any, data: any[], config: ChartConfig, width: number, height: number, colors: string[]) => {
    if (!config.xAxis || !config.yAxis) return;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d[config.xAxis!.field]))
      .range([0, width])
      .padding(config.bar?.spacing || 0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[config.yAxis!.field]) as number])
      .nice()
      .range([height, 0]);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', `rotate(${config.xAxis.rotation || 0})`);

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format(config.yAxis.format || '')));

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => xScale(d[config.xAxis!.field])!)
      .attr('width', xScale.bandwidth())
      .attr('y', (d: any) => yScale(d[config.yAxis!.field]))
      .attr('height', (d: any) => height - yScale(d[config.yAxis!.field]))
      .attr('fill', colors[0])
      .attr('rx', config.bar?.borderRadius || 0);
  };

  const renderPieChart = (g: any, data: any[], config: ChartConfig, width: number, height: number, colors: string[]) => {
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    const pie = d3.pie<any>()
      .value(d => d[Object.keys(d)[1]]) // Use second column as value
      .sort(config.pie?.sortByValue ? null : d3.ascending);

    const arc = d3.arc<any>()
      .innerRadius(config.pie?.innerRadius ? radius * config.pie.innerRadius : 0)
      .outerRadius(radius)
      .padAngle(config.pie?.padAngle || 0)
      .cornerRadius(config.pie?.cornerRadius || 0);

    const pieData = pie(data);

    g.attr('transform', `translate(${centerX},${centerY})`);

    const slices = g.selectAll('.slice')
      .data(pieData)
      .enter().append('g')
      .attr('class', 'slice');

    slices.append('path')
      .attr('d', arc)
      .attr('fill', (_: any, i: number) => colors[i % colors.length]);

    // Add labels
    slices.append('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'white')
      .text((d: any) => d.data[Object.keys(d.data)[0]]);
  };

  const renderAreaChart = (g: any, data: any[], config: ChartConfig, width: number, height: number, colors: string[]) => {
    if (!config.xAxis || !config.yAxis) return;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d[config.xAxis!.field]))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[config.yAxis!.field]) as number])
      .nice()
      .range([height, 0]);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format(config.yAxis.format || '')));

    // Add area
    const area = d3.area<any>()
      .x(d => xScale(d[config.xAxis!.field])! + xScale.bandwidth() / 2)
      .y0(height)
      .y1(d => yScale(d[config.yAxis!.field]));

    g.append('path')
      .datum(data)
      .attr('fill', colors[0])
      .attr('fill-opacity', config.areas?.opacity || 0.7)
      .attr('d', area);
  };

  const downloadCSV = () => {
    if (!config || !data.length) return;
    
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('CSV bestand gedownload');
  };

  const copyIframeCode = () => {
    if (!config) return;
    
    const iframeCode = `<iframe src="${window.location.origin}/chart/${config.id}" width="800" height="400" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(iframeCode);
    toast.success('Iframe code gekopieerd naar klembord');
  };

  const convertToCSV = (data: any[]): string => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return `${headers}\n${rows}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <FileBarChart size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p>Grafiek laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-destructive/10 rounded-lg">
        <div className="text-center">
          <p className="text-destructive">Fout bij laden grafiek: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="chart-container">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="w-full h-auto"
        />
        
        {config?.footer && (
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            {config.footer.text && <p>{config.footer.text}</p>}
            {config.footer.source && <p><strong>Bron:</strong> {config.footer.source}</p>}
            {config.footer.notes && config.footer.notes.map((note, index) => (
              <p key={index}>• {note}</p>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCSV}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Download CSV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyIframeCode}
            className="flex items-center gap-2"
          >
            <Code size={16} />
            Kopieer iframe
          </Button>
        </div>
      </div>
    </Card>
  );
}