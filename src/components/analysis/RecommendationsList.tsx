'use client';

import { useState } from 'react';

interface Recommendation {
  id: string;
  category: 'architecture' | 'performance' | 'security' | 'best_practice';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  codeExample?: string;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export default function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);

  // Filter recommendations based on selected category
  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedCategory === 'all') return true;
    return rec.category === selectedCategory;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'architecture': return 'Architecture';
      case 'performance': return 'Performance';
      case 'security': return 'Security';
      case 'best_practice': return 'Best Practice';
      default: return category;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Medium Priority</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Low Priority</span>;
      default:
        return null;
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case 'easy':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Easy Fix</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Medium Effort</span>;
      case 'hard':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Complex Fix</span>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'architecture':
        return (
          <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        );
      case 'performance':
        return (
          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'security':
        return (
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'best_practice':
        return (
          <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
        
        <div className="mb-6">
          <div className="sm:hidden">
            <label htmlFor="recommendation-category" className="sr-only">Select a category</label>
            <select
              id="recommendation-category"
              name="category"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="architecture">Architecture</option>
              <option value="performance">Performance</option>
              <option value="security">Security</option>
              <option value="best_practice">Best Practices</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`${
                    selectedCategory === 'all'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory('architecture')}
                  className={`${
                    selectedCategory === 'architecture'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Architecture
                </button>
                <button
                  onClick={() => setSelectedCategory('performance')}
                  className={`${
                    selectedCategory === 'performance'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Performance
                </button>
                <button
                  onClick={() => setSelectedCategory('security')}
                  className={`${
                    selectedCategory === 'security'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Security
                </button>
                <button
                  onClick={() => setSelectedCategory('best_practice')}
                  className={`${
                    selectedCategory === 'best_practice'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Best Practices
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No recommendations found in this category.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {getCategoryIcon(recommendation.category)}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{recommendation.title}</h4>
                      <p className="mt-1 text-sm text-gray-600">{recommendation.description}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex flex-col space-y-1">
                    {getPriorityBadge(recommendation.priority)}
                    {getEffortBadge(recommendation.effort)}
                  </div>
                </div>
                
                {recommendation.codeExample && (
                  <div className="mt-4">
                    <button
                      onClick={() => setExpandedRecommendation(expandedRecommendation === recommendation.id ? null : recommendation.id)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
                    >
                      {expandedRecommendation === recommendation.id ? 'Hide Example' : 'View Example'}
                      <svg className={`ml-1 h-4 w-4 transform ${expandedRecommendation === recommendation.id ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {expandedRecommendation === recommendation.id && (
                      <div className="mt-2">
                        <pre className="bg-gray-800 text-white p-3 rounded-md text-xs overflow-x-auto">
                          {recommendation.codeExample}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
