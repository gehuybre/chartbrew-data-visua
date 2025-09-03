import { useEffect, useRef, useState } from 'react';
import { ChartConfig, colorPalettes } from '../types/chartConfig';
import { loadChartConfig, loadCSVData } from '../data/reportLoader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Code } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { FallbackChart } from './FallbackChart';
import * as d3 from 'd3';

// Animation constants
const ANIMATION_DURATION = 750;
const STAGGER_DELAY = 50;
const HOVER_DURATION = 200;

interface ChartRendererProps {
  configPath: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ChartRenderer({ configPath, width = 800, height = 400, className = '' }: ChartRendererProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<ChartConfig | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    loadChart();
  }, [configPath]);

  useEffect(() => {
    if (config && data.length > 0 && !useFallback) {
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        try {
          renderChart(config, data);
        } catch (error) {
          console.error('D3 rendering failed, switching to fallback:', error);
          setUseFallback(true);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [config, data, width, height, useFallback]);



  const loadChart = async () => {
    try {
      console.log('Loading chart config from:', configPath);
      setIsLoading(true);
      setError(null);
      
      const chartConfig = await loadChartConfig(configPath);
      console.log('Loaded chart config:', chartConfig);
      
      if (!chartConfig) {
        throw new Error('No chart config returned');
      }
      
      setConfig(chartConfig);
      
      const csvData = await loadCSVData(chartConfig.dataSource);
      console.log('Loaded CSV data:', csvData);
      
      if (!csvData || csvData.length === 0) {
        throw new Error('No data returned from CSV source');
      }
      
      setData(csvData);
      
    } catch (err) {
      console.error('Error loading chart:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chart');
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = (config: ChartConfig, data: any[]) => {
    if (!svgRef.current) {
      console.log('SVG ref not available yet');
      return;
    }
    
    console.log('=== CHART RENDERING START ===');
    console.log('Chart ID:', config.id);
    console.log('Chart type:', config.type);
    console.log('Data:', data);
    console.log('Data length:', data.length);

    const svg = d3.select(svgRef.current);
    
    // Clear existing content
    svg.selectAll('*').remove();

    const margin = { top: 60, right: 40, bottom: 80, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Add white background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'white');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Get colors based on palette
    const colors = getChartColors(config.colors);
    console.log('Using colors:', colors);

    try {
      switch (config.type) {
        case 'line':
          console.log('Rendering line chart');
          renderLineChart(g, data, config, chartWidth, chartHeight, colors);
          break;
        case 'bar':
          console.log('Rendering bar chart');
          renderBarChart(g, data, config, chartWidth, chartHeight, colors);
          break;
        case 'pie':
          console.log('Rendering pie chart');
          renderPieChart(g, data, config, chartWidth, chartHeight, colors);
          break;
        case 'area':
          console.log('Rendering area chart');
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
            .style('fill', '#6b7280')
            .text(`Chart type "${config.type}" wordt nog niet ondersteund`);
      }

      // Add title
      if (config.title) {
        console.log('Adding title:', config.title);
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', 25)
          .attr('text-anchor', 'middle')
          .style('font-size', '18px')
          .style('font-weight', '600')
          .style('fill', '#333333')
          .text(config.title);
      }

      // Add subtitle
      if (config.subtitle) {
        console.log('Adding subtitle:', config.subtitle);
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', 45)
          .attr('text-anchor', 'middle')
          .style('font-size', '14px')
          .style('fill', '#666666')
          .text(config.subtitle);
      }
      
      console.log('=== CHART RENDERING COMPLETED ===');
      console.log('Chart ID:', config.id, 'rendered successfully');
    } catch (error) {
      console.error('=== CHART RENDERING ERROR ===');
      console.error('Chart ID:', config.id);
      console.error('Error:', error);
      console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Switch to fallback instead of showing error in chart
      setUseFallback(true);
      throw error; // Re-throw to trigger useEffect fallback
    }
  };

  const getChartColors = (colorConfig: ChartConfig['colors']): string[] => {
    // Define consistent, professional color palette
    const defaultColors = [
      '#2563eb', // blue
      '#dc2626', // red  
      '#059669', // green
      '#d97706', // orange
      '#7c3aed', // purple
      '#0891b2', // cyan
      '#ea580c', // orange-600
      '#65a30d'  // lime
    ];
    
    const highlightColors = [
      '#dc2626', // red
      '#ea580c', // orange
      '#d97706', // amber
      '#65a30d'  // lime
    ];
    
    switch (colorConfig?.palette) {
      case 'highlight':
        return highlightColors;
      case 'custom':
        return colorConfig.customColors || defaultColors;
      default:
        return defaultColors;
    }
  };

  const renderLineChart = (g: any, data: any[], config: ChartConfig, width: number, height: number, colors: string[]) => {
    console.log('=== LINE CHART RENDERING ===');
    console.log('Data:', data);
    console.log('Config:', config);
    
    if (!config.xAxis || !config.yAxis) {
      console.error('Missing axis configuration for line chart');
      throw new Error('Missing axis configuration');
    }

    if (!data || data.length === 0) {
      console.error('No data available for line chart');
      throw new Error('No data available');
    }

    console.log('X field:', config.xAxis.field);
    console.log('Y field:', config.yAxis.field);

    // Validate that the fields exist in the data
    const firstItem = data[0];
    if (!(config.xAxis.field in firstItem) || !(config.yAxis.field in firstItem)) {
      const error = `Fields not found in data. Available fields: ${Object.keys(firstItem).join(', ')}`;
      console.error(error);
      throw new Error(error);
    }

    // For line charts, use point scale for X axis to position points correctly
    const xScale = d3.scalePoint()
      .domain(data.map(d => String(d[config.xAxis!.field])))
      .range([0, width])
      .padding(0.1);

    const yValues = data.map(d => Number(d[config.yAxis!.field]));
    const yMin = d3.min(yValues) || 0;
    const yMax = d3.max(yValues) || 0;
    
    const yScale = d3.scaleLinear()
      .domain([Math.min(0, yMin), yMax])
      .nice()
      .range([height, 0]);

    console.log('Scales created successfully');

    // Add grid if enabled
    if (config.grid?.show) {
      const yGrid = g.append('g')
        .attr('class', 'grid');
      
      yGrid.call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''))
        .selectAll('line')
        .style('stroke', '#e5e7eb')
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('opacity', 0.7);
        
      yGrid.selectAll('path').style('display', 'none');
    }

    // Add axes
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height})`);
    
    xAxis.call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#374151');
      
    xAxis.selectAll('path, line')
      .style('stroke', '#6b7280');

    const yAxis = g.append('g');
    
    yAxis.call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#374151');
      
    yAxis.selectAll('path, line')
      .style('stroke', '#6b7280');

    // Add axis labels
    if (config.xAxis.label) {
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#374151')
        .text(config.xAxis.label);
    }

    if (config.yAxis.label) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#374151')
        .text(config.yAxis.label);
    }

    // Create line path
    const line = d3.line<any>()
      .x(d => xScale(String(d[config.xAxis!.field]))!)
      .y(d => yScale(Number(d[config.yAxis!.field])));

    if (config.lines?.smooth) {
      line.curve(d3.curveCardinal);
    }

    // Add line
    const path = g.append('path')
      .datum(data)
      .attr('class', 'chart-line')
      .attr('fill', 'none')
      .attr('stroke', colors[0])
      .attr('stroke-width', config.lines?.width || 3)
      .attr('stroke-dasharray', config.lines?.style === 'dashed' ? '5,5' : 'none')
      .attr('d', line);

    // Add dots
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', (d: any) => xScale(String(d[config.xAxis!.field]))!)
      .attr('cy', (d: any) => yScale(Number(d[config.yAxis!.field])))
      .attr('r', 4)
      .attr('fill', colors[0])
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    console.log('Line chart rendering completed');
  };

  const renderBarChart = (g: any, data: any[], config: ChartConfig, width: number, height: number, colors: string[]) => {
    console.log('=== BAR CHART RENDERING ===');
    console.log('Data:', data);
    console.log('Config:', config);
    
    if (!config.xAxis || !config.yAxis) {
      console.error('Missing axis configuration for bar chart');
      throw new Error('Missing axis configuration');
    }

    if (!data || data.length === 0) {
      console.error('No data available for bar chart');
      throw new Error('No data available');
    }

    // Validate that the fields exist in the data
    const firstItem = data[0];
    if (!(config.xAxis.field in firstItem) || !(config.yAxis.field in firstItem)) {
      const error = `Fields not found in data. Available fields: ${Object.keys(firstItem).join(', ')}`;
      console.error(error);
      throw new Error(error);
    }

    const xScale = d3.scaleBand()
      .domain(data.map(d => String(d[config.xAxis!.field])))
      .range([0, width])
      .padding(config.bar?.spacing || 0.1);

    const yValues = data.map(d => Number(d[config.yAxis!.field]));
    const yMax = d3.max(yValues) || 0;
    
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([height, 0]);

    console.log('Scales created successfully');

    // Add grid if enabled
    if (config.grid?.show) {
      const yGrid = g.append('g')
        .attr('class', 'grid');
      
      yGrid.call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''))
        .selectAll('line')
        .style('stroke', '#e5e7eb')
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('opacity', 0.7);
        
      yGrid.selectAll('path').style('display', 'none');
    }

    // Add axes
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height})`);
    
    xAxis.call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#374151');
      
    xAxis.selectAll('path, line')
      .style('stroke', '#6b7280');

    const yAxis = g.append('g');
    
    yAxis.call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#374151');
      
    yAxis.selectAll('path, line')
      .style('stroke', '#6b7280');

    // Add axis labels
    if (config.xAxis.label) {
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#374151')
        .text(config.xAxis.label);
    }

    if (config.yAxis.label) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#374151')
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
      .attr('fill', (_, i) => colors[i % colors.length])
      .attr('rx', config.bar?.borderRadius || 0);

    console.log('Bar chart rendering completed');
  };

  const renderPieChart = (g: any, data: any[], config: ChartConfig, width: number, height: number, colors: string[]) => {
    console.log('=== PIE CHART RENDERING ===');
    console.log('Data:', data);
    console.log('Config:', config);
    
    if (!data || data.length === 0) {
      console.error('No data available for pie chart');
      throw new Error('No data available');
    }

    const radius = Math.min(width, height) / 2 - 40;
    const centerX = width / 2;
    const centerY = height / 2;

    // For pie charts, we expect data with 'label' and 'value' fields, or use the first two fields
    const keys = Object.keys(data[0] || {});
    const labelField = keys[0];
    const valueField = keys[1];

    console.log('Using fields:', { labelField, valueField });

    // Transform data to ensure we have numeric values
    const processedData = data.map(d => ({
      ...d,
      [valueField]: Number(d[valueField]) || 0
    }));

    const pie = d3.pie<any>()
      .value(d => d[valueField])
      .sort(config.pie?.sortByValue ? null : d3.ascending);

    const arc = d3.arc<any>()
      .innerRadius(config.pie?.innerRadius ? radius * config.pie.innerRadius : 0)
      .outerRadius(radius)
      .padAngle(config.pie?.padAngle || 0)
      .cornerRadius(config.pie?.cornerRadius || 0);

    const pieData = pie(processedData);

    // Move group to center
    g.attr('transform', `translate(${centerX},${centerY})`);

    const slices = g.selectAll('.slice')
      .data(pieData)
      .enter().append('g')
      .attr('class', 'slice');

    // Add slice paths
    slices.append('path')
      .attr('d', arc)
      .attr('fill', (_: any, i: number) => colors[i % colors.length])
      .style('opacity', 0.9)
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Add labels if slices are big enough
    const total = d3.sum(processedData, (d: any) => d[valueField]);
    slices.append('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', 'white')
      .style('text-shadow', '0 1px 2px rgba(0,0,0,0.6)')
      .text((d: any) => {
        const percentage = ((d.data[valueField] / total) * 100).toFixed(1);
        return percentage > 5 ? `${percentage}%` : '';
      });

    // Add legend if configured
    if (config.legend?.show && config.legend.position === 'right') {
      const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${radius + 30}, ${-radius})`);

      const legendItems = legend.selectAll('.legend-item')
        .data(pieData)
        .enter().append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d: any, i: number) => `translate(0, ${i * 25})`);

      legendItems.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', (d: any, i: number) => colors[i % colors.length]);

      legendItems.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('fill', '#374151')
        .text((d: any) => d.data[labelField]);
    }

    console.log('Pie chart rendering completed');
  };

  const renderAreaChart = (g: any, data: any[], config: ChartConfig, width: number, height: number, colors: string[]) => {
    if (!config.xAxis || !config.yAxis) {
      throw new Error('Missing axis configuration');
    }

    if (!data || data.length === 0) {
      throw new Error('No data available');
    }

    const xScale = d3.scalePoint()
      .domain(data.map(d => String(d[config.xAxis!.field])))
      .range([0, width])
      .padding(0.1);

    const yValues = data.map(d => Number(d[config.yAxis!.field]));
    const yMax = d3.max(yValues) || 0;

    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([height, 0]);

    // Add axes
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height})`);
    
    xAxis.call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#374151');

    const yAxis = g.append('g');
    yAxis.call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#374151');

    // Create area path
    const area = d3.area<any>()
      .x(d => xScale(String(d[config.xAxis!.field]))!)
      .y0(height)
      .y1(d => yScale(Number(d[config.yAxis!.field])));

    // Add area
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
          <div className="chart-loading-spinner mx-auto mb-4"></div>
          <p className="text-muted-foreground">Grafiek laden...</p>
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

  // Use fallback chart if D3 fails or explicitly requested
  if (useFallback && config && data.length > 0) {
    return (
      <div ref={containerRef} className={`chart-container ${className}`}>
        <FallbackChart 
          config={config}
          data={data}
          width={width}
          height={height}
        />
        
        <div className="mt-4 flex gap-2">
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
    );
  }

  return (
    <div ref={containerRef} className={`chart-container ${className}`}>
      <Card className="p-6">
        <div className="chart-container">
          <div style={{ width: width, height: height }}>
            <svg
              ref={svgRef}
              width={width}
              height={height}
              className="w-full h-full"
              style={{ 
                display: 'block', 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb'
              }}
            />
          </div>
          
          {config?.footer && (
            <div className="mt-4 text-sm text-muted-foreground space-y-1">
              {config.footer.text && <p>{config.footer.text}</p>}
              {config.footer.source && <p><strong>Bron:</strong> {config.footer.source}</p>}
              {config.footer.notes && config.footer.notes.map((note, index) => (
                <p key={index}>• {note}</p>
              ))}
            </div>
          )}
          
          <div className="chart-action-buttons mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCSV}
              className="flex items-center gap-2 mr-2"
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
    </div>
  );
}