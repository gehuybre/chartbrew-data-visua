import { useState, useEffect } from 'react';
import { loadChartConfig, loadCSVData } from '../data/reportLoader';
import { ChartConfig } from '../types/chartConfig';

interface DataDebuggerProps {
  configPath: string;
}

export function DataDebugger({ configPath }: DataDebuggerProps) {
  const [config, setConfig] = useState<ChartConfig | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading config from:', configPath);
        const chartConfig = await loadChartConfig(configPath);
        console.log('Config loaded:', chartConfig);
        setConfig(chartConfig);
        
        console.log('Loading data from:', chartConfig.dataSource);
        const csvData = await loadCSVData(chartConfig.dataSource);
        console.log('Data loaded:', csvData);
        setData(csvData);
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [configPath]);

  if (loading) {
    return <div className="p-4 border rounded bg-blue-50">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 border rounded bg-red-50 text-red-700">Error: {error}</div>;
  }

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="font-bold mb-2">Data Debugger</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold">Config:</h4>
        <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
      
      <div>
        <h4 className="font-semibold">Data ({data.length} items):</h4>
        <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      
      {config && data.length > 0 && (
        <div className="mt-4 p-2 bg-green-100 rounded">
          <p className="text-sm text-green-800">
            ✅ Config and data loaded successfully!
          </p>
          <p className="text-xs text-green-700">
            Chart type: {config.type}, X: {config.xAxis?.field}, Y: {config.yAxis?.field}
          </p>
        </div>
      )}
    </div>
  );
}