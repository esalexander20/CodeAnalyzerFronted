import { NextRequest, NextResponse } from 'next/server';
import { AnalysisResponse } from '@/types/repository';

// Skip static generation for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Disable static optimization
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Prevent import during build time
let prisma: any;
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  // Only import prisma when not in build phase
  prisma = require('@/lib/prisma').prisma;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysis, userId } = body as { analysis: AnalysisResponse; userId: string };
    
    if (!analysis || !analysis.repository_url) {
      return NextResponse.json(
        { error: 'Invalid analysis data' },
        { status: 400 }
      );
    }

    // Extract repository name and owner from URL
    const urlParts = analysis.repository_url.split('/');
    const repoName = urlParts[urlParts.length - 1] || '';
    const ownerName = urlParts[urlParts.length - 2] || '';
    
    // First, check if user exists if userId is provided, create if not
    let userData = null;
    if (userId) {
      userData = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      // If user doesn't exist but we have a userId from auth, create the user
      if (!userData) {
        try {
          console.log('Creating new user record for userId:', userId);
          userData = await prisma.user.create({
            data: {
              id: userId,
              name: 'User', // Default name
              email: `${userId}@example.com`, // Placeholder email
              password: '' // Empty password since auth is handled by Supabase
            }
          });
          console.log('Created new user record:', userData);
        } catch (error) {
          console.error('Error creating user record:', error);
        }
      }
    }
    
    // Save the repository without linking to user if user doesn't exist
    const repository = await prisma.repository.create({
      data: {
        name: repoName,
        owner: ownerName,
        url: analysis.repository_url,
        lastAnalyzed: new Date(),
        status: 'completed',
        score: analysis.code_quality,
        // Only include userId if the user exists
        ...(userData ? { userId } : {})
      }
    });
    
    // Then, save the analysis with details
    const savedAnalysis = await prisma.analysis.create({
      data: {
        repository_url: analysis.repository_url,
        code_quality: analysis.code_quality,
        bugs_found: analysis.bugs_found,
        recommendations: analysis.recommendations,
        code_structure: analysis.details?.code_structure || '',
        performance: analysis.details?.performance || '',
        security: analysis.details?.security || '',
        best_practices: analysis.details?.best_practices || '',
        // Only include userId if the user exists
        ...(userData ? { userId } : {})
      }
    });
    
    return NextResponse.json({
      success: true,
      repository: repository,
      analysis: savedAnalysis
    });
    
  } catch (error: unknown) {
    console.error('Error saving analysis:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save analysis' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    const analyses = await prisma.analysis.findMany({
      where: {
        userId: userId || undefined
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    return NextResponse.json(analyses);
    
  } catch (error: unknown) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}
