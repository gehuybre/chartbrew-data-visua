import { Report, ChartData, ScrollySection, ChartConfig } from '../types';

// Mock function to simulate loading report data from folder structure
export async function loadReportFromFolder(folderPath: string): Promise<Report> {
  // In a real implementation, this would:
  // 1. Read the content.html file
  // 2. Read all chart config files
  // 3. Parse CSV data files
  // 4. Extract scrolly sections from HTML
  
  // For now, return mock data based on folder path
  const reports = await loadAllReports();
  const report = reports.find(r => r.folderPath === folderPath);
  
  if (!report) {
    throw new Error(`Report not found at path: ${folderPath}`);
  }
  
  return report;
}

export async function loadChartConfig(configPath: string): Promise<ChartConfig> {
  try {
    // Mock data for demo - in real implementation would fetch from file
    const mockConfigs: Record<string, ChartConfig> = {
      '/src/rapporten/q3-2024-analytics/monthly-visitors.config.json': {
        id: 'monthly-visitors',
        type: 'line',
        title: 'Maandelijkse Unieke Bezoekers Q3 2024',
        subtitle: 'Steady Growth in Website Traffic',
        dataSource: '/src/rapporten/q3-2024-analytics/monthly-visitors.csv',
        xAxis: { field: 'month', label: 'Maand', type: 'category' },
        yAxis: { field: 'visitors', label: 'Unieke Bezoekers', type: 'linear', format: '#,###' },
        colors: { palette: 'default' },
        lines: { style: 'solid', width: 3, smooth: true, projection: { enabled: false } },
        legend: { show: false, position: 'top' },
        grid: { show: true, color: 'var(--border)', style: 'solid' },
        tooltip: { show: true, format: '{month}: {visitors:#,###} bezoekers' },
        footer: {
          text: 'Data verzameld via Google Analytics',
          source: 'Analytics Team',
          notes: ['Unieke bezoekers gedefinieerd als gebruikers met unieke cookie IDs']
        },
        animation: { duration: 1500, easing: 'ease-out', delay: 200 }
      },
      '/src/rapporten/user-satisfaction-2024/satisfaction-scores.config.json': {
        id: 'satisfaction-scores',
        type: 'bar',
        title: 'Klanttevredenheidsscore per Categorie',
        subtitle: 'Gemiddelde scores op 5-punts schaal',
        dataSource: '/src/rapporten/user-satisfaction-2024/satisfaction-scores.csv',
        xAxis: { field: 'category', label: 'Categorie', type: 'category' },
        yAxis: { field: 'score', label: 'Tevredenheidsscore', type: 'linear', format: '.1f' },
        colors: { palette: 'default' },
        bar: { spacing: 0.2, borderRadius: 4 },
        legend: { show: false, position: 'top' },
        grid: { show: true, color: 'var(--border)', style: 'solid' },
        tooltip: { show: true, format: '{category}: {score:.1f}/5.0' },
        footer: {
          text: 'Gebaseerd op 1,247 antwoorden',
          source: 'Customer Success Team',
          notes: ['Score berekend als gemiddelde van alle antwoorden per categorie']
        },
        animation: { duration: 1200, easing: 'ease-out', delay: 100 }
      },
      '/src/rapporten/user-satisfaction-2024/nps-trend.config.json': {
        id: 'nps-trend',
        type: 'line',
        title: 'Net Promoter Score Trend',
        subtitle: 'Maandelijkse NPS ontwikkeling',
        dataSource: '/src/rapporten/user-satisfaction-2024/nps-trend.csv',
        xAxis: { field: 'month', label: 'Maand', type: 'category' },
        yAxis: { field: 'nps', label: 'NPS Score', type: 'linear', format: '+#;-#' },
        colors: { palette: 'highlight' },
        lines: { style: 'solid', width: 3, smooth: true, projection: { enabled: false } },
        legend: { show: false, position: 'top' },
        grid: { show: true, color: 'var(--border)', style: 'solid' },
        tooltip: { show: true, format: '{month}: NPS {nps:+#}' },
        footer: {
          text: 'NPS berekend volgens standaard methodologie',
          source: 'Customer Success Team',
          notes: ['Scores boven +50 worden als excellent beschouwd']
        },
        animation: { duration: 1500, easing: 'ease-out', delay: 200 }
      },
      '/src/rapporten/user-satisfaction-2024/response-distribution.config.json': {
        id: 'response-distribution',
        type: 'pie',
        title: 'Verdeling Respondenten',
        subtitle: 'Klantensegmenten in onderzoek',
        dataSource: '/src/rapporten/user-satisfaction-2024/response-distribution.csv',
        colors: { palette: 'default' },
        pie: { innerRadius: 0.3, sortByValue: true, padAngle: 0.02, cornerRadius: 3 },
        legend: { show: true, position: 'right' },
        tooltip: { show: true, format: '{segment}: {count} respondenten ({percentage:.1f}%)' },
        footer: {
          text: 'Totaal 1,247 geldige antwoorden',
          source: 'Customer Success Team',
          notes: ['Segmentatie gebaseerd op klantstatus en contractgrootte']
        },
        animation: { duration: 1000, easing: 'ease-out', delay: 150 }
      },
      '/src/rapporten/q3-2024-analytics/traffic-sources.config.json': {
        id: 'traffic-sources',
        type: 'pie',
        title: 'Verkeersbronnen Verdeling',
        subtitle: 'Waar komen onze bezoekers vandaan?',
        dataSource: '/src/rapporten/q3-2024-analytics/traffic-sources.csv',
        colors: { palette: 'default' },
        pie: { innerRadius: 0.4, sortByValue: true, padAngle: 0.01, cornerRadius: 2 },
        legend: { show: true, position: 'right' },
        tooltip: { show: true, format: '{source}: {percentage}% van verkeer' },
        footer: {
          text: 'Data verzameld via Google Analytics',
          source: 'Analytics Team',
          notes: ['Gebaseerd op laatste klik attributie model']
        },
        animation: { duration: 1200, easing: 'ease-out', delay: 100 }
      },
      '/src/rapporten/q3-2024-analytics/page-performance.config.json': {
        id: 'page-performance',
        type: 'bar',
        title: 'Top Pagina Prestaties',
        subtitle: 'Paginaweergaven per sectie',
        dataSource: '/src/rapporten/q3-2024-analytics/page-performance.csv',
        xAxis: { field: 'page', label: 'Pagina', type: 'category' },
        yAxis: { field: 'views', label: 'Weergaven', type: 'linear', format: '#,###' },
        colors: { palette: 'default' },
        bar: { spacing: 0.3, borderRadius: 6 },
        legend: { show: false, position: 'top' },
        grid: { show: true, color: 'var(--border)', style: 'solid' },
        tooltip: { show: true, format: '{page}: {views:#,###} weergaven' },
        footer: {
          text: 'Data verzameld via Google Analytics',
          source: 'Analytics Team',
          notes: ['Alleen unieke paginaweergaven geteld']
        },
        animation: { duration: 1000, easing: 'ease-out', delay: 300 }
      },
      '/src/rapporten/sales-performance-h1/monthly-revenue.config.json': {
        id: 'monthly-revenue',
        type: 'line',
        title: 'Maandelijkse Omzet H1 2024',
        subtitle: 'Ontwikkeling van verkoopcijfers',
        dataSource: '/src/rapporten/sales-performance-h1/monthly-revenue.csv',
        xAxis: { field: 'month', label: 'Maand', type: 'category' },
        yAxis: { field: 'revenue', label: 'Omzet (€)', type: 'linear', format: '€#,###' },
        colors: { palette: 'highlight' },
        lines: { style: 'solid', width: 3, smooth: true },
        legend: { show: false, position: 'top' },
        grid: { show: true, color: 'var(--border)', style: 'solid' },
        tooltip: { show: true, format: '{month}: €{revenue:#,###}' },
        footer: {
          text: 'Exclusief BTW',
          source: 'Sales Operations',
          notes: ['Gebaseerd op gefactureerde omzet']
        },
        animation: { duration: 1500, easing: 'ease-out', delay: 200 }
      },
      '/src/rapporten/sales-performance-h1/regional-breakdown.config.json': {
        id: 'regional-breakdown',
        type: 'pie',
        title: 'Regionale Omzetverdeling',
        subtitle: 'Verkoop per regio H1 2024',
        dataSource: '/src/rapporten/sales-performance-h1/regional-breakdown.csv',
        colors: { palette: 'default' },
        pie: { innerRadius: 0.3, sortByValue: true, padAngle: 0.02 },
        legend: { show: true, position: 'right' },
        tooltip: { show: true, format: '{region}: €{revenue:#,###} ({percentage:.1f}%)' },
        footer: {
          text: 'Totale omzet: €2.4M',
          source: 'Sales Operations',
          notes: ['Gebaseerd op klantlocatie']
        },
        animation: { duration: 1200, easing: 'ease-out', delay: 100 }
      },
      '/src/rapporten/sales-performance-h1/product-mix.config.json': {
        id: 'product-mix',
        type: 'bar',
        title: 'Product Mix Analyse',
        subtitle: 'Omzet per productcategorie',
        dataSource: '/src/rapporten/sales-performance-h1/product-mix.csv',
        xAxis: { field: 'category', label: 'Productcategorie', type: 'category' },
        yAxis: { field: 'revenue', label: 'Omzet (€)', type: 'linear', format: '€#,###' },
        colors: { palette: 'default' },
        bar: { spacing: 0.2, borderRadius: 4 },
        legend: { show: false, position: 'top' },
        grid: { show: true, color: 'var(--border)', style: 'solid' },
        tooltip: { show: true, format: '{category}: €{revenue:#,###}' },
        footer: {
          text: 'H1 2024 verkoopcijfers',
          source: 'Sales Operations',
          notes: ['Inclusief terugkerende abonnementen']
        },
        animation: { duration: 1000, easing: 'ease-out', delay: 150 }
      }
    };
    
    return mockConfigs[configPath] || {
      id: 'default',
      type: 'bar',
      title: 'Default Chart',
      dataSource: '',
      colors: { palette: 'default' },
      legend: { show: true, position: 'top' },
      tooltip: { show: true }
    };
  } catch (error) {
    console.error(`Error loading chart config from ${configPath}:`, error);
    throw error;
  }
}

export async function loadCSVData(csvPath: string): Promise<any[]> {
  try {
    // Mock data for demo
    const mockData: Record<string, any[]> = {
      '/src/rapporten/q3-2024-analytics/monthly-visitors.csv': [
        { month: 'Juli', visitors: 15420 },
        { month: 'Augustus', visitors: 18350 },
        { month: 'September', visitors: 21180 }
      ],
      '/src/rapporten/q3-2024-analytics/traffic-sources.csv': [
        { source: 'Organisch Zoeken', percentage: 45 },
        { source: 'Direct', percentage: 25 },
        { source: 'Social Media', percentage: 15 },
        { source: 'Verwijzingen', percentage: 10 },
        { source: 'E-mail', percentage: 5 }
      ],
      '/src/rapporten/q3-2024-analytics/page-performance.csv': [
        { page: 'Homepage', views: 8450 },
        { page: 'Productcatalogus', views: 6200 },
        { page: 'Over Ons', views: 4100 },
        { page: 'Contact', views: 2800 },
        { page: 'Blog', views: 3600 }
      ],
      '/src/rapporten/user-satisfaction-2024/satisfaction-scores.csv': [
        { category: 'Productkwaliteit', score: 4.2 },
        { category: 'Klantenservice', score: 4.5 },
        { category: 'Gebruiksgemak', score: 3.8 },
        { category: 'Prijs-kwaliteit', score: 3.6 },
        { category: 'Algehele ervaring', score: 4.1 }
      ],
      '/src/rapporten/user-satisfaction-2024/nps-trend.csv': [
        { month: 'Januari', nps: 42 },
        { month: 'Februari', nps: 45 },
        { month: 'Maart', nps: 38 },
        { month: 'April', nps: 51 },
        { month: 'Mei', nps: 48 },
        { month: 'Juni', nps: 55 },
        { month: 'Juli', nps: 52 },
        { month: 'Augustus', nps: 58 },
        { month: 'September', nps: 56 }
      ],
      '/src/rapporten/user-satisfaction-2024/response-distribution.csv': [
        { segment: 'Enterprise Klanten', count: 387, percentage: 31.0 },
        { segment: 'Mid-market', count: 456, percentage: 36.6 },
        { segment: 'Small Business', count: 248, percentage: 19.9 },
        { segment: 'Nieuwe Klanten', count: 156, percentage: 12.5 }
      ],
      '/src/rapporten/sales-performance-h1/monthly-revenue.csv': [
        { month: 'Januari', revenue: 180000 },
        { month: 'Februari', revenue: 195000 },
        { month: 'Maart', revenue: 220000 },
        { month: 'April', revenue: 210000 },
        { month: 'Mei', revenue: 235000 },
        { month: 'Juni', revenue: 250000 }
      ],
      '/src/rapporten/sales-performance-h1/regional-breakdown.csv': [
        { region: 'Nederland', revenue: 980000, percentage: 40.8 },
        { region: 'België', revenue: 560000, percentage: 23.3 },
        { region: 'Duitsland', revenue: 480000, percentage: 20.0 },
        { region: 'Frankrijk', revenue: 240000, percentage: 10.0 },
        { region: 'Overig EU', revenue: 140000, percentage: 5.8 }
      ],
      '/src/rapporten/sales-performance-h1/product-mix.csv': [
        { category: 'Enterprise Software', revenue: 850000 },
        { category: 'Consulting Services', revenue: 620000 },
        { category: 'SaaS Subscriptions', revenue: 480000 },
        { category: 'Training & Support', revenue: 280000 },
        { category: 'Hardware', revenue: 170000 }
      ]
    };
    
    return mockData[csvPath] || [];
  } catch (error) {
    console.error(`Error loading CSV data from ${csvPath}:`, error);
    throw error;
  }
}

function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: any = {};
    headers.forEach((header, index) => {
      const value = values[index];
      // Try to parse as number, otherwise keep as string
      obj[header] = isNaN(Number(value)) ? value : Number(value);
    });
    return obj;
  });
}

export async function loadAllReports(): Promise<Report[]> {
  return [
    {
      id: 'q3-2024-analytics',
      title: 'Q3 2024 Website Analytics Rapport',
      description: 'Uitgebreide analyse van websiteprestaties, gebruikersbetrokkenheid en conversie-indicatoren voor het derde kwartaal van 2024.',
      author: 'Analytics Team',
      date: '2024-10-15',
      tags: ['analytics', 'prestaties', 'kwartaal'],
      folderPath: '/rapporten/q3-2024-analytics',
      charts: [
        {
          id: 'monthly-visitors',
          configPath: '/src/rapporten/q3-2024-analytics/monthly-visitors.config.json'
        },
        {
          id: 'traffic-sources',
          configPath: '/src/rapporten/q3-2024-analytics/traffic-sources.config.json'
        },
        {
          id: 'page-performance',
          configPath: '/src/rapporten/q3-2024-analytics/page-performance.config.json'
        }
      ],
      content: '', // Will be loaded from content.html
      sections: [
        {
          id: 'introduction',
          type: 'text',
          animation: 'fade',
          trigger: 'onEnter'
        },
        {
          id: 'traffic-growth',
          type: 'chart',
          chartId: 'monthly-visitors',
          animation: 'slide',
          trigger: 'onEnter'
        },
        {
          id: 'traffic-sources',
          type: 'text-chart',
          chartId: 'traffic-sources',
          animation: 'scale',
          trigger: 'onScroll'
        },
        {
          id: 'page-performance',
          type: 'chart-text',
          chartId: 'page-performance',
          animation: 'fade',
          trigger: 'onEnter'
        }
      ]
    },
    {
      id: 'user-satisfaction-2024',
      title: 'Klanttevredenheidsonderzoek Resultaten 2024',
      description: 'Jaarlijkse resultaten van klanttevredenheidsonderzoek met feedback over productkwaliteit, ondersteuning en algehele ervaring.',
      author: 'Customer Success Team',
      date: '2024-09-28',
      tags: ['onderzoek', 'tevredenheid', 'klantfeedback'],
      folderPath: '/rapporten/user-satisfaction-2024',
      charts: [
        {
          id: 'satisfaction-scores',
          configPath: '/src/rapporten/user-satisfaction-2024/satisfaction-scores.config.json'
        },
        {
          id: 'nps-trend',
          configPath: '/src/rapporten/user-satisfaction-2024/nps-trend.config.json'
        },
        {
          id: 'response-distribution',
          configPath: '/src/rapporten/user-satisfaction-2024/response-distribution.config.json'
        }
      ],
      content: '',
      sections: []
    },
    {
      id: 'sales-performance-h1',
      title: 'H1 2024 Verkoopprestatie Analyse',
      description: 'Eerste helft verkoop resultaten met regionale uitsplitsing, productprestaties en pijplijnanalyse.',
      author: 'Sales Operations',
      date: '2024-07-05',
      tags: ['verkoop', 'prestaties', 'omzet'],
      folderPath: '/rapporten/sales-performance-h1',
      charts: [
        {
          id: 'monthly-revenue',
          configPath: '/src/rapporten/sales-performance-h1/monthly-revenue.config.json'
        },
        {
          id: 'regional-breakdown',
          configPath: '/src/rapporten/sales-performance-h1/regional-breakdown.config.json'
        },
        {
          id: 'product-mix',
          configPath: '/src/rapporten/sales-performance-h1/product-mix.config.json'
        }
      ],
      content: '',
      sections: []
    }
  ];
}