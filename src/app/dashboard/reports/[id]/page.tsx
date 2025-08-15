'use client';

import { useEffect, useState } from 'react';
import CodeQualityChart from '@/components/analysis/CodeQualityChart';
import IssuesList from '@/components/analysis/IssuesList';
import { AnalysisResponse } from '@/types/repository';

// Mock data for demonstration
const mockReport = {
  id: '1',
  repositoryId: '1',
  repositoryName: 'react-app',
  ownerName: 'johndoe',
  githubUrl: 'https://github.com/johndoe/react-app',
  commitHash: 'a1b2c3d4e5f6g7h8i9j0',
  createdAt: '2025-06-01T10:30:00Z',
  overallScore: 85,
  codeQualityScore: 82,
  bugsCount: 3,
  vulnerabilitiesCount: 1,
  codeSmellsCount: 12,
  issues: [
    {
      id: '101',
      type: 'bug' as const,
      severity: 'high' as const,
      filePath: 'src/components/Form.js',
      lineNumber: 42,
      message: 'Potential null reference exception',
      recommendation: 'Add null check before accessing properties of user object',
      codeSnippet: 'const username = user.profile.username; // user might be null'
    },
    {
      id: '102',
      type: 'vulnerability' as const,
      severity: 'critical' as const,
      filePath: 'src/utils/api.js',
      lineNumber: 17,
      message: 'Insecure direct object reference',
      recommendation: 'Implement proper authorization checks before accessing resources',
      codeSnippet: 'fetch(`/api/users/${userId}/data`); // No authorization check'
    },
    {
      id: '103',
      type: 'code_smell' as const,
      severity: 'medium' as const,
      filePath: 'src/App.js',
      lineNumber: 23,
      message: 'Unused import statement',
      recommendation: 'Remove unused import to improve code cleanliness',
      codeSnippet: 'import { useContext } from "react"; // Not used in this file'
    },
    {
      id: '104',
      type: 'bug' as const,
      severity: 'medium' as const,
      filePath: 'src/components/Button.js',
      lineNumber: 15,
      message: 'Event handler prevents default but not needed',
      recommendation: 'Remove unnecessary preventDefault() call',
      codeSnippet: 'const handleClick = (e) => { e.preventDefault(); doSomething(); };'
    },
    {
      id: '105',
      type: 'code_smell' as const,
      severity: 'low' as const,
      filePath: 'src/styles/main.css',
      lineNumber: 56,
      message: 'Duplicate CSS property',
      recommendation: 'Remove duplicate margin-top property',
      codeSnippet: '.container { margin-top: 10px; padding: 15px; margin-top: 20px; }'
    }
  ]
};

import { useParams } from 'next/navigation';

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [report, setReport] = useState<typeof mockReport | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        console.log('Fetching analysis report for ID:', reportId);
        
        // Fetch analysis data from our API endpoint
        const response = await fetch(`/api/analysis/${reportId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `API error: ${response.status}`);
        }
        
        const analysisData = await response.json();
        console.log('Fetched analysis data:', analysisData);
        
        setAnalysisData(analysisData);
        
        // Convert API data to report format for compatibility with existing components
        const apiReport = {
          id: analysisData.id,
          repositoryId: analysisData.id,
          repositoryName: analysisData.repository_name || analysisData.repository_url.split('/').pop() || 'Unknown',
          ownerName: analysisData.owner_name || analysisData.repository_url.split('/').slice(-2, -1)[0] || 'Unknown',
          githubUrl: analysisData.repository_url,
          commitHash: analysisData.commit_hash || 'latest',
          createdAt: analysisData.createdAt || new Date().toISOString(),
          overallScore: analysisData.code_quality,
          codeQualityScore: analysisData.code_quality,
          bugsCount: analysisData.bugs_found || 0,
          vulnerabilitiesCount: analysisData.vulnerabilities_count || 0,
          codeSmellsCount: analysisData.code_smells_count || 0,
          // Generate issues from recommendations if available
          issues: analysisData.recommendations ? 
            analysisData.recommendations.map((rec: string, index: number) => ({
              id: `rec-${index}`,
              type: 'code_smell' as const,
              severity: 'medium' as const,
              filePath: 'Various files',
              lineNumber: 0,
              message: rec,
              recommendation: rec,
              codeSnippet: ''
            })) : 
            mockReport.issues // Fallback to mock issues if no recommendations
        };
        
        setReport(apiReport);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching report:', error);
        setError(error.message || 'Failed to load report data');
        setIsLoading(false);
      }
    };
    
    fetchReport();
  }, [reportId]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading report data...</div>
        </div>
    );
  }

  if (error || !report) {
    return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error || 'Report not found'}
              </p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{report.repositoryName}</h1>
          <a 
            href={report.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View on GitHub
          </a>
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span>Owner: {report.ownerName}</span>
          <span className="mx-2">•</span>
          <span>Analyzed: {new Date(report.createdAt).toLocaleString()}</span>
          <span className="mx-2">•</span>
          <span>Commit: {report.commitHash.substring(0, 7)}</span>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CodeQualityChart
            codeQuality={report.overallScore}
            bugs={report.bugsCount}
            vulnerabilities={report.vulnerabilitiesCount}
            codeSmells={report.codeSmellsCount}
          />
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Summary</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Overall Assessment</h4>
                <p className="mt-1 text-sm text-gray-900">
                  This repository has an overall score of {report.overallScore}/100, which is 
                  {report.overallScore >= 80 ? ' excellent.' : 
                   report.overallScore >= 60 ? ' good, but has some issues to address.' : 
                   ' concerning and requires significant improvements.'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Key Findings</h4>
                <ul className="mt-1 text-sm text-gray-900 list-disc pl-5 space-y-1">
                  {report.bugsCount > 0 && (
                    <li>Found {report.bugsCount} potential bug{report.bugsCount !== 1 ? 's' : ''} that should be fixed</li>
                  )}
                  {report.vulnerabilitiesCount > 0 && (
                    <li>Detected {report.vulnerabilitiesCount} security vulnerabilit{report.vulnerabilitiesCount !== 1 ? 'ies' : 'y'} requiring immediate attention</li>
                  )}
                  {report.codeSmellsCount > 0 && (
                    <li>Identified {report.codeSmellsCount} code smell{report.codeSmellsCount !== 1 ? 's' : ''} that could be improved</li>
                  )}
                </ul>
              </div>
              
              {/* Display API-specific recommendations if available */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Recommendations</h4>
                {analysisData && analysisData.recommendations ? (
                  <ul className="mt-1 text-sm text-gray-900 list-disc pl-5 space-y-1">
                    {analysisData.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                ) : (
                  <ul className="mt-1 text-sm text-gray-900 list-disc pl-5 space-y-1">
                    <li>Address all critical and high severity issues first</li>
                    <li>Implement proper error handling throughout the codebase</li>
                    <li>Consider adding more comprehensive test coverage</li>
                  </ul>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <IssuesList issues={report.issues} />
        </div>
        
        {/* Display API-specific details if available */}
        {analysisData && analysisData.details && (
          <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Detailed Analysis</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Code Structure</h4>
                  <p className="mt-1 text-sm text-gray-600">{analysisData.details.code_structure}</p>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">Performance</h4>
                  <p className="mt-1 text-sm text-gray-600">{analysisData.details.performance}</p>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">Security</h4>
                  <p className="mt-1 text-sm text-gray-600">{analysisData.details.security}</p>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">Best Practices</h4>
                  <p className="mt-1 text-sm text-gray-600">{analysisData.details.best_practices}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
