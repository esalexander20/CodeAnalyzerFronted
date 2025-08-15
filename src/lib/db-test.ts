import { prisma } from './prisma';

/**
 * Test function to verify database connection
 * Run this with: `npx ts-node src/lib/db-test.ts`
 */
async function testDatabaseConnection() {
  try {
    // Try to count users as a simple test
    const userCount = await prisma.user.count();
    console.log('✅ Database connection successful!');
    console.log(`Found ${userCount} users in the database.`);
    
    // Additional test - check if we can query other tables
    const repoCount = await prisma.repository.count();
    const analysisCount = await prisma.analysis.count();
    
    console.log(`Found ${repoCount} repositories and ${analysisCount} analyses.`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    return false;
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
}

// Execute the test if this file is run directly
if (require.main === module) {
  testDatabaseConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { testDatabaseConnection };
