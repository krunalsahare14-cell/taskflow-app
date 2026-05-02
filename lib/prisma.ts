import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Get the connection string from your environment variables
const connectionString = `${process.env.DATABASE_URL}`;

// Initialize the connection pool and adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Cache the Prisma instance in development to prevent connection exhaustion
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;