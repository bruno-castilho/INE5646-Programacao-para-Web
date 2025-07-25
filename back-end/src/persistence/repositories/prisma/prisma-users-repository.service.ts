import { PrismaService } from 'src/lib/prisma.service'
import { UsersRepository } from '../interfaces/users-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: {
    data: {
      name: string
      last_name: string
      email: string
      password_hash: string
    }
  }) {
    const { data } = params

    return await this.prisma.user.create({
      omit: { password_hash: true },
      data,
    })
  }

  async update(params: {
    userId: string
    data: {
      name?: string
      last_name?: string
      email?: string
      password_hash?: string
    }
  }) {
    const { userId, data } = params

    return this.prisma.user.update({
      omit: { password_hash: true },
      data,
      where: {
        id: userId,
      },
    })
  }

  async findById(params: { userId: string }) {
    const { userId } = params
    return this.prisma.user.findUnique({
      omit: {
        password_hash: true,
      },
      where: {
        id: userId,
      },
    })
  }

  async findByEmail(params: { email: string }) {
    const { email } = params
    return this.prisma.user.findUnique({
      omit: {
        password_hash: true,
      },
      where: {
        email,
      },
    })
  }

  async findByIdWithPassword(params: { userId: string }) {
    const { userId } = params

    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
  }

  async findByEmailWithPassword(params: { email: string }) {
    const { email } = params
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
  }
}
