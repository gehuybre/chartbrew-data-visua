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

  useEffect(() => {
    if (config && data.length > 0) {
      renderChart(config, data);
    }
  }, [config, data, width, height]);

  const loadChart = async () => {
    try {
      console.log('Loading chart config from:', configPath);
      setIsLoading(true);
      setError(null);
      
      const chartConfig = await loadChartConfig(configPath);
      console.log('Loaded chart config:', chartConfig);
      setConfig(chartConfig);
      
      const csvData = await loadCSVData(chartConfig.dataSource);
      console.log('Loaded CSV data:', csvData);
      setData(csvData);
      
      renderChart(chartConfig, csvData);
    } catch (err) {
      console.error('Error loading chart:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chart');
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = (config: ChartConfig, data: any[]) => {
    if (!svgRef.current) return;
    
    console.log('Rendering chart:', config.id, 'with data:', data);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Get colors based on palette
    const colors = getChartColors(config.colors);

    try {
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
          // Add a fallback message
          g.append('text')
            .attr('x', chartWidth / 2)
            .attr('y', chartHeight / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', 'var(--muted-foreground)')
            .text(`Chart type "${config.type}" wordt nog niet ondersteund`);
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
    } catch (error) {
      console.error('Error rendering chart:', error);
      // Show error in chart
      g.append('text')
        .attr('x', chartWidth / 2)
        .attr('y', chartHeight / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', 'var(--destructive)')
        .text('Fout bij renderen van grafiek');
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
    if (!config.xAxis || !config.yAxis) {
      console.error('Missing axis configuration for line chart');
      return;
    }

    console.log('Rendering line chart with:', { data, xField: config.xAxis.field, yField: config.yAxis.field });

    const xScale = d3.scaleBand()
      .domain(data.map(d => String(d[config.xAxis!.field])))
      .range([0, width])
      .padding(0.1);

    const yExtent = d3.extent(data, d => Number(d[config.yAxis!.field])) as [number, number];
    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .nice()
      .range([height, 0]);

    // Add grid if enabled
    if (config.grid?.show) {
      g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''))
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('stroke', config.grid.color || 'var(--border)')
        .style('opacity', 0.3);

      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''))
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('stroke', config.grid.color || 'var(--border)')
        .style('opacity', 0.3);
    }

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'var(--foreground)');

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format(config.yAxis.format || '')))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'var(--foreground)');

    // Add axis labels
    if (config.xAxis.label) {
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'var(--foreground)')
        .text(config.xAxis.label);
    }

    if (config.yAxis.label) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'var(--foreground)')
        .text(config.yAxis.label);
    }

    // Add line
    const line = d3.line<any>()
      .x(d => xScale(String(d[config.xAxis!.field]))! + xScale.bandwidth() / 2)
      .y(d => yScale(Number(d[config.yAxis!.field])));

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
      .attr('cx', (d: any) => xScale(String(d[config.xAxis!.field]))! + xScale.bandwidth() / 2)
      .attr('cy', (d: any) => yScale(Number(d[config.yAxis!.field])))
      .attr('r', 4)
      .attr('fill', colors[0])
      .style('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 6).style('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('r', 4).style('opacity', 0.8);
      });
  };

  const renderBarChart = (g: any, data: any[], config: ChartConfig, width: number, height: number, colors: string[]) => {
    if (!config.xAxis || !config.yAxis) {
      console.error('Missing axis configuration for bar chart');
      return;
    }

    console.log('Rendering bar chart with:', { data, xField: config.xAxis.field, yField: config.yAxis.field });

    const xScale = d3.scaleBand()
      .domain(data.map(d => String(d[config.xAxis!.field])))
      .range([0, width])
      .padding(config.bar?.spacing || 0.1);

    const yMax = d3.max(data, d => Number(d[config.yAxis!.field])) || 0;
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([height, 0]);

    // Add grid if enabled
    if (config.grid?.show) {
      g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''))
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('stroke', config.grid.color || 'var(--border)')
        .style('opacity', 0.3);

      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''))
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('stroke', config.grid.color || 'var(--border)')
        .style('opacity', 0.3);
    }

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', 'var(--foreground)')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', `rotate(${config.xAxis.rotation || -45})`);

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format(config.yAxis.format || '')))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'var(--foreground)');

    // Add axis labels
    if (config.xAxis.label) {
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'var(--foreground)')
        .text(config.xAxis.label);
    }

    if (config.yAxis.label) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'var(--foreground)')
        .text(config.yAxis.label);
    }

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => xScale(String(d[config.xAxis!.field]))!)
      .attr('width', xScale.bandwidth())
      .attr('y', (d: any) => yScale(Number(d[config.yAxis!.field])))
      .attr('height', (d: any) => height - yScale(Number(d[config.yAxis!.field])))
      .attr('fill', colors[0])
      .attr('rx', config.bar?.borderRadius || 0)
      .style('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).style('opacity', 0.8);
      });
  };

  const renderPieChart = (g: any, data: any[], config: ChartConfig, width: number, height: number, colors: string[]) => {
    console.log('Rendering pie chart with data:', data);
    
    const radius = Math.min(width, height) / 2 - 20; // Leave some margin
    const centerX = width / 2;
    const centerY = height / 2;

    // For pie charts, we expect data with 'label' and 'value' fields, or use the first two fields
    const keys = Object.keys(data[0] || {});
    const labelField = keys[0];
    const valueField = keys[1];

    console.log('Using fields:', { labelField, valueField });

    const pie = d3.pie<any>()
      .value(d => Number(d[valueField]))
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
      .attr('fill', (_: any, i: number) => colors[i % colors.length])
      .style('opacity', 0.9)
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).style('opacity', 0.9);
      });

    // Add labels
    slices.append('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', 'white')
      .style('text-shadow', '0 1px 2px rgba(0,0,0,0.6)')
      .text((d: any) => {
        const percentage = ((d.data[valueField] / d3.sum(data, d => d[valueField])) * 100).toFixed(1);
        return percentage > 5 ? `${percentage}%` : ''; // Only show label if slice is big enough
      });

    // Add legend if enabled
    if (config.legend?.show && config.legend.position === 'right') {
      const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${radius + 30}, ${-radius})`);

      const legendItems = legend.selectAll('.legend-item')
        .data(pieData)
        .enter().append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 25})`);

      legendItems.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', (d, i) => colors[i % colors.length]);

      legendItems.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('fill', 'var(--foreground)')
        .text((d: any) => d.data[labelField]);
    }
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
          className="w-full h-auto max-w-full"
          style={{ display: 'block' }}
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