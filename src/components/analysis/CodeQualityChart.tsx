'use client';

import { useEffect, useRef } from 'react';

interface CodeQualityChartProps {
  codeQuality: number;
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
}

export default function CodeQualityChart({
  codeQuality,
  bugs,
  vulnerabilities,
  codeSmells
}: CodeQualityChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real implementation, you would use a charting library like Chart.js or D3.js
    // For now, we'll create a simple gauge chart with HTML and CSS
    if (chartRef.current) {
      const gauge = chartRef.current;
      const percentage = codeQuality;
      
      // Update gauge color based on score
      let color = '#EF4444'; // red for low scores
      if (percentage >= 80) {
        color = '#10B981'; // green for high scores
      } else if (percentage >= 60) {
        color = '#F59E0B'; // yellow for medium scores
      }
      
      // Set the gauge value and color
      gauge.style.setProperty('--gauge-value', `${percentage}%`);
      gauge.style.setProperty('--gauge-color', color);
    }
  }, [codeQuality]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Code Quality Overview</h3>
      
      <div className="flex flex-col items-center mb-6">
        {/* Simple gauge chart */}
        <div 
          ref={chartRef}
          className="relative w-48 h-24 overflow-hidden"
          style={{
            '--gauge-value': `${codeQuality}%`,
            '--gauge-color': codeQuality >= 80 ? '#10B981' : codeQuality >= 60 ? '#F59E0B' : '#EF4444'
          } as React.CSSProperties}
        >
          <div className="absolute top-0 left-0 w-full h-full border-t-[96px] border-t-[#E5E7EB] border-solid rounded-full"></div>
          <div 
            className="absolute top-0 left-0 w-full h-full border-t-[96px] border-solid rounded-full"
            style={{ 
              borderTopColor: 'var(--gauge-color)',
              clipPath: `polygon(0 0, var(--gauge-value) 0, var(--gauge-value) 100%, 0 100%)`
            }}
          ></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-2xl font-bold">
            {codeQuality}%
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">Overall Code Quality Score</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
          <span className="text-xl font-bold text-red-600">{bugs}</span>
          <span className="text-sm text-gray-500">Bugs</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
          <span className="text-xl font-bold text-orange-600">{vulnerabilities}</span>
          <span className="text-sm text-gray-500">Vulnerabilities</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-xl font-bold text-blue-600">{codeSmells}</span>
          <span className="text-sm text-gray-500">Code Smells</span>
        </div>
      </div>
    </div>
  );
}
