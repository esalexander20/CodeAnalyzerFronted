'use client';

import { AnalysisResponse } from '@/types/repository';
import ErrorBoundary from '@/components/common/ErrorBoundary';

interface AnalysisResultsProps {
  analysis: AnalysisResponse | null;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  if (!analysis) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="mt-8 bg-white shadow sm:rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Repository Analysis Results
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Analysis for {analysis.repository_url}
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Code Quality Score */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-base font-medium text-gray-900">Code Quality Score</h4>
            <div className="mt-2 flex items-center">
              <div className="text-3xl font-bold">
                <span className={`px-3 py-1 rounded ${
                  analysis.code_quality >= 80 ? 'bg-green-100 text-green-800' : 
                  analysis.code_quality >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {analysis.code_quality}/100
                </span>
              </div>
            </div>
          </div>
          
          {/* Bugs Found */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-base font-medium text-gray-900">Bugs Found</h4>
            <div className="mt-2 flex items-center">
              <div className="text-3xl font-bold text-red-600">{analysis.bugs_found}</div>
              <div className="ml-2 text-sm text-gray-500">potential issues detected</div>
            </div>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="mt-6">
          <h4 className="text-base font-medium text-gray-900">Recommendations</h4>
          <ul className="mt-2 space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="bg-blue-50 p-3 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">{recommendation}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Detailed Analysis */}
        <div className="mt-6">
          <h4 className="text-base font-medium text-gray-900">Detailed Analysis</h4>
          <div className="mt-2 space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h5 className="font-medium text-gray-900">Code Structure</h5>
              <p className="mt-1 text-sm text-gray-600">{analysis.details.code_structure}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h5 className="font-medium text-gray-900">Performance</h5>
              <p className="mt-1 text-sm text-gray-600">{analysis.details.performance}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h5 className="font-medium text-gray-900">Security</h5>
              <p className="mt-1 text-sm text-gray-600">{analysis.details.security}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h5 className="font-medium text-gray-900">Best Practices</h5>
              <p className="mt-1 text-sm text-gray-600">{analysis.details.best_practices}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
