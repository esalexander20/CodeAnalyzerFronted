import { NextRequest, NextResponse } from 'next/server';

// Skip static generation for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Disable static optimization
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Prevent import during build time
let getUserByEmail: any;
let validatePassword: any;
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  // Only import when not in build phase
  const db = require('@/lib/db');
  getUserByEmail = db.getUserByEmail;
  validatePassword = db.validatePassword;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getUserByEmail(email);

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Validate password
    const isValidPassword = await validatePassword(user, password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create a safe user object without the password
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    return NextResponse.json({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
