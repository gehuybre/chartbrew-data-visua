import { ReportTemplateConfig, ReportSection } from '@/templates/reportTemplate';
import { ChartTemplateConfig } from '@/templates/chartTemplates';

/**
 * Template Generator Service
 * 
 * Generates complete report folder structures and files from templates
 */

export interface GeneratedReport {
  folderName: string;
  files: GeneratedFile[];
  structure: FolderStructure;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'html' | 'json' | 'csv' | 'md';
}

export interface FolderStructure {
  name: string;
  files: string[];
  subfolders: FolderStructure[];
}

/**
 * Generate a complete report folder structure from a template
 */
export function generateReportFolder(
  template: ReportTemplateConfig,
  chartConfigs: Record<string, ChartTemplateConfig> = {}
): GeneratedReport {
  const folderName = template.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const files: GeneratedFile[] = [];

  // Generate main HTML file
  const htmlContent = generateReportHTML(template);
  files.push({
    path: `${folderName}/index.html`,
    content: htmlContent,
    type: 'html'
  });

  // Generate metadata file
  const metadata = {
    title: template.title,
    description: template.description,
    author: template.author,
    date: template.date || new Date().toISOString(),
    version: template.version || '1.0.0',
    theme: template.theme,
    layout: template.layout,
    generatedAt: new Date().toISOString(),
    sections: template.sections.length,
    charts: Object.keys(chartConfigs).length,
    template: 'generated'
  };

  files.push({
    path: `${folderName}/metadata.json`,
    content: JSON.stringify(metadata, null, 2),
    type: 'json'
  });

  // Generate chart configuration files
  Object.entries(chartConfigs).forEach(([chartId, config]) => {
    files.push({
      path: `${folderName}/charts/${chartId}-config.json`,
      content: JSON.stringify(config, null, 2),
      type: 'json'
    });

    // Generate sample CSV if no data source specified
    if (!config.dataSource || config.dataSource === '') {
      const sampleCsv = generateSampleCsvData(config.type);
      files.push({
        path: `${folderName}/data/${chartId}-data.csv`,
        content: sampleCsv,
        type: 'csv'
      });
    }
  });

  // Generate section content files for complex sections
  template.sections.forEach(section => {
    if (section.content && section.content.length > 500) {
      files.push({
        path: `${folderName}/sections/${section.id}.html`,
        content: section.content,
        type: 'html'
      });
    }
  });

  // Generate README file
  const readmeContent = generateReadmeContent(template, chartConfigs);
  files.push({
    path: `${folderName}/README.md`,
    content: readmeContent,
    type: 'md'
  });

  // Create folder structure
  const structure: FolderStructure = {
    name: folderName,
    files: files.filter(f => !f.path.includes('/')).map(f => f.path),
    subfolders: [
      {
        name: 'charts',
        files: files.filter(f => f.path.includes('/charts/')).map(f => f.path.split('/').pop()!),
        subfolders: []
      },
      {
        name: 'data',
        files: files.filter(f => f.path.includes('/data/')).map(f => f.path.split('/').pop()!),
        subfolders: []
      },
      {
        name: 'sections',
        files: files.filter(f => f.path.includes('/sections/')).map(f => f.path.split('/').pop()!),
        subfolders: []
      }
    ].filter(folder => folder.files.length > 0)
  };

  return {
    folderName,
    files,
    structure
  };
}

/**
 * Generate the main HTML content for a report
 */
function generateReportHTML(template: ReportTemplateConfig): string {
  const { title, description, sections, theme = 'default', layout = 'single-column' } = template;

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <link href="../styles/report.css" rel="stylesheet">
    <link href="../styles/theme-${theme}.css" rel="stylesheet">
    <script src="../scripts/chart-loader.js"></script>
    <script src="../scripts/interactions.js"></script>
</head>
<body class="theme-${theme} layout-${layout}">
    <div class="scrolly-report">
        <!-- Header -->
        <header class="scrolly-section report-header">
            <div class="container">
                <h1>${title}</h1>
                ${description ? `<p class="lead">${description}</p>` : ''}
                
                ${template.showMetadata ? `
                <div class="report-metadata">
                    ${template.author ? `<span class="metadata-item">Door: ${template.author}</span>` : ''}
                    ${template.date ? `<span class="metadata-item">Datum: ${formatDate(template.date)}</span>` : ''}
                    ${template.version ? `<span class="metadata-item">Versie: ${template.version}</span>` : ''}
                </div>
                ` : ''}
            </div>
        </header>

        <!-- Content -->
        <div class="report-content">
            ${sortedSections.map(section => generateSectionHTML(section, layout)).join('\n')}
        </div>

        <!-- Footer -->
        <footer class="scrolly-section report-footer">
            <div class="container">
                <div class="footer-content">
                    <p class="footer-info">
                        Gegenereerd met ChartBrew Rapporten Template Systeem
                        ${template.version ? ` • Versie ${template.version}` : ''}
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
    </div>

    <!-- Chart Loading Script -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize chart loading
            ChartLoader.loadAllCharts();
            
            // Initialize interactions
            ReportInteractions.init();
        });
    </script>
</body>
</html>`;
}

/**
 * Generate HTML for individual sections
 */
function generateSectionHTML(section: ReportSection, defaultLayout: string): string {
  const { id, type, title, subtitle, content, layout = defaultLayout } = section;

  let sectionContent = '';

  switch (type) {
    case 'text':
      sectionContent = content || '';
      break;
    case 'chart':
      sectionContent = generateChartSectionHTML(section);
      break;
    case 'metrics':
      sectionContent = `<div class="metrics-grid">${content || ''}</div>`;
      break;
    case 'insights':
      sectionContent = `<div class="insight-box">${content || ''}</div>`;
      break;
    case 'recommendations':
      sectionContent = `<div class="recommendations-list">${content || ''}</div>`;
      break;
    case 'mixed':
      sectionContent = generateMixedSectionHTML(section);
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
</section>`;
}

/**
 * Generate chart section HTML
 */
function generateChartSectionHTML(section: ReportSection): string {
  const { id, chartConfig } = section;

  if (!chartConfig) {
    return '<div class="chart-placeholder">Geen grafiek geconfigureerd</div>';
  }

  return `
<div class="scrolly-chart-container">
    <div id="chart-${id}" class="chart-container" data-chart-config="charts/${id}-config.json">
        <div class="chart-placeholder">Grafiek wordt geladen...</div>
    </div>
    
    ${chartConfig.enableDownload || chartConfig.enableEmbed ? `
    <div class="chart-controls">
        ${chartConfig.enableDownload ? `
        <button class="chart-download-btn" data-chart-id="${id}">
            📥 Download CSV
        </button>
        ` : ''}
        
        ${chartConfig.enableEmbed ? `
        <button class="chart-embed-btn" data-chart-id="${id}">
            🔗 Kopieer Embed Code
        </button>
        ` : ''}
    </div>
    ` : ''}
</div>`;
}

/**
 * Generate mixed section HTML (text + chart)
 */
function generateMixedSectionHTML(section: ReportSection): string {
  const { content, chartConfig } = section;

  return `
<div class="two-column-layout">
    <div class="text-column">
        ${content || ''}
    </div>
    
    <div class="chart-column">
        ${chartConfig ? generateChartSectionHTML(section) : ''}
    </div>
</div>`;
}

/**
 * Generate sample CSV data based on chart type
 */
function generateSampleCsvData(chartType: string): string {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);

  switch (chartType) {
    case 'line':
    case 'area':
      return generateTimeSeriesData();
    case 'bar':
      return generateCategoryData();
    case 'pie':
      return generateDistributionData();
    case 'scatter':
      return generateScatterData();
    default:
      return generateTimeSeriesData();
  }
}

function generateTimeSeriesData(): string {
  const headers = ['datum', 'waarde1', 'waarde2', 'waarde3'];
  const rows = [headers.join(',')];
  
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    
    const value1 = Math.round(Math.random() * 100 + 50);
    const value2 = Math.round(Math.random() * 80 + 30);
    const value3 = Math.round(Math.random() * 60 + 20);
    
    rows.push(`${date.toISOString().split('T')[0]},${value1},${value2},${value3}`);
  }
  
  return rows.join('\n');
}

function generateCategoryData(): string {
  const categories = ['Categorie A', 'Categorie B', 'Categorie C', 'Categorie D', 'Categorie E'];
  const headers = ['categorie', 'waarde'];
  const rows = [headers.join(',')];
  
  categories.forEach(category => {
    const value = Math.round(Math.random() * 100 + 10);
    rows.push(`"${category}",${value}`);
  });
  
  return rows.join('\n');
}

function generateDistributionData(): string {
  const segments = ['Segment 1', 'Segment 2', 'Segment 3', 'Segment 4', 'Segment 5'];
  const headers = ['segment', 'percentage'];
  const rows = [headers.join(',')];
  
  let remaining = 100;
  segments.forEach((segment, index) => {
    const value = index === segments.length - 1 
      ? remaining 
      : Math.round(Math.random() * (remaining / (segments.length - index)));
    remaining -= value;
    rows.push(`"${segment}",${value}`);
  });
  
  return rows.join('\n');
}

function generateScatterData(): string {
  const headers = ['x', 'y', 'grootte', 'label'];
  const rows = [headers.join(',')];
  
  for (let i = 0; i < 20; i++) {
    const x = Math.round(Math.random() * 100);
    const y = Math.round(Math.random() * 100);
    const size = Math.round(Math.random() * 20 + 5);
    const label = `Punt ${i + 1}`;
    
    rows.push(`${x},${y},${size},"${label}"`);
  }
  
  return rows.join('\n');
}

/**
 * Generate README content
 */
function generateReadmeContent(
  template: ReportTemplateConfig, 
  chartConfigs: Record<string, ChartTemplateConfig>
): string {
  return `# ${template.title}

${template.description || 'Automatisch gegenereerd rapport'}

## Overzicht

- **Auteur**: ${template.author || 'Onbekend'}
- **Datum**: ${template.date || new Date().toISOString().split('T')[0]}
- **Versie**: ${template.version || '1.0.0'}
- **Thema**: ${template.theme}
- **Layout**: ${template.layout}

## Structuur

Dit rapport bevat ${template.sections.length} secties:

${template.sections.map((section, index) => 
  `${index + 1}. **${section.title || section.id}** (${section.type})`
).join('\n')}

## Grafieken

${Object.keys(chartConfigs).length > 0 
  ? `Dit rapport bevat ${Object.keys(chartConfigs).length} grafieken:\n\n${Object.entries(chartConfigs).map(([id, config]) => 
      `- **${config.title || id}** (${config.type}) - ${config.dataSource || 'Sample data'}`
    ).join('\n')}`
  : 'Dit rapport bevat geen grafieken.'
}

## Bestanden

\`\`\`
${template.title.toLowerCase().replace(/\s+/g, '-')}/
├── index.html          # Hoofdrapport
├── metadata.json       # Rapport metadata
├── README.md          # Deze documentatie
├── charts/            # Chart configuraties
${Object.keys(chartConfigs).map(id => `│   └── ${id}-config.json`).join('\n')}
├── data/             # Data bestanden
${Object.keys(chartConfigs).map(id => `│   └── ${id}-data.csv`).join('\n')}
└── sections/         # Sectie content bestanden
\`\`\`

## Gebruik

1. Open \`index.html\` in een webbrowser
2. Vervang de sample data in \`data/\` met je eigen CSV bestanden
3. Pas de chart configuraties aan in \`charts/\` indien nodig
4. Update de content in \`sections/\` voor aangepaste tekst

## Template Informatie

Dit rapport is gegenereerd met het ChartBrew Rapporten Template Systeem op ${new Date().toLocaleDateString('nl-NL')}.

Voor meer informatie over het template systeem, zie de documentatie in de applicatie.
`;
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
 * Export generated report as ZIP-like structure (JSON representation)
 */
export function exportGeneratedReport(generatedReport: GeneratedReport): string {
  return JSON.stringify({
    folderName: generatedReport.folderName,
    structure: generatedReport.structure,
    files: generatedReport.files.reduce((acc, file) => {
      acc[file.path] = file.content;
      return acc;
    }, {} as Record<string, string>)
  }, null, 2);
}