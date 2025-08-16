import { NextRequest, NextResponse } from 'next/server';

// Skip static generation for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Disable static optimization
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Prevent import during build time
let createClient: any;
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  // Only import when not in build phase
  createClient = require('@/lib/supabase-server').createClient;
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { name } = body;

    // Create a Supabase client
    const supabase = await createClient();

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Update the user metadata
    const { error } = await supabase.auth.updateUser({
      data: { name }
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating your profile' },
      { status: 500 }
    );
  }
}
