import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const UserModel = {
  async create(data: {
    fullName: string
    tcId: string
    email: string
    username: string
    password: string
  }) {
    return await prisma.user.create({ data })
  },

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } })
  },

  async findByUsername(username: string) {
    return await prisma.user.findUnique({ where: { username } })
  },

  async findByTcId(tcId: string) {
    return await prisma.user.findUnique({ where: { tcId } })
  }
}

export default UserModel
