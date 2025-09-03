// Chart configuration types for detailed chart customization
export interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar' | 'heatmap' | 'treemap' | 'timeline' | 'gauge';
  title: string;
  subtitle?: string;
  description?: string;
  
  // Data configuration
  dataSource: string; // Path to CSV file
  xAxis?: {
    field: string;
    label?: string;
    type?: 'category' | 'linear' | 'time';
    format?: string;
    rotation?: number;
  };
  yAxis?: {
    field: string;
    label?: string;
    type?: 'linear' | 'log';
    format?: string;
    min?: number;
    max?: number;
    tickCount?: number;
  };

  // Visual styling
  colors: {
    palette: 'default' | 'highlight' | 'custom';
    customColors?: string[];
    gradients?: boolean;
  };
  
  lines?: {
    style: 'solid' | 'dashed' | 'dotted';
    width?: number;
    smooth?: boolean;
    projection?: {
      enabled: boolean;
      style: 'dashed' | 'dotted';
      color?: string;
    };
  };

  areas?: {
    opacity?: number;
    pattern?: 'none' | 'diagonal' | 'horizontal' | 'vertical' | 'crosshatch';
  };

  // Chart elements
  legend: {
    show: boolean;
    position: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
  };
  
  grid: {
    show: boolean;
    color?: string;
    style?: 'solid' | 'dashed';
  };

  tooltip: {
    show: boolean;
    format?: string;
    backgroundColor?: string;
  };

  // Chart specific options
  pie?: {
    labelField?: string;
    valueField?: string;
    innerRadius?: number;
    padAngle?: number;
    cornerRadius?: number;
    sortByValue?: boolean;
  };

  bar?: {
    borderRadius?: number;
    spacing?: number;
    orientation?: 'vertical' | 'horizontal';
  };

  // Footer and annotations
  footer?: {
    text?: string;
    source?: string;
    notes?: string[];
  };

  // Responsive behavior
  responsive?: {
    breakpoints?: {
      mobile?: Partial<ChartConfig>;
      tablet?: Partial<ChartConfig>;
    };
  };

  // Animation settings
  animation?: {
    duration?: number;
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    delay?: number;
  };
}

// Pre-defined color palettes
export const colorPalettes = {
  default: [
    'var(--chart-primary)',
    'var(--chart-secondary)', 
    'var(--chart-tertiary)',
    'var(--chart-quaternary)',
    'var(--chart-quinary)'
  ],
  highlight: [
    'oklch(0.45 0.15 240)', // Strong blue
    'oklch(0.65 0.12 200)', // Teal accent
    'oklch(0.55 0.08 250)', // Purple
    'oklch(0.75 0.06 230)', // Light blue
    'oklch(0.35 0.12 220)'  // Dark blue
  ],
  warm: [
    'oklch(0.65 0.15 30)',  // Orange
    'oklch(0.55 0.12 60)',  // Yellow-orange
    'oklch(0.75 0.08 45)',  // Light orange
    'oklch(0.45 0.18 15)',  // Red-orange
    'oklch(0.85 0.05 50)'   // Pale yellow
  ],
  cool: [
    'oklch(0.45 0.15 200)', // Teal
    'oklch(0.35 0.12 240)', // Blue
    'oklch(0.55 0.10 180)', // Cyan
    'oklch(0.65 0.08 220)', // Light blue
    'oklch(0.25 0.15 260)'  // Dark blue
  ]
};