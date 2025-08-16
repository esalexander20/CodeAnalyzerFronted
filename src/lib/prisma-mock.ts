/**
 * Mock Prisma client for build time
 * This file provides mock implementations of Prisma methods used during build
 */

// Mock repository methods
const mockRepositoryMethods = {
  findUnique: async () => null,
  findFirst: async () => null,
  findMany: async () => [],
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({}),
  count: async () => 0,
};

// Mock analysis methods
const mockAnalysisMethods = {
  findUnique: async () => null,
  findFirst: async () => null,
  findMany: async () => [],
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({}),
  count: async () => 0,
};

// Mock user methods
const mockUserMethods = {
  findUnique: async () => null,
  findFirst: async () => null,
  findMany: async () => [],
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({}),
  count: async () => 0,
};

// Export mock Prisma client
export const mockPrismaClient = {
  repository: mockRepositoryMethods,
  analysis: mockAnalysisMethods,
  user: mockUserMethods,
  $connect: async () => {},
  $disconnect: async () => {},
};
