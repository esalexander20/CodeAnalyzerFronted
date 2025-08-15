'use client';

import { useState } from 'react';

interface Issue {
  id: string;
  type: 'bug' | 'vulnerability' | 'code_smell';
  severity: 'critical' | 'high' | 'medium' | 'low';
  filePath: string;
  lineNumber: number;
  message: string;
  recommendation?: string;
  codeSnippet?: string;
}

interface IssuesListProps {
  issues: Issue[];
}

export default function IssuesList({ issues }: IssuesListProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  // Filter issues based on selected filters
  const filteredIssues = issues.filter(issue => {
    if (selectedType !== 'all' && issue.type !== selectedType) return false;
    if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) return false;
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Critical</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Low</span>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return (
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'vulnerability':
        return (
          <svg className="h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'code_smell':
        return (
          <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Code Issues</h3>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div>
            <label htmlFor="issue-type" className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
            <select
              id="issue-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              <option value="bug">Bugs</option>
              <option value="vulnerability">Vulnerabilities</option>
              <option value="code_smell">Code Smells</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="issue-severity" className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              id="issue-severity"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        
        {filteredIssues.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No issues found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <li key={issue.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getTypeIcon(issue.type)}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 truncate">{issue.message}</p>
                          <p className="text-sm text-gray-500">
                            {issue.filePath}:{issue.lineNumber}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        {getSeverityBadge(issue.severity)}
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <button
                          onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          {expandedIssue === issue.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                    
                    {expandedIssue === issue.id && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        {issue.codeSnippet && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Code Snippet</h4>
                            <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-x-auto">
                              {issue.codeSnippet}
                            </pre>
                          </div>
                        )}
                        
                        {issue.recommendation && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendation</h4>
                            <p className="text-sm text-gray-600">{issue.recommendation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
