import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Route handler for GET requests
export async function GET(request: NextRequest) {
  try {
    // Get the id from the URL
    const id = request.url.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Fetching analysis with ID:', id);
    
    // First try to find the repository with this ID
    const repository = await prisma.repository.findUnique({
      where: { id }
    });
    
    if (repository) {
      // If we found a repository, get its latest analysis
      const analyses = await prisma.analysis.findMany({
        where: {
          repository_url: repository.url
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      if (analyses && analyses.length > 0) {
        const analysisData = analyses[0];
        
        // Return combined repository and analysis data
        return NextResponse.json({
          id: repository.id,
          repository_url: repository.url,
          repository_name: repository.name,
          owner_name: repository.owner,
          code_quality: analysisData.code_quality,
          bugs_found: analysisData.bugs_found,
          recommendations: analysisData.recommendations || [],
          details: {
            code_structure: analysisData.code_structure || 'No data available',
            performance: analysisData.performance || 'No data available',
            security: analysisData.security || 'No data available',
            best_practices: analysisData.best_practices || 'No data available'
          },
          createdAt: analysisData.createdAt
        });
      }
    }
    
    // If we didn't find a repository, try to find the analysis directly
    const analysis = await prisma.analysis.findUnique({
      where: { id }
    });
    
    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(analysis);
    
  } catch (error: unknown) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}
