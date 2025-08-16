'use client';

import { useState, useEffect } from 'react';
import RepositoryForm from '@/components/repository/RepositoryForm';
import RepositoryCard from '@/components/repository/RepositoryCard';
import AnalysisResults from '@/components/repository/AnalysisResults';
import { AnalysisResponse, Repository } from '@/types/repository';
import { useAuth } from '@/contexts/AuthContext';

// Repository type is imported from types

export default function DashboardPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  // State for loading and error handling
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Loading and error UI components
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
  
  const ErrorMessage = () => (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
  const { user } = useAuth(); // Get authenticated user from context
  
  // Load repositories from the database when user changes
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setIsLoadingData(true);
        setErrorMessage(null);
        
        // Get the authenticated user ID from context or localStorage
        const loggedInUserId = user?.id || localStorage.getItem('userId');
        console.log('Fetching repositories for authenticated user:', loggedInUserId);
        
        // Fetch repositories from the API using PUT method
        const response = await fetch('/api/repositories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: loggedInUserId
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        
        const data = await response.json();
        console.log('API response data:', data);
        
        // Check if data is an array before mapping
        if (Array.isArray(data)) {
          // Format the repositories from the database
          interface RepositoryWithAnalyses extends Repository {
            analyses?: Array<{
              id: string;
              createdAt: string;
              code_quality: number;
              code_structure?: string;
              performance?: string;
              security?: string;
              best_practices?: string;
              bugs_found?: number;
              recommendations?: string[];
            }>;
          }
          
          const formattedRepos = data.map((repo: RepositoryWithAnalyses) => {
            // Get the latest analysis if available
            const latestAnalysis = repo.analyses && repo.analyses.length > 0 
              ? repo.analyses.sort((a, b) => 
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
              // Store the full analysis data for later use
              analysisData: latestAnalysis
            };
          });
          
          console.log('Formatted repositories with analyses:', formattedRepos);
          setRepositories(formattedRepos.length > 0 ? formattedRepos : []);
        } else {
          console.error('API response is not an array:', data);
          setRepositories([]);
        }
      } catch (err: unknown) {
        console.error('Error fetching repositories:', err);
        setErrorMessage(err instanceof Error ? err.message : 'Failed to load repositories');
        setRepositories([]); // Empty array on error
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchRepositories();
  }, [user]);

  return (
    <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {isLoadingData && <LoadingSpinner />}
        {errorMessage && <ErrorMessage />}
        
        <div className="mt-6">
          <RepositoryForm onAnalysisComplete={(analysis) => {
            setAnalysisResults(analysis);
            
            // Extract repository name and owner from URL
            const urlParts = analysis.repository_url.split('/');
            const repoName = urlParts[urlParts.length - 1] || '';
            const ownerName = urlParts[urlParts.length - 2] || '';
            
            // Create a new repository object from the analysis
            const newRepo: Repository = {
              id: analysis.id,
              name: repoName,
              owner: ownerName,
              url: analysis.repository_url,
              lastAnalyzed: new Date().toISOString(),
              status: 'completed',
              score: analysis.code_quality
            };
            
            // Add the new repository to the list
            setRepositories(prevRepos => [newRepo, ...prevRepos]);
            
            // Save analysis to localStorage for persistence
            try {
              const savedAnalyses = localStorage.getItem('codeAnalyzerAnalyses');
              const analyses = savedAnalyses ? JSON.parse(savedAnalyses) as AnalysisResponse[] : [];
              analyses.unshift(analysis);
              localStorage.setItem('codeAnalyzerAnalyses', JSON.stringify(analyses));
            } catch (err) {
              console.error('Error saving analysis to localStorage:', err);
            }
          }} />
        </div>
        
        {/* Analysis Results */}
        {analysisResults && (
          <div className="mt-6">
            <AnalysisResults analysis={analysisResults} />
          </div>
        )}
        
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Repositories</h2>
            <div className="flex space-x-2">
              <div>
                <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                <select
                  id="status-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'pending')}
                >
                  <option value="all">All Repositories</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {repositories
              .filter(repo => {
                // Apply search filter
                const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                     repo.owner.toLowerCase().includes(searchTerm.toLowerCase());
                
                // Apply status filter
                const matchesStatus = statusFilter === 'all' || repo.status === statusFilter;
                
                return matchesSearch && matchesStatus;
              })
              .map((repo) => (
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
            {repositories.filter(repo => {
              const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                   repo.owner.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesStatus = statusFilter === 'all' || repo.status === statusFilter;
              return matchesSearch && matchesStatus;
            }).length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500">
                <svg className="h-12 w-12 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">No repositories found</p>
                <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
  <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Analysis Overview</h2>
  <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
    {/* Card 1: Total Repositories */}
    <div className="relative rounded-2xl bg-white/70 dark:bg-gray-900/60 shadow-xl backdrop-blur-md border border-white/30 p-6 flex flex-col items-center justify-center overflow-hidden transition-transform hover:scale-[1.03] group">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 opacity-30 rounded-full blur-2xl z-0 animate-spin-slow" />
      <div className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-lg mb-3">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4H8V3" /></svg>
      </div>
      <dt className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Repositories</dt>
      <dd className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{repositories.length}</dd>
    </div>
    {/* Card 2: Completed Analyses */}
    <div className="relative rounded-2xl bg-white/70 dark:bg-gray-900/60 shadow-xl backdrop-blur-md border border-white/30 p-6 flex flex-col items-center justify-center overflow-hidden transition-transform hover:scale-[1.03] group">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-green-400 via-teal-400 to-cyan-400 opacity-30 rounded-full blur-2xl z-0 animate-spin-slow" />
      <div className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-green-500 to-cyan-500 text-white shadow-lg mb-3">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4" /><circle cx="12" cy="12" r="9" /></svg>
      </div>
      <dt className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Completed Analyses</dt>
      <dd className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{repositories.filter(repo => repo.status === 'completed').length}</dd>
    </div>
    {/* Card 3: Average Score */}
    <div className="relative rounded-2xl bg-white/70 dark:bg-gray-900/60 shadow-xl backdrop-blur-md border border-white/30 p-6 flex flex-col items-center justify-center overflow-hidden transition-transform hover:scale-[1.03] group">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-yellow-400 via-orange-400 to-pink-400 opacity-30 rounded-full blur-2xl z-0 animate-spin-slow" />
      <div className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-500 to-pink-500 text-white shadow-lg mb-3">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75V17.75M12 2v2m0 16v2m8.485-8.485l-1.415 1.415M4.93 4.93l1.415 1.415m12.02 12.02l-1.415-1.415M4.93 19.07l1.415-1.415M21 12h2M1 12H3" /><circle cx="12" cy="12" r="5" /></svg>
      </div>
      <dt className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Average Score</dt>
      <dd className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        {(() => {
          const completedRepos = repositories.filter(repo => repo.status === 'completed' && repo.score !== undefined);
          if (completedRepos.length === 0) return 'N/A';
          const totalScore = completedRepos.reduce((sum, repo) => sum + (repo.score || 0), 0);
          return (totalScore / completedRepos.length).toFixed(1);
        })()}
      </dd>
    </div>
  </div>
</div>
    </div>
  );
}
