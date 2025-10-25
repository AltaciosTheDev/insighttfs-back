import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}


//global is Node.js’s global object, similar to window in the browser.
//as unknown as { prisma: PrismaClient } is TypeScript casting:
//First, global as unknown bypasses TypeScript’s strict type for global.
//Then, as { prisma: PrismaClient } tells TypeScript:
//“Trust me, globalForPrisma will have a property prisma of type PrismaClient.”
//Why do this?
//TypeScript doesn’t allow adding new properties to global by default.
//We want to store a PrismaClient instance globally to avoid creating multiple instances in development.

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

