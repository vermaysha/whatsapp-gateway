import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Device seeders
  await prisma.device.create({
    data: {
      name: 'Default',
    },
  })

  // Users Seeders
  // await prisma.user.upsert({
  //   where: {
  //     username: 'admin',
  //   },
  //   update: {},
  //   create: {
  //     username: 'admin',
  //     email: 'admin@gmail.com',
  //     password: 'password',

  //     firstName: 'Administrator',
  //     birthday: new Date(),

  //     createdAt: new Date(),
  //     updatedAt: new Date(),

  //     device: {
  //       connectOrCreate: [
  //         {
  //           where: {
  //             id: 'clgz9gjdp00003p6jef3u93cv',
  //           },
  //           create: {
  //             id: 'clgz9gjdp00003p6jef3u93cv',
  //             name: 'Default',
  //             createdAt: new Date(),
  //             updatedAt: new Date(),
  //           },
  //         },
  //       ],
  //     },
  //   },
  // })
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
