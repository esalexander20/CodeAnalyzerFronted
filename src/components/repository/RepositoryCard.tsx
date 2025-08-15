import React from 'react';
import Link from 'next/link';

interface RepositoryCardProps {
  id: string;
  name: string;
  owner: string;
  url: string;
  lastAnalyzed: string | null;
  status: 'pending' | 'completed' | 'failed';
  score?: number;
}

export default function RepositoryCard({
  id,
  name,
  owner,
  url,
  lastAnalyzed,
  status,
  score
}: RepositoryCardProps) {
  
  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500">{owner}</p>
            </div>
          </div>
          <div>
            {getStatusBadge()}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                View on GitHub
              </a>
            </div>
            <div>
              {lastAnalyzed && (
                <span className="text-gray-500">
                  Last analyzed: {new Date(lastAnalyzed).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {status === 'completed' && score !== undefined && (
          <div className="mt-4">
            <div className="flex items-center">
              <div className="text-sm font-medium text-gray-500">Code Quality Score:</div>
              <div className="ml-2 text-sm font-medium">
                <span className={`px-2 py-1 rounded ${
                  score >= 80 ? 'bg-green-100 text-green-800' : 
                  score >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {score}/100
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <Link href={`/dashboard/reports/${id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
            {status === 'completed' ? 'View Analysis Report' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
}
