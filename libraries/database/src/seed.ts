import { prisma } from "./client";
import { hash } from 'argon2'

;(async () => {
  const now = new Date();
  const pass = await hash('12345678')
  await prisma.user.upsert({
    where: {
      username: 'admin',
    },
    update: {},
    create: {
      username: 'admin',
      password: pass.toString(),
      fullname: 'Administrator',
      createdAt: now,
      updatedAt: now,
    }
  })
})()
