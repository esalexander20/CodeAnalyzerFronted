import { AnalysisResponse, Repository } from '@/types/repository';

/**
 * Service to handle GitHub repository analysis operations
 */
export const analysisService = {
  /**
   * Save analysis results to the database
   */
  saveAnalysis: async (analysis: AnalysisResponse, userId?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis,
          userId: userId || 'test-user-123' // Default user ID for testing
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to save analysis:', await response.text());
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving analysis:', error);
      return false;
    }
  },
  
  /**
   * Fetch repositories from the database
   */
  fetchRepositories: async (userId?: string): Promise<Repository[]> => {
    try {
      const response = await fetch(`/api/repositories?userId=${userId || 'test-user-123'}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return [];
    }
  },
  
  /**
   * Fetch analysis results from the database
   */
  fetchAnalyses: async (userId?: string): Promise<AnalysisResponse[]> => {
    try {
      const response = await fetch(`/api/analysis?userId=${userId || 'test-user-123'}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analyses');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching analyses:', error);
      return [];
    }
  },
  
  /**
   * Analyze a GitHub repository
   */
  analyzeRepository: async (repoUrl: string, userId?: string): Promise<AnalysisResponse | null> => {
    try {
      // Call the backend API to analyze the repository
      const response = await fetch(`${process.env.BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repository_url: repoUrl,
          user_id: userId || 'test-user-123'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const analysisData: AnalysisResponse = await response.json();
      
      // Save the analysis to the database
      await analysisService.saveAnalysis(analysisData, userId);
      
      return analysisData;
    } catch (error) {
      console.error('Error analyzing repository:', error);
      return null;
    }
  }
};
