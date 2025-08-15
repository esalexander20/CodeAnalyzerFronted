export interface AnalysisResponse {
  id: string;
  repository_url: string;
  code_quality: number;
  bugs_found: number;
  recommendations: string[];
  details: {
    code_structure: string;
    performance: string;
    security: string;
    best_practices: string;
  };
}

export interface Repository {
  id: string;
  name: string;
  owner: string;
  url: string;
  lastAnalyzed: string | null;
  status: 'pending' | 'completed' | 'failed';
  score?: number;
}
