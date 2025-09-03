import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card } from '@/components/ui/card';

export function DirectChartTest() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    console.log('DirectChartTest: Starting render');

    // Test data that mimics our actual data structure
    const testData = [
      { month: 'Juli', visitors: 15420 },
      { month: 'Augustus', visitors: 18350 },
      { month: 'September', visitors: 21180 }
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    console.log('DirectChartTest: SVG dimensions', { width, height, chartWidth, chartHeight });

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add chart background to verify positioning
    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('fill', 'rgba(255,255,255,0.5)')
      .attr('stroke', '#ccc')
      .attr('stroke-dasharray', '2,2');

    // Create scales (mimicking line chart)
    const xScale = d3.scalePoint()
      .domain(testData.map(d => d.month))
      .range([0, chartWidth])
      .padding(0.1);

    const yExtent = d3.extent(testData, d => d.visitors) as [number, number];
    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .nice()
      .range([chartHeight, 0]);

    console.log('DirectChartTest: Scales created');
    console.log('X domain:', xScale.domain());
    console.log('Y domain:', yScale.domain());

    // Add axes
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${chartHeight})`);
    
    xAxis.call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#374151');

    const yAxis = g.append('g');
    yAxis.call(d3.axisLeft(yScale).tickFormat(d3.format('#,###')))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#374151');

    // Create line path
    const line = d3.line<any>()
      .x(d => xScale(d.month)!)
      .y(d => yScale(d.visitors));

    // Add line
    const path = g.append('path')
      .datum(testData)
      .attr('class', 'chart-line')
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', line);

    console.log('DirectChartTest: Line path created');

    // Add dots
    const dots = g.selectAll('.dot')
      .data(testData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.month)!)
      .attr('cy', d => yScale(d.visitors))
      .attr('r', 4)
      .attr('fill', '#3b82f6');

    console.log('DirectChartTest: Dots created, count:', dots.size());

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', '600')
      .style('fill', '#333333')
      .text('Direct Chart Test - Monthly Visitors');

    console.log('DirectChartTest: Rendering completed successfully');
  }, []);

  return (
    <Card className="p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4">Direct Chart Test</h3>
      <div style={{ width: 800, height: 400 }}>
        <svg
          ref={svgRef}
          width={800}
          height={400}
          style={{ 
            border: '1px solid #d1d5db',
            backgroundColor: '#f9fafb',
            display: 'block'
          }}
        />
      </div>
    </Card>
  );
}