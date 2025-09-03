export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: any[];
  csvPath?: string; // Path to CSV file for this chart
  config?: {
    xAxis?: string;
    yAxis?: string;
    colors?: string[];
  };
}

export interface Report {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  charts: ChartData[];
  content: string; // Markdown content
  thumbnail?: string;
  folderPath?: string; // Path to report folder containing CSV files and MD
}

export interface AppConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    chartColors: string[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: string;
  };
  layout: {
    maxWidth: string;
    spacing: string;
  };
}