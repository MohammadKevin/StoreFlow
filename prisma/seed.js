const { PrismaClient, Role } = require('@prisma/client')
const bcrypt = require('bcrypt')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL

  if (!email) {
    throw new Error('SUPER_ADMIN_EMAIL is missing')
  }

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (existingAdmin) {
    console.log('Super admin already exists')
    return
  }

  const hashedPassword = await bcrypt.hash(
    process.env.SUPER_ADMIN_PASSWORD,
    10,
  )

  await prisma.user.create({
    data: {
      name: process.env.SUPER_ADMIN_NAME,
      email,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  })

  console.log('Super admin created successfully')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
  