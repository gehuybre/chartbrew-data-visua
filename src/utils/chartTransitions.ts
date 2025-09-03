import * as d3 from 'd3';

export interface TransitionConfig {
  duration?: number;
  delay?: number;
  ease?: any;
  stagger?: number;
}

export class ChartTransitionManager {
  private static instance: ChartTransitionManager;
  private activeTransitions: Map<string, d3.Transition<any, any, any, any>> = new Map();

  private constructor() {}

  static getInstance(): ChartTransitionManager {
    if (!ChartTransitionManager.instance) {
      ChartTransitionManager.instance = new ChartTransitionManager();
    }
    return ChartTransitionManager.instance;
  }

  // Create a smooth transition with default settings
  createTransition(
    selection: d3.Selection<any, any, any, any>,
    config: TransitionConfig = {}
  ): d3.Transition<any, any, any, any> {
    const {
      duration = 750,
      delay = 0,
      ease = d3.easeQuadInOut,
      stagger = 0
    } = config;

    return selection
      .transition()
      .duration(duration)
      .delay((d, i) => delay + i * stagger)
      .ease(ease);
  }

  // Animate bars growing from bottom
  animateBars(
    bars: d3.Selection<any, any, any, any>,
    yScale: d3.ScaleLinear<number, number>,
    height: number,
    yField: string,
    config: TransitionConfig = {}
  ) {
    const { duration = 750, stagger = 50 } = config;

    bars
      .attr('y', height)
      .attr('height', 0)
      .transition()
      .duration(duration)
      .delay((d, i) => i * stagger)
      .ease(d3.easeElastic.period(0.3))
      .attr('y', (d: any) => yScale(Number(d[yField])))
      .attr('height', (d: any) => height - yScale(Number(d[yField])));
  }

  // Animate line drawing
  animateLinePath(
    path: d3.Selection<any, any, any, any>,
    isDashed: boolean = false,
    config: TransitionConfig = {}
  ) {
    const { duration = 1000, delay = 300 } = config;
    
    const totalLength = path.node()?.getTotalLength() || 0;
    
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(duration)
      .delay(delay)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
      .on('end', function() {
        // Reset dash array unless the line should be dashed
        if (!isDashed) {
          d3.select(this).attr('stroke-dasharray', null);
        } else {
          d3.select(this).attr('stroke-dasharray', '5,5');
        }
      });
  }

  // Animate dots appearing
  animateDots(
    dots: d3.Selection<any, any, any, any>,
    config: TransitionConfig = {}
  ) {
    const { duration = 400, stagger = 75, delay = 500 } = config;

    dots
      .attr('r', 0)
      .style('opacity', 0)
      .transition()
      .duration(duration)
      .delay((d, i) => delay + i * stagger)
      .ease(d3.easeBackOut.overshoot(1.7))
      .attr('r', 4)
      .style('opacity', 0.8);
  }

  // Animate pie slices
  animatePieSlices(
    paths: d3.Selection<any, any, any, any>,
    arc: d3.Arc<any, any>,
    config: TransitionConfig = {}
  ) {
    const { duration = 800, stagger = 100 } = config;

    paths
      .attr('d', arc)
      .style('opacity', 0)
      .transition()
      .duration(duration)
      .delay((d, i) => i * stagger)
      .style('opacity', 0.9)
      .attrTween('d', function(d: any) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });
  }

  // Animate area chart
  animateArea(
    path: d3.Selection<any, any, any, any>,
    width: number,
    height: number,
    chartId: string,
    config: TransitionConfig = {}
  ) {
    const { duration = 750, delay = 300 } = config;

    // Create clip path for reveal animation
    const clipId = `area-clip-${chartId}`;
    const clipPath = path.select('defs').empty() 
      ? path.append('defs') 
      : path.select('defs');
    
    clipPath
      .append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('width', width)
      .attr('height', 0)
      .attr('y', height);

    path.attr('clip-path', `url(#${clipId})`);

    // Animate clip path to reveal area
    clipPath.select('rect')
      .transition()
      .duration(duration)
      .delay(delay)
      .ease(d3.easeQuadOut)
      .attr('height', height)
      .attr('y', 0);
  }

  // Smooth data update transitions
  updateData(
    selection: d3.Selection<any, any, any, any>,
    newData: any[],
    config: TransitionConfig = {}
  ) {
    const { duration = 500 } = config;

    // Handle enter, update, and exit
    const update = selection.selectAll('.data-element').data(newData);
    
    // Exit - fade out removed elements
    update.exit()
      .transition()
      .duration(duration / 2)
      .style('opacity', 0)
      .remove();

    // Enter - fade in new elements
    const enter = update.enter()
      .append('g')
      .attr('class', 'data-element')
      .style('opacity', 0);

    // Update - transition existing elements
    update.merge(enter)
      .transition()
      .duration(duration)
      .style('opacity', 1);

    return update.merge(enter);
  }

  // Clean up transitions for a specific chart
  cleanup(chartId: string) {
    this.activeTransitions.delete(chartId);
  }

  // Cancel all active transitions
  cancelAll() {
    this.activeTransitions.forEach(transition => {
      transition.interrupt();
    });
    this.activeTransitions.clear();
  }
}

// Easing functions for different chart types
export const chartEasing = {
  bars: d3.easeElastic.period(0.3),
  lines: d3.easeLinear,
  dots: d3.easeBackOut.overshoot(1.7),
  pie: d3.easeCubicInOut,
  area: d3.easeQuadOut,
  default: d3.easeQuadInOut
};

// Common animation durations
export const animationDurations = {
  fast: 300,
  normal: 500,
  slow: 750,
  lineDrawing: 1000,
  dataUpdate: 400
};

// Stagger delays for different elements
export const staggerDelays = {
  bars: 50,
  dots: 75,
  pieSlices: 100,
  legendItems: 100,
  gridLines: 25
};