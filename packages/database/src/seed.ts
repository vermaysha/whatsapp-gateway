import { PrismaClient } from '@prisma/client'
import { hash } from 'hash'

const prisma = new PrismaClient()

async function main() {
  // Users Seeders
  await prisma.user.upsert({
    where: {
      username: 'admin',
    },
    update: {},
    create: {
      firstName: 'Administrator',
      username: 'admin',
      password: await hash('password'),
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
  })
