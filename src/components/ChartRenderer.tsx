import { useEffect, useRef, useState } from 'react';
import { ChartConfig, colorPalettes } from '../types/chartConfig';
import { loadChartConfig, loadCSVData } from '../data/reportLoader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Code, FileBarChart } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useChartAnimation } from '../hooks/useChartAnimation';
import { ChartTransitionManager, animationDurations, staggerDelays } from '../utils/chartTransitions';
import * as d3 from 'd3';

// Animation constants
const ANIMATION_DURATION = animationDurations.slow;
const STAGGER_DELAY = staggerDelays.bars;
const HOVER_DURATION = animationDurations.fast;

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
  
  // Use animation hook for viewport-based animations
  const { ref: containerRef, isVisible } = useChartAnimation({
    threshold: 0.2,
    delay: 200
  });

  // Get transition manager instance
  const transitionManager = ChartTransitionManager.getInstance();

  useEffect(() => {
    loadChart();
    
    // Cleanup function
    return () => {
      if (config?.id) {
        transitionManager.cleanup(config.id);
      }
    };
  }, [configPath]);

  useEffect(() => {
    if (config && data.length > 0 && isVisible) {
      renderChart(config, data);
    }
  }, [config, data, width, height, isVisible]);

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
    
    // Smooth transition for clearing existing chart
    svg.selectAll('*')
      .transition()
      .duration(ANIMATION_DURATION / 2)
      .style('opacity', 0)
      .remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .style('opacity', 0);

    // Animate main container in
    g.transition()
      .duration(ANIMATION_DURATION / 2)
      .delay(ANIMATION_DURATION / 2)
      .style('opacity', 1);

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

      // Add title with fade-in animation
      if (config.title) {
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', 25)
          .attr('text-anchor', 'middle')
          .style('font-size', '18px')
          .style('font-weight', '600')
          .style('fill', 'var(--foreground)')
          .style('opacity', 0)
          .text(config.title)
          .transition()
          .duration(ANIMATION_DURATION)
          .delay(ANIMATION_DURATION / 3)
          .style('opacity', 1);
      }

      // Add subtitle with fade-in animation
      if (config.subtitle) {
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', 45)
          .attr('text-anchor', 'middle')
          .style('font-size', '14px')
          .style('fill', 'var(--muted-foreground)')
          .style('opacity', 0)
          .text(config.subtitle)
          .transition()
          .duration(ANIMATION_DURATION)
          .delay(ANIMATION_DURATION / 2)
          .style('opacity', 1);
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

    // Add grid if enabled with fade-in animation
    if (config.grid?.show) {
      const xGrid = g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .style('opacity', 0);
      
      xGrid.transition()
        .duration(ANIMATION_DURATION)
        .delay(ANIMATION_DURATION / 4)
        .style('opacity', 0.3);
      
      xGrid.call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''))
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('stroke', config.grid.color || 'var(--border)');

      const yGrid = g.append('g')
        .attr('class', 'grid')
        .style('opacity', 0);
      
      yGrid.transition()
        .duration(ANIMATION_DURATION)
        .delay(ANIMATION_DURATION / 4)
        .style('opacity', 0.3);
      
      yGrid.call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''))
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('stroke', config.grid.color || 'var(--border)');
    }

    // Add axes with slide-in animation
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .style('opacity', 0);
    
    xAxis.transition()
      .duration(ANIMATION_DURATION)
      .delay(ANIMATION_DURATION / 3)
      .style('opacity', 1);
    
    xAxis.call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'var(--foreground)');

    const yAxis = g.append('g')
      .style('opacity', 0);
    
    yAxis.transition()
      .duration(ANIMATION_DURATION)
      .delay(ANIMATION_DURATION / 3)
      .style('opacity', 1);
    
    yAxis.call(d3.axisLeft(yScale).tickFormat(d3.format(config.yAxis.format || '')))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'var(--foreground)');

    // Add axis labels with fade-in
    if (config.xAxis.label) {
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'var(--foreground)')
        .style('opacity', 0)
        .text(config.xAxis.label)
        .transition()
        .duration(ANIMATION_DURATION)
        .delay(ANIMATION_DURATION / 2)
        .style('opacity', 1);
    }

    if (config.yAxis.label) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'var(--foreground)')
        .style('opacity', 0)
        .text(config.yAxis.label)
        .transition()
        .duration(ANIMATION_DURATION)
        .delay(ANIMATION_DURATION / 2)
        .style('opacity', 1);
    }

    // Create line path
    const line = d3.line<any>()
      .x(d => xScale(String(d[config.xAxis!.field]))! + xScale.bandwidth() / 2)
      .y(d => yScale(Number(d[config.yAxis!.field])));

    if (config.lines?.smooth) {
      line.curve(d3.curveCardinal);
    }

    // Add line with drawing animation using transition manager
    const path = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colors[0])
      .attr('stroke-width', config.lines?.width || 2)
      .attr('stroke-dasharray', config.lines?.style === 'dashed' ? '5,5' : 'none')
      .attr('d', line);

    // Use transition manager for line animation
    transitionManager.animateLinePath(
      path, 
      config.lines?.style === 'dashed',
      {
        duration: ANIMATION_DURATION * 1.5,
        delay: ANIMATION_DURATION / 2
      }
    );

    // Add dots with transition manager
    const dots = g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', (d: any) => xScale(String(d[config.xAxis!.field]))! + xScale.bandwidth() / 2)
      .attr('cy', (d: any) => yScale(Number(d[config.yAxis!.field])))
      .attr('fill', colors[0]);

    // Use transition manager for dots animation
    transitionManager.animateDots(dots, {
      duration: animationDurations.normal,
      stagger: staggerDelays.dots,
      delay: ANIMATION_DURATION
    });

    // Add hover interactions with smooth transitions
    dots
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(HOVER_DURATION)
          .attr('r', 6)
          .style('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(HOVER_DURATION)
          .attr('r', 4)
          .style('opacity', 0.8);
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

    // Add grid if enabled with fade-in animation
    if (config.grid?.show) {
      const xGrid = g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .style('opacity', 0);
      
      xGrid.transition()
        .duration(ANIMATION_DURATION)
        .delay(ANIMATION_DURATION / 4)
        .style('opacity', 0.3);
      
      xGrid.call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''))
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('stroke', config.grid.color || 'var(--border)');

      const yGrid = g.append('g')
        .attr('class', 'grid')
        .style('opacity', 0);
      
      yGrid.transition()
        .duration(ANIMATION_DURATION)
        .delay(ANIMATION_DURATION / 4)
        .style('opacity', 0.3);
      
      yGrid.call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''))
        .style('stroke-dasharray', config.grid.style === 'dashed' ? '3,3' : 'none')
        .style('stroke', config.grid.color || 'var(--border)');
    }

    // Add axes with slide-in animation
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .style('opacity', 0);
    
    xAxis.transition()
      .duration(ANIMATION_DURATION)
      .delay(ANIMATION_DURATION / 3)
      .style('opacity', 1);
    
    xAxis.call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', 'var(--foreground)')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', `rotate(${config.xAxis.rotation || -45})`);

    const yAxis = g.append('g')
      .style('opacity', 0);
    
    yAxis.transition()
      .duration(ANIMATION_DURATION)
      .delay(ANIMATION_DURATION / 3)
      .style('opacity', 1);
    
    yAxis.call(d3.axisLeft(yScale).tickFormat(d3.format(config.yAxis.format || '')))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'var(--foreground)');

    // Add axis labels with fade-in
    if (config.xAxis.label) {
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'var(--foreground)')
        .style('opacity', 0)
        .text(config.xAxis.label)
        .transition()
        .duration(ANIMATION_DURATION)
        .delay(ANIMATION_DURATION / 2)
        .style('opacity', 1);
    }

    if (config.yAxis.label) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'var(--foreground)')
        .style('opacity', 0)
        .text(config.yAxis.label)
        .transition()
        .duration(ANIMATION_DURATION)
        .delay(ANIMATION_DURATION / 2)
        .style('opacity', 1);
    }

    // Add bars with enhanced transition manager
    const bars = g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => xScale(String(d[config.xAxis!.field]))!)
      .attr('width', xScale.bandwidth())
      .attr('fill', colors[0])
      .attr('rx', config.bar?.borderRadius || 0)
      .style('opacity', 0.8);

    // Use transition manager for bar animation
    transitionManager.animateBars(
      bars,
      yScale,
      height,
      config.yAxis!.field,
      { 
        duration: ANIMATION_DURATION,
        stagger: staggerDelays.bars
      }
    );

    // Add hover interactions with smooth transitions
    bars
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(HOVER_DURATION)
          .style('opacity', 1)
          .attr('transform', 'scale(1.02)');
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(HOVER_DURATION)
          .style('opacity', 0.8)
          .attr('transform', 'scale(1)');
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

    // Add slice paths
    const paths = slices.append('path')
      .attr('fill', (_: any, i: number) => colors[i % colors.length])
      .style('opacity', 0.9);

    // Use transition manager for pie slice animation
    transitionManager.animatePieSlices(paths, arc, {
      duration: ANIMATION_DURATION,
      stagger: staggerDelays.pieSlices
    });

    // Add hover interactions with smooth scaling
    paths
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(HOVER_DURATION)
          .style('opacity', 1)
          .attr('transform', 'scale(1.05)');
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(HOVER_DURATION)
          .style('opacity', 0.9)
          .attr('transform', 'scale(1)');
      });

    // Add labels with fade-in animation
    const labels = slices.append('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', 'white')
      .style('text-shadow', '0 1px 2px rgba(0,0,0,0.6)')
      .style('opacity', 0)
      .text((d: any) => {
        const percentage = ((d.data[valueField] / d3.sum(data, d => d[valueField])) * 100).toFixed(1);
        return percentage > 5 ? `${percentage}%` : ''; // Only show label if slice is big enough
      });

    // Animate labels appearing
    labels.transition()
      .duration(ANIMATION_DURATION / 2)
      .delay(ANIMATION_DURATION)
      .style('opacity', 1);

    // Add legend if enabled with staggered animation
    if (config.legend?.show && config.legend.position === 'right') {
      const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${radius + 30}, ${-radius})`);

      const legendItems = legend.selectAll('.legend-item')
        .data(pieData)
        .enter().append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 25})`)
        .style('opacity', 0);

      // Animate legend items
      legendItems.transition()
        .duration(ANIMATION_DURATION / 2)
        .delay((d, i) => ANIMATION_DURATION + i * STAGGER_DELAY)
        .style('opacity', 1);

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

    // Add axes with slide-in animation
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .style('opacity', 0);
    
    xAxis.transition()
      .duration(ANIMATION_DURATION)
      .delay(ANIMATION_DURATION / 3)
      .style('opacity', 1);
    
    xAxis.call(d3.axisBottom(xScale));

    const yAxis = g.append('g')
      .style('opacity', 0);
    
    yAxis.transition()
      .duration(ANIMATION_DURATION)
      .delay(ANIMATION_DURATION / 3)
      .style('opacity', 1);
    
    yAxis.call(d3.axisLeft(yScale).tickFormat(d3.format(config.yAxis.format || '')));

    // Create area path
    const area = d3.area<any>()
      .x(d => xScale(d[config.xAxis!.field])! + xScale.bandwidth() / 2)
      .y0(height)
      .y1(d => yScale(d[config.yAxis!.field]));

    // Add area with animation from bottom
    const areaPath = g.append('path')
      .datum(data)
      .attr('fill', colors[0])
      .attr('fill-opacity', config.areas?.opacity || 0.7)
      .attr('d', area);

    // Animate area growing from bottom
    const clipPath = g.append('defs')
      .append('clipPath')
      .attr('id', `area-clip-${config.id}`)
      .append('rect')
      .attr('width', width)
      .attr('height', 0)
      .attr('y', height);

    areaPath.attr('clip-path', `url(#area-clip-${config.id})`);

    clipPath.transition()
      .duration(ANIMATION_DURATION)
      .delay(ANIMATION_DURATION / 2)
      .ease(d3.easeQuadOut)
      .attr('height', height)
      .attr('y', 0);
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

  return (
    <div ref={containerRef}>
      <Card className={`p-6 ${className} ${isVisible ? 'animate-in' : 'opacity-0'}`}>
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
          
          <div className="chart-action-buttons mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCSV}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <Download size={16} />
              Download CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={copyIframeCode}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
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