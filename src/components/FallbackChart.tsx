import { ChartConfig } from '@/types/chartConfig';

interface FallbackChartProps {
  config: ChartConfig;
  data: any[];
  width?: number;
  height?: number;
}

export function FallbackChart({ config, data, width = 800, height = 400 }: FallbackChartProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
        style={{ width, height }}
      >
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Geen data beschikbaar</p>
          <p className="text-sm">Voor grafiek: {config.title}</p>
        </div>
      </div>
    );
  }

  const firstRow = data[0];
  const keys = Object.keys(firstRow);
  const xField = config.xAxis?.field || keys[0];
  const yField = config.yAxis?.field || keys[1];

  if (config.type === 'bar') {
    const maxValue = Math.max(...data.map(d => Number(d[yField]) || 0));
    
    return (
      <div 
        className="bg-white border border-gray-200 rounded-lg p-6"
        style={{ width, height }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          {config.subtitle && (
            <p className="text-sm text-gray-600">{config.subtitle}</p>
          )}
        </div>
        
        <div className="flex items-end justify-between h-64 space-x-2">
          {data.map((item, index) => {
            const value = Number(item[yField]) || 0;
            const barHeight = maxValue > 0 ? (value / maxValue) * 200 : 0;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-1">
                  {value}
                </div>
                <div
                  className="bg-blue-500 min-w-[40px] rounded-t"
                  style={{ height: `${barHeight}px` }}
                />
                <div className="text-xs text-gray-700 mt-2 text-center max-w-[60px] break-words">
                  {String(item[xField])}
                </div>
              </div>
            );
          })}
        </div>
        
        {config.footer && (
          <div className="mt-4 text-xs text-gray-500">
            {config.footer.text && <p>{config.footer.text}</p>}
            {config.footer.source && <p><strong>Bron:</strong> {config.footer.source}</p>}
          </div>
        )}
      </div>
    );
  }

  if (config.type === 'line') {
    const maxValue = Math.max(...data.map(d => Number(d[yField]) || 0));
    const minValue = Math.min(...data.map(d => Number(d[yField]) || 0));
    const range = maxValue - minValue;
    
    return (
      <div 
        className="bg-white border border-gray-200 rounded-lg p-6"
        style={{ width, height }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          {config.subtitle && (
            <p className="text-sm text-gray-600">{config.subtitle}</p>
          )}
        </div>
        
        <div className="relative h-64">
          <svg width="100%" height="100%" className="overflow-visible">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="40"
                y1={40 + (i * 40)}
                x2="90%"
                y2={40 + (i * 40)}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Line path */}
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              points={data.map((item, index) => {
                const x = 40 + (index * (width - 80) / (data.length - 1));
                const value = Number(item[yField]) || 0;
                const y = range > 0 ? 240 - ((value - minValue) / range) * 200 : 120;
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = 40 + (index * (width - 80) / (data.length - 1));
              const value = Number(item[yField]) || 0;
              const y = range > 0 ? 240 - ((value - minValue) / range) * 200 : 120;
              
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#2563eb"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={260}
                    textAnchor="middle"
                    className="text-xs fill-gray-700"
                  >
                    {String(item[xField]).slice(0, 8)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {config.footer && (
          <div className="mt-4 text-xs text-gray-500">
            {config.footer.text && <p>{config.footer.text}</p>}
            {config.footer.source && <p><strong>Bron:</strong> {config.footer.source}</p>}
          </div>
        )}
      </div>
    );
  }

  if (config.type === 'pie') {
    const total = data.reduce((sum, item) => sum + (Number(item[yField]) || 0), 0);
    let currentAngle = 0;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    const colors = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed'];
    
    return (
      <div 
        className="bg-white border border-gray-200 rounded-lg p-6"
        style={{ width, height }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          {config.subtitle && (
            <p className="text-sm text-gray-600">{config.subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center justify-center">
          <svg width={width - 100} height={height - 150}>
            {data.map((item, index) => {
              const value = Number(item[yField]) || 0;
              const percentage = total > 0 ? value / total : 0;
              const angle = percentage * 2 * Math.PI;
              
              const x1 = centerX + radius * Math.cos(currentAngle - Math.PI / 2);
              const y1 = centerY + radius * Math.sin(currentAngle - Math.PI / 2);
              const x2 = centerX + radius * Math.cos(currentAngle + angle - Math.PI / 2);
              const y2 = centerY + radius * Math.sin(currentAngle + angle - Math.PI / 2);
              
              const largeArcFlag = angle > Math.PI ? 1 : 0;
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              const result = (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  stroke="white"
                  strokeWidth="2"
                />
              );
              
              currentAngle += angle;
              return result;
            })}
          </svg>
          
          <div className="ml-6 space-y-2">
            {data.map((item, index) => {
              const value = Number(item[yField]) || 0;
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
              
              return (
                <div key={index} className="flex items-center text-sm">
                  <div 
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span>{String(item[xField])}: {percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {config.footer && (
          <div className="mt-4 text-xs text-gray-500">
            {config.footer.text && <p>{config.footer.text}</p>}
            {config.footer.source && <p><strong>Bron:</strong> {config.footer.source}</p>}
          </div>
        )}
      </div>
    );
  }

  // Default fallback
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-6"
      style={{ width, height }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
        {config.subtitle && (
          <p className="text-sm text-gray-600">{config.subtitle}</p>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 h-64">
        <h4 className="font-medium mb-2">Data Preview:</h4>
        <div className="space-y-1 text-sm">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{String(item[xField])}</span>
              <span>{String(item[yField])}</span>
            </div>
          ))}
          {data.length > 5 && (
            <div className="text-gray-500">... en {data.length - 5} meer</div>
          )}
        </div>
      </div>
      
      {config.footer && (
        <div className="mt-4 text-xs text-gray-500">
          {config.footer.text && <p>{config.footer.text}</p>}
          {config.footer.source && <p><strong>Bron:</strong> {config.footer.source}</p>}
        </div>
      )}
    </div>
  );
}