import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // 1. On instancie l'adaptateur PostgreSQL avec ton URL
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  })

  // 2. On passe l'adaptateur à Prisma. L'erreur "non-empty options" va disparaître !
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma