import { NextRequest, NextResponse } from 'next/server';

// Skip static generation for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Disable static optimization
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Prevent import during build time
let createUser: any;
let getUserByEmail: any;
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  // Only import when not in build phase
  const db = require('@/lib/db');
  createUser = db.createUser;
  getUserByEmail = db.getUserByEmail;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await createUser(name, email, password);

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
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
