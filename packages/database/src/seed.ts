import { PrismaClient } from '@prisma/client'
import { hash } from 'hash'

const prisma = new PrismaClient()

async function main() {
  // Device seeders
  await prisma.devices.upsert({
    where: {
      id: '64b4b3616ab8705e17bc68a3',
    },
    create: {
      name: 'Default',
    },
    update: {},
  })

  // Users Seeders
  await prisma.users.upsert({
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
