// @ts-ignore - Ignore type errors for Prisma v6
import { PrismaClient } from '@prisma/client';
import { mockPrismaClient } from './prisma-mock';

// Detect if we're in build time
const isBuildTime = process.env.NODE_ENV === 'production' && 
  (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_PHASE === 'phase-export');

// Define the singleton function outside the conditional
const prismaClientSingleton = () => {
  try {
    // @ts-ignore - Ignore type errors for Prisma v6
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (e) {
    console.error('Failed to initialize Prisma Client:', e);
    throw e;
  }
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// If we're in build time, use the mock client
let prismaClient;
if (isBuildTime) {
  console.log('Using mock Prisma client for build');
  prismaClient = mockPrismaClient;
} else {
  // Use the real Prisma client with singleton pattern
  prismaClient = globalForPrisma.prisma ?? prismaClientSingleton();
  
  // Save to global object in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient;
  }
}

// Export the client
export const prisma = prismaClient;
