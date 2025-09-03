import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export function SimpleChartTest() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Simple test data
    const data = [
      { x: 'A', y: 10 },
      { x: 'B', y: 20 },
      { x: 'C', y: 15 },
      { x: 'D', y: 25 }
    ];

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.x))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) || 0])
      .range([chartHeight, 0]);

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.x) || 0)
      .attr('y', d => yScale(d.y))
      .attr('width', xScale.bandwidth())
      .attr('height', d => chartHeight - yScale(d.y))
      .attr('fill', '#3b82f6');

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .call(d3.axisLeft(yScale));

    console.log('Simple chart test completed successfully');
  }, []);

  return (
    <div className="border border-border rounded p-4">
      <h3 className="mb-4">D3 Test Chart</h3>
      <svg
        ref={svgRef}
        width={400}
        height={300}
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
}