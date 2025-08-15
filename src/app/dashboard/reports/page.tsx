'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for demonstration
const mockReports = [
  {
    id: '1',
    repositoryName: 'react-app',
    ownerName: 'johndoe',
    createdAt: '2025-06-01T10:30:00Z',
    overallScore: 85,
    bugsCount: 3,
    vulnerabilitiesCount: 1,
    codeSmellsCount: 12,
    isSaved: true
  },
  {
    id: '2',
    repositoryName: 'node-api',
    ownerName: 'johndoe',
    createdAt: '2025-05-28T14:20:00Z',
    overallScore: 72,
    bugsCount: 5,
    vulnerabilitiesCount: 2,
    codeSmellsCount: 8,
    isSaved: false
  },
  {
    id: '3',
    repositoryName: 'data-visualization',
    ownerName: 'johndoe',
    createdAt: '2025-05-15T09:45:00Z',
    overallScore: 91,
    bugsCount: 1,
    vulnerabilitiesCount: 0,
    codeSmellsCount: 4,
    isSaved: true
  },
  {
    id: '4',
    repositoryName: 'mobile-app',
    ownerName: 'johndoe',
    createdAt: '2025-05-10T16:20:00Z',
    overallScore: 65,
    bugsCount: 7,
    vulnerabilitiesCount: 3,
    codeSmellsCount: 15,
    isSaved: false
  }
];

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterSaved, setFilterSaved] = useState(false);

  // Filter and sort reports
  const filteredReports = reports
    .filter(report => {
      const matchesSearch = report.repositoryName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSaved = filterSaved ? report.isSaved : true;
      return matchesSearch && matchesSaved;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'score':
          return b.overallScore - a.overallScore;
        case 'name':
          return a.repositoryName.localeCompare(b.repositoryName);
        case 'issues':
          const aIssues = a.bugsCount + a.vulnerabilitiesCount + a.codeSmellsCount;
          const bIssues = b.bugsCount + b.vulnerabilitiesCount + b.codeSmellsCount;
          return bIssues - aIssues;
        default:
          return 0;
      }
    });

  const toggleSaved = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, isSaved: !report.isSaved } 
        : report
    ));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Analysis Reports</h1>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setFilterSaved(!filterSaved)}
              className={`inline-flex items-center px-3 py-1.5 border ${
                filterSaved 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-300 bg-white text-gray-700'
              } text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <svg 
                className={`-ml-0.5 mr-2 h-4 w-4 ${filterSaved ? 'text-indigo-500' : 'text-gray-400'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Saved Reports
            </button>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="relative rounded-md shadow-sm max-w-xs w-full">
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="mt-3 sm:mt-0">
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <select
              id="sort"
              name="sort"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
              <option value="issues">Sort by Issues</option>
            </select>
          </div>
        </div>
        
        {filteredReports.length === 0 ? (
          <div className="mt-6 text-center py-10 bg-white shadow rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterSaved 
                ? 'Try adjusting your search or filter to find what you&apos;re looking for.' 
                : 'Get started by analyzing a repository.'}
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <li key={report.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getScoreColor(report.overallScore)} bg-opacity-10`}>
                          <span className="font-bold text-lg">{report.overallScore}</span>
                        </div>
                        <div className="ml-4">
                          <Link href={`/dashboard/reports/${report.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-900 truncate">
                            {report.repositoryName}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {report.ownerName} • {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <button
                          onClick={() => toggleSaved(report.id)}
                          className="mr-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {report.isSaved ? (
                            <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </button>
                        <Link
                          href={`/dashboard/reports/${report.id}`}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Report
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span>{report.bugsCount} bugs</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{report.vulnerabilitiesCount} vulnerabilities</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span>{report.codeSmellsCount} code smells</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
  );
}
