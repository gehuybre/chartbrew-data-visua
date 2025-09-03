import { ReportConfig } from '@/types';

/**
 * Report Template System
 * 
 * Dit systeem genereert consistente rapporten met uniforme structuur en stijl.
 * Elk rapport krijgt automatisch de juiste opmaak, navigatie en configuratie.
 */

export interface ReportTemplateConfig {
  // Basic info
  title: string;
  description: string;
  author?: string;
  date?: string;
  version?: string;
  
  // Structure
  sections: ReportSection[];
  
  // Styling
  theme?: 'default' | 'analytical' | 'executive' | 'technical';
  layout?: 'single-column' | 'two-column' | 'mixed';
  
  // Features
  enableDownloads?: boolean;
  enableSharing?: boolean;
  enableSearch?: boolean;
  showMetadata?: boolean;
}

export interface ReportSection {
  id: string;
  type: 'text' | 'chart' | 'metrics' | 'insights' | 'recommendations' | 'mixed';
  title?: string;
  subtitle?: string;
  content?: string; // HTML content
  chartConfig?: ChartTemplateConfig;
  layout?: 'full-width' | 'two-column' | 'sidebar';
  order: number;
}

export interface ChartTemplateConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'combo';
  dataSource: string; // CSV file path
  title?: string;
  subtitle?: string;
  
  // Visual config
  colorScheme?: 'default' | 'highlight' | 'monochrome' | 'categorical';
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  showLegend?: boolean;
  showAxes?: boolean;
  showGrid?: boolean;
  
  // Data config
  xAxis?: string;
  yAxis?: string | string[];
  projectionData?: boolean; // Show future projections as dashed lines
  
  // Interactive features
  enableDownload?: boolean;
  enableEmbed?: boolean;
  
  // Custom styling
  customColors?: string[];
  annotations?: ChartAnnotation[];
}

export interface ChartAnnotation {
  type: 'line' | 'area' | 'point' | 'text';
  value: number | string;
  label?: string;
  color?: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

/**
 * Generate a complete report structure from template config
 */
export function generateReportFromTemplate(config: ReportTemplateConfig): {
  html: string;
  metadata: object;
  chartConfigs: Record<string, ChartTemplateConfig>;
} {
  const { sections, theme = 'default', layout = 'single-column' } = config;
  
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  
  // Generate HTML structure
  const html = generateReportHTML(config, sortedSections);
  
  // Extract chart configurations
  const chartConfigs: Record<string, ChartTemplateConfig> = {};
  sections.forEach(section => {
    if (section.chartConfig) {
      chartConfigs[section.id] = section.chartConfig;
    }
  });
  
  // Generate metadata
  const metadata = {
    title: config.title,
    description: config.description,
    author: config.author,
    date: config.date || new Date().toISOString(),
    version: config.version || '1.0.0',
    theme,
    layout,
    generatedAt: new Date().toISOString(),
    sections: sections.length,
    charts: Object.keys(chartConfigs).length
  };
  
  return { html, metadata, chartConfigs };
}

/**
 * Generate the HTML structure for a report
 */
function generateReportHTML(config: ReportTemplateConfig, sections: ReportSection[]): string {
  const { title, description, theme = 'default', layout = 'single-column' } = config;
  
  const headerHTML = generateHeaderHTML(config);
  const sectionsHTML = sections.map(section => generateSectionHTML(section, layout)).join('');
  const footerHTML = generateFooterHTML(config);
  
  return `
<div class="scrolly-report theme-${theme} layout-${layout}">
  ${headerHTML}
  
  <div class="report-content">
    ${sectionsHTML}
  </div>
  
  ${footerHTML}
</div>
  `.trim();
}

/**
 * Generate header section
 */
function generateHeaderHTML(config: ReportTemplateConfig): string {
  const { title, description, author, date, showMetadata = true } = config;
  
  return `
<header class="scrolly-section report-header">
  <div class="container">
    <h1>${title}</h1>
    ${description ? `<p class="lead">${description}</p>` : ''}
    
    ${showMetadata ? `
    <div class="report-metadata">
      ${author ? `<span class="metadata-item">Door: ${author}</span>` : ''}
      ${date ? `<span class="metadata-item">Datum: ${formatDate(date)}</span>` : ''}
    </div>
    ` : ''}
  </div>
</header>
  `.trim();
}

/**
 * Generate individual section HTML
 */
function generateSectionHTML(section: ReportSection, defaultLayout: string): string {
  const { id, type, title, subtitle, content, layout = defaultLayout } = section;
  
  let sectionContent = '';
  
  switch (type) {
    case 'text':
      sectionContent = generateTextSection(section);
      break;
    case 'chart':
      sectionContent = generateChartSection(section);
      break;
    case 'metrics':
      sectionContent = generateMetricsSection(section);
      break;
    case 'insights':
      sectionContent = generateInsightsSection(section);
      break;
    case 'recommendations':
      sectionContent = generateRecommendationsSection(section);
      break;
    case 'mixed':
      sectionContent = generateMixedSection(section);
      break;
    default:
      sectionContent = content || '';
  }
  
  return `
<section id="${id}" class="scrolly-section section-${type} layout-${layout}">
  <div class="container">
    ${title ? `<h2>${title}</h2>` : ''}
    ${subtitle ? `<p class="section-subtitle">${subtitle}</p>` : ''}
    ${sectionContent}
  </div>
</section>
  `.trim();
}

/**
 * Generate text-only section
 */
function generateTextSection(section: ReportSection): string {
  return section.content || '';
}

/**
 * Generate chart section with controls
 */
function generateChartSection(section: ReportSection): string {
  const { id, chartConfig } = section;
  
  if (!chartConfig) {
    return '<div class="chart-placeholder">Geen grafiek geconfigureerd</div>';
  }
  
  return `
<div class="scrolly-chart-container">
  <div id="chart-${id}" class="chart-container" data-chart-config='${JSON.stringify(chartConfig)}'>
    <div class="chart-placeholder">Grafiek wordt geladen...</div>
  </div>
  
  ${chartConfig.enableDownload || chartConfig.enableEmbed ? `
  <div class="chart-controls">
    ${chartConfig.enableDownload ? `
    <button class="chart-download-btn" data-chart-id="${id}">
      Download CSV
    </button>
    ` : ''}
    
    ${chartConfig.enableEmbed ? `
    <button class="chart-embed-btn" data-chart-id="${id}">
      Kopieer Embed Code
    </button>
    ` : ''}
  </div>
  ` : ''}
</div>
  `.trim();
}

/**
 * Generate metrics section
 */
function generateMetricsSection(section: ReportSection): string {
  return `
<div class="metrics-grid">
  <!-- Metrics worden hier dynamisch geladen -->
  ${section.content || ''}
</div>
  `.trim();
}

/**
 * Generate insights section
 */
function generateInsightsSection(section: ReportSection): string {
  return `
<div class="insight-box">
  ${section.content || ''}
</div>
  `.trim();
}

/**
 * Generate recommendations section
 */
function generateRecommendationsSection(section: ReportSection): string {
  return `
<div class="recommendations-list">
  ${section.content || ''}
</div>
  `.trim();
}

/**
 * Generate mixed layout section (text + chart side by side)
 */
function generateMixedSection(section: ReportSection): string {
  const { id, content, chartConfig } = section;
  
  return `
<div class="two-column-layout">
  <div class="text-column">
    ${content || ''}
  </div>
  
  <div class="chart-column">
    ${chartConfig ? generateChartSection(section) : ''}
  </div>
</div>
  `.trim();
}

/**
 * Generate footer section
 */
function generateFooterHTML(config: ReportTemplateConfig): string {
  const { version } = config;
  
  return `
<footer class="scrolly-section report-footer">
  <div class="container">
    <div class="footer-content">
      <p class="footer-info">
        Gegenereerd met ChartBrew Rapporten Template Systeem
        ${version ? ` • Versie ${version}` : ''}
      </p>
      <p class="footer-timestamp">
        Laatst bijgewerkt: ${new Date().toLocaleDateString('nl-NL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>
  </div>
</footer>
  `.trim();
}

/**
 * Format date string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Default report templates
 */
export const defaultTemplates = {
  analytical: {
    theme: 'analytical',
    layout: 'two-column',
    sections: [
      { id: 'summary', type: 'text', title: 'Samenvatting', order: 1 },
      { id: 'overview', type: 'chart', title: 'Overzicht', order: 2 },
      { id: 'details', type: 'mixed', title: 'Gedetailleerde Analyse', order: 3 },
      { id: 'insights', type: 'insights', title: 'Belangrijkste Inzichten', order: 4 },
      { id: 'recommendations', type: 'recommendations', title: 'Aanbevelingen', order: 5 }
    ]
  } as Partial<ReportTemplateConfig>,
  
  executive: {
    theme: 'executive',
    layout: 'single-column',
    sections: [
      { id: 'executive-summary', type: 'text', title: 'Executive Summary', order: 1 },
      { id: 'key-metrics', type: 'metrics', title: 'Kerngegevens', order: 2 },
      { id: 'main-chart', type: 'chart', title: 'Hoofdresultaten', order: 3 },
      { id: 'recommendations', type: 'recommendations', title: 'Strategische Aanbevelingen', order: 4 }
    ]
  } as Partial<ReportTemplateConfig>,
  
  technical: {
    theme: 'technical',
    layout: 'mixed',
    sections: [
      { id: 'methodology', type: 'text', title: 'Methodologie', order: 1 },
      { id: 'data-overview', type: 'chart', title: 'Data Overzicht', order: 2 },
      { id: 'analysis', type: 'mixed', title: 'Technische Analyse', order: 3 },
      { id: 'validation', type: 'text', title: 'Validatie', order: 4 },
      { id: 'appendix', type: 'text', title: 'Bijlagen', order: 5 }
    ]
  } as Partial<ReportTemplateConfig>
};