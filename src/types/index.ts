export { ChartConfig, colorPalettes } from './chartConfig';

export interface ChartData {
  id: string;
  title?: string; // Optional chart title
  configPath: string; // Path to chart config JSON file
  data?: any[]; // Optional pre-loaded data for demos
}

export interface ScrollySection {
  id: string;
  type: 'text' | 'chart' | 'text-chart' | 'chart-text';
  content?: string; // HTML content
  chartId?: string; // Reference to chart
  animation?: 'fade' | 'slide' | 'scale';
  trigger?: 'onEnter' | 'onScroll' | 'onExit';
}

export interface Report {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  charts: ChartData[];
  content: string; // HTML content with scrollytelling
  sections: ScrollySection[]; // Structured scrolly sections
  thumbnail?: string;
  folderPath: string; // Required path to report folder
  metadata?: ReportMetadata;
  template?: string; // Template used to generate this report
}

export interface ReportMetadata {
  version?: string;
  lastUpdated?: string;
  dataSource?: string;
  confidentiality?: 'public' | 'internal' | 'confidential';
  reviewedBy?: string;
  approvedBy?: string;
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