import { prisma } from './prisma';

// Dynamic imports for bcrypt to ensure it's only loaded on the server side
const getBcrypt = async () => {
  return await import('bcrypt');
};

// User authentication functions
export async function createUser(name: string, email: string, password: string) {
  const bcrypt = await getBcrypt();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function validatePassword(user: { password: string }, password: string) {
  const bcrypt = await getBcrypt();
  return bcrypt.compare(password, user.password);
}

// Repository functions
export async function getRepositoriesByUserId(userId: string) {
  return prisma.repository.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createRepository(data: {
  name: string;
  owner: string;
  url: string;
  status: string;
  userId: string;
}) {
  return prisma.repository.create({
    data,
  });
}

export async function updateRepositoryStatus(id: string, status: string, score?: number) {
  return prisma.repository.update({
    where: { id },
    data: {
      status,
      score,
      lastAnalyzed: new Date(),
    },
  });
}

// Analysis functions
export async function createAnalysis(data: {
  repository_url: string;
  code_quality: number;
  bugs_found: number;
  recommendations: string[];
  code_structure: string;
  performance: string;
  security: string;
  best_practices: string;
  userId?: string;
}) {
  return prisma.analysis.create({
    data,
  });
}

export async function getAnalysesByUserId(userId: string) {
  return prisma.analysis.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAnalysisById(id: string) {
  return prisma.analysis.findUnique({
    where: { id },
  });
}
