'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import RepositoryCard from '@/components/repository/RepositoryCard';
import RepositoryForm from '@/components/repository/RepositoryForm';
import { AnalysisResponse, Repository } from '@/types/repository';

// Empty array for repositories
const emptyRepositories: Repository[] = [];

export default function RepositoriesPage() {
  const { user } = useAuth();
  const [repositories, setRepositories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch repositories using our API endpoint
  useEffect(() => {
    async function fetchRepositories() {
      if (!user?.id) {
        console.log('No user ID available, skipping repository fetch');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError('');
        
        console.log('Fetching repositories for user ID:', user.id);
        
        // Use the same API endpoint as the dashboard
        const response = await fetch('/api/repositories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response data:', data);
        
        // Format the repositories from the database
        if (Array.isArray(data)) {
          const formattedRepos = data.map((repo: any) => {
            // Get the latest analysis if available
            const latestAnalysis = repo.analyses && repo.analyses.length > 0 
              ? repo.analyses.sort((a: any, b: any) => 
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] 
              : null;
              
            return {
              id: repo.id,
              name: repo.name,
              owner: repo.owner,
              url: repo.url,
              lastAnalyzed: repo.lastAnalyzed,
              status: latestAnalysis ? 'completed' : (repo.status || 'pending'),
              score: latestAnalysis ? latestAnalysis.code_quality : repo.score,
              analysisData: latestAnalysis
            };
          });
          
          console.log('Formatted repositories with analyses:', formattedRepos);
          setRepositories(formattedRepos);
        } else {
          console.error('API response is not an array:', data);
          setRepositories([]);
        }
      } catch (err: any) {
        console.error('Error fetching repositories:', err);
        setError(err.message || 'Failed to load repositories');
        setRepositories([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRepositories();
  }, [user?.id]);
  
  // Handle successful analysis completion
  const handleAnalysisComplete = async (analysis: AnalysisResponse) => {
    // Refresh repositories list
    if (user?.id) {
      try {
        // Use the API endpoint to fetch updated repositories
        const response = await fetch('/api/repositories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Repositories refreshed after analysis:', data);
        
        if (Array.isArray(data)) {
          const formattedRepos = data.map((repo: any) => {
            const latestAnalysis = repo.analyses && repo.analyses.length > 0 
              ? repo.analyses.sort((a: any, b: any) => 
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] 
              : null;
              
            return {
              id: repo.id,
              name: repo.name,
              owner: repo.owner,
              url: repo.url,
              lastAnalyzed: repo.lastAnalyzed,
              status: latestAnalysis ? 'completed' : (repo.status || 'pending'),
              score: latestAnalysis ? latestAnalysis.code_quality : repo.score,
              analysisData: latestAnalysis
            };
          });
          
          setRepositories(formattedRepos);
        }
      } catch (error) {
        console.error('Error refreshing repositories after analysis:', error);
      }
    }
  };

  // Filter repositories based on search term and status filter
  const filteredRepositories = repositories.filter((repo: any) => {
    const matchesSearch = repo.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          repo.owner?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || repo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">My Repositories</h1>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh All
          </button>
        </div>
        
        <div className="mt-6">
          <RepositoryForm onAnalysisComplete={handleAnalysisComplete} />
        </div>
        
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-medium text-gray-900">Repository List</h2>
            <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="mt-6 text-center py-10 bg-white shadow rounded-lg">
              <div className="animate-pulse flex justify-center">
                <div className="h-8 w-8 bg-indigo-200 rounded-full"></div>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Loading repositories...</h3>
            </div>
          ) : error ? (
            <div className="mt-6 text-center py-10 bg-white shadow rounded-lg">
              <svg className="mx-auto h-12 w-12 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">{error}</h3>
              <p className="mt-1 text-sm text-gray-500">Please try again later.</p>
            </div>
          ) : filteredRepositories.length === 0 ? (
            <div className="mt-6 text-center py-10 bg-white shadow rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No repositories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter to find what you&apos;re looking for.' 
                  : 'Get started by adding a new repository for analysis.'}
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRepositories.map((repo) => (
                <RepositoryCard
                  key={repo.id}
                  id={repo.id}
                  name={repo.name}
                  owner={repo.owner}
                  url={repo.url}
                  lastAnalyzed={repo.lastAnalyzed}
                  status={repo.status}
                  score={repo.score}
                />
              ))}
            </div>
          )}
        </div>
      </div>
  );
}
