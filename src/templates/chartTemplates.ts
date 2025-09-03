import { ChartTemplateConfig } from './reportTemplate';

/**
 * Chart Configuration Templates
 * 
 * Predefined chart configurations for consistent styling and behavior
 */

export interface ChartTheme {
  name: string;
  description: string;
  colors: {
    primary: string[];
    highlight: string[];
    monochrome: string[];
    categorical: string[];
  };
  styles: {
    lineWidth: number;
    pointRadius: number;
    gridOpacity: number;
    fontFamily: string;
    fontSize: number;
  };
}

/**
 * Default chart themes based on the application's design system
 */
export const chartThemes: Record<string, ChartTheme> = {
  default: {
    name: 'Standaard',
    description: 'De standaard kleurenpallet van ChartBrew',
    colors: {
      primary: [
        'oklch(0.45 0.15 240)', // Primary blue
        'oklch(0.65 0.12 200)', // Secondary blue
        'oklch(0.55 0.08 250)', // Tertiary blue
        'oklch(0.75 0.06 230)', // Light blue
        'oklch(0.35 0.12 220)'  // Dark blue
      ],
      highlight: [
        'oklch(0.45 0.15 240)', // Primary
        'oklch(0.65 0.12 30)',  // Orange highlight
        'oklch(0.55 0.12 120)', // Green highlight
        'oklch(0.55 0.12 300)', // Purple highlight
        'oklch(0.65 0.12 60)'   // Yellow highlight
      ],
      monochrome: [
        'oklch(0.25 0.08 240)', // Dark
        'oklch(0.45 0.08 240)', // Medium dark
        'oklch(0.65 0.08 240)', // Medium
        'oklch(0.75 0.08 240)', // Medium light
        'oklch(0.85 0.08 240)'  // Light
      ],
      categorical: [
        'oklch(0.45 0.15 240)', // Blue
        'oklch(0.55 0.12 120)', // Green
        'oklch(0.65 0.12 30)',  // Orange
        'oklch(0.55 0.12 300)', // Purple
        'oklch(0.65 0.12 60)',  // Yellow
        'oklch(0.55 0.12 0)',   // Red
        'oklch(0.65 0.12 180)', // Cyan
        'oklch(0.55 0.12 90)'   // Lime
      ]
    },
    styles: {
      lineWidth: 2,
      pointRadius: 4,
      gridOpacity: 0.1,
      fontFamily: 'Inter',
      fontSize: 12
    }
  },
  
  analytical: {
    name: 'Analytisch',
    description: 'Professioneel en data-gericht',
    colors: {
      primary: [
        'oklch(0.35 0.12 220)',
        'oklch(0.45 0.15 240)',
        'oklch(0.55 0.12 260)',
        'oklch(0.65 0.10 280)',
        'oklch(0.75 0.08 300)'
      ],
      highlight: [
        'oklch(0.35 0.12 220)',
        'oklch(0.60 0.15 30)',
        'oklch(0.88 0.01 240)',
        'oklch(0.75 0.06 230)',
        'oklch(0.55 0.08 250)'
      ],
      monochrome: [
        'oklch(0.20 0.08 240)',
        'oklch(0.35 0.08 240)',
        'oklch(0.50 0.08 240)',
        'oklch(0.65 0.08 240)',
        'oklch(0.80 0.08 240)'
      ],
      categorical: [
        'oklch(0.35 0.12 220)',
        'oklch(0.45 0.12 180)',
        'oklch(0.55 0.12 140)',
        'oklch(0.45 0.12 100)',
        'oklch(0.55 0.12 60)',
        'oklch(0.45 0.12 20)',
        'oklch(0.55 0.12 340)',
        'oklch(0.45 0.12 300)'
      ]
    },
    styles: {
      lineWidth: 1.5,
      pointRadius: 3,
      gridOpacity: 0.05,
      fontFamily: 'Inter',
      fontSize: 11
    }
  },
  
  executive: {
    name: 'Executive',
    description: 'Elegant en zakelijk',
    colors: {
      primary: [
        'oklch(0.25 0.08 240)',
        'oklch(0.45 0.15 240)',
        'oklch(0.65 0.12 200)',
        'oklch(0.75 0.06 230)',
        'oklch(0.85 0.04 240)'
      ],
      highlight: [
        'oklch(0.25 0.08 240)',
        'oklch(0.65 0.12 30)',
        'oklch(0.88 0.01 240)',
        'oklch(0.94 0.01 240)',
        'oklch(0.75 0.06 230)'
      ],
      monochrome: [
        'oklch(0.15 0.08 240)',
        'oklch(0.30 0.08 240)',
        'oklch(0.45 0.08 240)',
        'oklch(0.70 0.08 240)',
        'oklch(0.90 0.08 240)'
      ],
      categorical: [
        'oklch(0.25 0.08 240)',
        'oklch(0.45 0.12 210)',
        'oklch(0.35 0.10 180)',
        'oklch(0.55 0.08 150)',
        'oklch(0.65 0.06 120)',
        'oklch(0.75 0.04 90)'
      ]
    },
    styles: {
      lineWidth: 3,
      pointRadius: 5,
      gridOpacity: 0.08,
      fontFamily: 'Inter',
      fontSize: 13
    }
  }
};

/**
 * Chart configuration templates for different chart types
 */
export const chartTemplates: Record<string, Partial<ChartTemplateConfig>> = {
  // Line Charts
  timeSeries: {
    type: 'line',
    colorScheme: 'default',
    lineStyle: 'solid',
    showLegend: true,
    showAxes: true,
    showGrid: true,
    enableDownload: true,
    enableEmbed: true
  },
  
  timeSeriesProjection: {
    type: 'line',
    colorScheme: 'highlight',
    lineStyle: 'solid',
    showLegend: true,
    showAxes: true,
    showGrid: true,
    projectionData: true,
    enableDownload: true,
    enableEmbed: true
  },
  
  // Bar Charts
  comparison: {
    type: 'bar',
    colorScheme: 'categorical',
    showLegend: true,
    showAxes: true,
    showGrid: true,
    enableDownload: true,
    enableEmbed: true
  },
  
  ranking: {
    type: 'bar',
    colorScheme: 'monochrome',
    showLegend: false,
    showAxes: true,
    showGrid: true,
    enableDownload: true,
    enableEmbed: true
  },
  
  // Area Charts
  cumulative: {
    type: 'area',
    colorScheme: 'primary',
    lineStyle: 'solid',
    showLegend: true,
    showAxes: true,
    showGrid: true,
    enableDownload: true,
    enableEmbed: true
  },
  
  stacked: {
    type: 'area',
    colorScheme: 'categorical',
    lineStyle: 'solid',
    showLegend: true,
    showAxes: true,
    showGrid: true,
    enableDownload: true,
    enableEmbed: true
  },
  
  // Pie Charts
  distribution: {
    type: 'pie',
    colorScheme: 'categorical',
    showLegend: true,
    showAxes: false,
    showGrid: false,
    enableDownload: true,
    enableEmbed: true
  },
  
  // Scatter Plots
  correlation: {
    type: 'scatter',
    colorScheme: 'highlight',
    showLegend: true,
    showAxes: true,
    showGrid: true,
    enableDownload: true,
    enableEmbed: true
  },
  
  // Combo Charts
  multiMetric: {
    type: 'combo',
    colorScheme: 'default',
    lineStyle: 'solid',
    showLegend: true,
    showAxes: true,
    showGrid: true,
    enableDownload: true,
    enableEmbed: true
  }
};

/**
 * Generate chart configuration with theme applied
 */
export function generateChartConfig(
  template: string,
  overrides: Partial<ChartTemplateConfig> = {},
  theme: string = 'default'
): ChartTemplateConfig {
  const baseTemplate = chartTemplates[template];
  if (!baseTemplate) {
    throw new Error(`Chart template '${template}' not found`);
  }
  
  const selectedTheme = chartThemes[theme];
  if (!selectedTheme) {
    throw new Error(`Chart theme '${theme}' not found`);
  }
  
  // Apply theme colors based on color scheme
  const colorScheme = overrides.colorScheme || baseTemplate.colorScheme || 'default';
  const themeColors = selectedTheme.colors[colorScheme as keyof typeof selectedTheme.colors];
  
  return {
    ...baseTemplate,
    ...overrides,
    customColors: overrides.customColors || themeColors,
    // Ensure required fields have defaults
    type: overrides.type || baseTemplate.type || 'line',
    dataSource: overrides.dataSource || ''
  } as ChartTemplateConfig;
}

/**
 * Common chart annotations
 */
export const commonAnnotations = {
  targetLine: (value: number, label: string = 'Doel'): any => ({
    type: 'line',
    value,
    label,
    color: 'oklch(0.65 0.12 30)',
    style: 'dashed'
  }),
  
  averageLine: (value: number, label: string = 'Gemiddelde'): any => ({
    type: 'line',
    value,
    label,
    color: 'oklch(0.55 0.08 240)',
    style: 'dotted'
  }),
  
  highlightArea: (start: number, end: number, label?: string): any => ({
    type: 'area',
    value: [start, end],
    label,
    color: 'oklch(0.94 0.01 240)',
    style: 'solid'
  }),
  
  importantPoint: (value: number | string, label: string): any => ({
    type: 'point',
    value,
    label,
    color: 'oklch(0.65 0.12 30)',
    style: 'solid'
  })
};

/**
 * Export configuration to JSON for external tools
 */
export function exportChartConfig(config: ChartTemplateConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Import configuration from JSON
 */
export function importChartConfig(json: string): ChartTemplateConfig {
  try {
    return JSON.parse(json) as ChartTemplateConfig;
  } catch (error) {
    throw new Error('Invalid chart configuration JSON');
  }
}