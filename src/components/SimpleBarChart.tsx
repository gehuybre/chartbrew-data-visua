import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card } from '@/components/ui/card';

interface SimpleBarChartProps {
  data: Array<{ label: string; value: number }>;
  width?: number;
  height?: number;
}

export function SimpleBarChart({ data, width = 400, height = 300 }: SimpleBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) {
      console.log('SimpleBarChart: No SVG ref or data');
      return;
    }

    console.log('SimpleBarChart: Rendering with data:', data);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([chartHeight, 0]);

    console.log('SimpleBarChart: Scales created');
    console.log('X domain:', xScale.domain());
    console.log('Y domain:', yScale.domain());

    // Add bars
    const bars = g.selectAll('.simple-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'simple-bar')
      .attr('x', d => xScale(d.label) || 0)
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => chartHeight - yScale(d.value))
      .attr('fill', '#3b82f6')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 1);

    console.log('SimpleBarChart: Bars created, count:', bars.size());

    // Add axes
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale));

    const yAxis = g.append('g')
      .call(d3.axisLeft(yScale));

    // Style axes
    xAxis.selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#374151');

    yAxis.selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#374151');

    xAxis.selectAll('path, line')
      .style('stroke', '#6b7280');

    yAxis.selectAll('path, line')
      .style('stroke', '#6b7280');

    console.log('SimpleBarChart: Rendering completed successfully');
  }, [data, width, height]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Simple Bar Chart Test</h3>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ 
          border: '1px solid #d1d5db',
          backgroundColor: '#f9fafb',
          display: 'block'
        }}
      />
    </Card>
  );
}

// Test data
export const testBarData = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
  { label: 'C', value: 15 },
  { label: 'D', value: 25 }
];

export const testLineData = [
  { month: 'Jan', visitors: 1000 },
  { month: 'Feb', visitors: 1500 },
  { month: 'Mar', visitors: 1200 },
  { month: 'Apr', visitors: 1800 }
];