import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ENABLE_DEBUG_LOGGING } from '@/lib/config';

interface Repository {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  owner: string;
  url: string;
  lastAnalyzed: Date | null;
  status: string;
  score: number | null;
  userId: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    const repositories = await prisma.repository.findMany({
      where: {
        userId: userId || undefined
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(repositories);
    
  } catch (error: unknown) {
    if (ENABLE_DEBUG_LOGGING) {
      console.error('Error fetching repositories:', error);
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}

// New endpoint to fetch repositories using POST method
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    if (ENABLE_DEBUG_LOGGING) {
      console.log('PUT repositories API called with userId:', userId);
    }
    
    // Get repositories for the user
    const repositories = await prisma.repository.findMany({
      where: {
        userId: userId || undefined
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // For each repository, fetch its analyses separately
    const repositoriesWithAnalyses = await Promise.all(
      repositories.map(async (repo: Repository) => {
        // Find analyses for this repository URL
        const analyses = await prisma.analysis.findMany({
          where: {
            repository_url: repo.url
          }
        });
        
        return {
          ...repo,
          analyses
        };
      })
    );
    
    if (ENABLE_DEBUG_LOGGING) {
      console.log(`Found ${repositories.length} repositories for user ${userId}`);
    }
    return NextResponse.json(repositoriesWithAnalyses);
    
  } catch (error: unknown) {
    if (ENABLE_DEBUG_LOGGING) {
      console.error('Error fetching repositories:', error);
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repository, userId } = body;
    
    // If userId is provided without a repository, it's a fetch request
    if (userId && !repository) {
      if (ENABLE_DEBUG_LOGGING) {
        console.log('POST repositories API called with userId for fetching:', userId);
      }
      
      // Get repositories for the user
      const repositories = await prisma.repository.findMany({
        where: {
          userId: userId || undefined
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      // For each repository, fetch its analyses separately
      const repositoriesWithAnalyses = await Promise.all(
        repositories.map(async (repo: Repository) => {
          // Find analyses for this repository URL
          const analyses = await prisma.analysis.findMany({
            where: {
              repository_url: repo.url
            }
          });
          
          return {
            ...repo,
            analyses
          };
        })
      );
      
      if (ENABLE_DEBUG_LOGGING) {
        console.log(`Found ${repositories.length} repositories for user ${userId}`);
      }
      return NextResponse.json(repositoriesWithAnalyses);
    }
    
    // If repository is provided, it's a create request
    if (!repository || !repository.url) {
      return NextResponse.json(
        { error: 'Invalid repository data' },
        { status: 400 }
      );
    }
    
    // Check if user exists if userId is provided, create if not
    let userData = null;
    if (userId) {
      userData = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      // If user doesn't exist but we have a userId from auth, create the user
      if (!userData) {
        try {
          if (ENABLE_DEBUG_LOGGING) {
            console.log('Creating new user record for userId:', userId);
          }
          userData = await prisma.user.create({
            data: {
              id: userId,
              name: 'User', // Default name
              email: `${userId}@example.com`, // Placeholder email
              password: '' // Empty password since auth is handled by Supabase
            }
          });
          if (ENABLE_DEBUG_LOGGING) {
            console.log('Created new user record:', userData);
          }
        } catch (error) {
          if (ENABLE_DEBUG_LOGGING) {
            console.error('Error creating user record:', error);
          }
        }
      }
      
      // Check if repository with the same URL already exists for this user
      const existingRepository = await prisma.repository.findFirst({
        where: {
          url: repository.url,
          userId: userId
        }
      });
      
      if (existingRepository) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log('Repository already exists for this user:', existingRepository);
        }
        return NextResponse.json({
          success: false,
          message: 'Repository with this URL already exists',
          repository: existingRepository
        }, { status: 409 }); // 409 Conflict
      }
    }
    
    const savedRepository = await prisma.repository.create({
      data: {
        name: repository.name,
        owner: repository.owner,
        url: repository.url,
        lastAnalyzed: repository.lastAnalyzed ? new Date(repository.lastAnalyzed) : null,
        status: repository.status,
        score: repository.score || null,
        // Only include userId if the user exists
        ...(userData ? { userId } : {})
      }
    });
    
    return NextResponse.json({
      success: true,
      repository: savedRepository
    });
    
  } catch (error: unknown) {
    if (ENABLE_DEBUG_LOGGING) {
      console.error('Error saving repository:', error);
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save repository' },
      { status: 500 }
    );
  }
}
