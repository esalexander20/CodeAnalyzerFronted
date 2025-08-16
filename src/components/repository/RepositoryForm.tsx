import React, { useState } from 'react';
import { AnalysisResponse } from '@/types/repository';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL, ENABLE_DEBUG_LOGGING } from '@/lib/config';
import ErrorBoundary from '@/components/common/ErrorBoundary';

interface RepositoryFormProps {
  onAnalysisComplete: (analysis: AnalysisResponse) => void;
}

export default function RepositoryForm({ onAnalysisComplete }: RepositoryFormProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth(); // Get the authenticated user from context

  const validateGitHubUrl = (url: string) => {
    // Basic validation for GitHub repository URLs
    const githubUrlPattern = /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/;
    return githubUrlPattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    // Validate GitHub URL format
    if (!validateGitHubUrl(repoUrl)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)');
      setIsLoading(false);
      return;
    }
    
    try {
      // Get the authenticated user ID from context
      const loggedInUserId = user?.id || localStorage.getItem('userId');
      
      if (!loggedInUserId) {
        setError('You must be logged in to analyze repositories');
        setIsLoading(false);
        return;
      }
      
      if (ENABLE_DEBUG_LOGGING) {
        console.log('Using authenticated user ID for analysis:', loggedInUserId);
      }
      
      // Make actual API call to backend
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repository_url: repoUrl,
          user_id: loggedInUserId
        }),
      });
      
      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 404) {
          throw new Error('API endpoint not found. Please check if the backend server is running.');
        } else if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Invalid request: ${errorData.detail || 'Could not clone repository'}`);
        } else if (response.status === 500) {
          throw new Error('Server error. The repository may be too large or inaccessible.');
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      }
      
      const analysisData: AnalysisResponse = await response.json();
      
      // Save repository to database
      try {
        const saveRepoResponse = await fetch('/api/repositories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            repository: {
              name: repoUrl.split('/').slice(-2, -1)[0],
              owner: repoUrl.split('/').slice(-3, -2)[0],
              url: repoUrl,
              lastAnalyzed: new Date().toISOString(),
              status: 'completed',
              score: analysisData.code_quality
            },
            userId: loggedInUserId
          }),
        });
        
        let isDuplicate = false;
        
        if (!saveRepoResponse.ok) {
          const responseData = await saveRepoResponse.json();
          
          // Handle duplicate repository error (409 Conflict)
          if (saveRepoResponse.status === 409) {
            if (ENABLE_DEBUG_LOGGING) {
              console.log('Repository already exists:', responseData);
            }
            // We'll still show the analysis results but with a warning
            setSuccess('Analysis completed! Note: This repository was already analyzed before.');
            isDuplicate = true; // Mark as duplicate to skip saving analysis
          } else {
            console.warn('Failed to save repository to database:', responseData);
            // Continue even if saving to database fails
          }
        } else {
          setSuccess('Repository analyzed and saved successfully!');
        }
        
        // Only save the analysis if the repository is not a duplicate
        if (!isDuplicate) {
          if (ENABLE_DEBUG_LOGGING) {
            console.log('Saving new analysis with user ID:', loggedInUserId);
          }
          
          // Now save the analysis data separately
          const saveAnalysisResponse = await fetch('/api/analysis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              analysis: analysisData,
              userId: loggedInUserId
            }),
          });
          
          if (!saveAnalysisResponse.ok) {
            console.warn('Failed to save analysis details to database:', await saveAnalysisResponse.text());
            // Continue even if saving analysis to database fails
          } else {
            if (ENABLE_DEBUG_LOGGING) {
              console.log('Analysis details saved to database successfully');
            }
          }
        } else {
          if (ENABLE_DEBUG_LOGGING) {
            console.log('Skipping analysis save for duplicate repository');
          }
        }
      } catch (saveErr) {
        console.error('Error saving data to database:', saveErr);
        // Continue even if saving to database fails
      }
      
      setRepoUrl('');
      
      // Pass the analysis data to the parent component
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisData);
      }
    } catch (err: unknown) {
      console.error('Analysis error:', err);
      
      // Display a user-friendly error message
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
          setError('Could not connect to the analysis server. Please check if the backend is running.');
        } else {
          setError(err.message || 'Failed to analyze repository. Please try again.');
        }
      } else {
        setError('Failed to analyze repository. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Analyze GitHub Repository</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Enter the URL of a GitHub repository to analyze its code quality, detect bugs, and get improvement suggestions.</p>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-5 sm:flex sm:items-center" onSubmit={handleSubmit}>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="repoUrl" className="sr-only">GitHub Repository URL</label>
            <input
              type="text"
              name="repoUrl"
              id="repoUrl"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : 'Analyze Repository'}
          </button>
        </form>
      </div>
    </div>
    </ErrorBoundary>
  );
}
