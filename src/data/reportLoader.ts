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