import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '../generated/prisma';  // Adjust relative path as needed

// This file initializes a Prisma Client instance to interact with the database.
// It can be imported in other parts of the application to perform database operations.
const prisma = new PrismaClient();

export default prisma;
