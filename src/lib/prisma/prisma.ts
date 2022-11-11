import Prisma, * as PrismaAll from '@prisma/client';

const client = Prisma?.PrismaClient || PrismaAll?.PrismaClient;
const prisma = new client();

export default prisma;
