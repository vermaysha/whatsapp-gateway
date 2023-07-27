import { PrismaClient } from '@prisma/client'
import { hash } from 'hash'

const prisma = new PrismaClient()

async function main() {
  // Device seeders
  await prisma.device.upsert({
    where: {
      id: 'cd605fd7-7d9a-4791-af32-11def9de2833',
    },
    create: {
      name: 'Default',
    },
    update: {},
  })

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
