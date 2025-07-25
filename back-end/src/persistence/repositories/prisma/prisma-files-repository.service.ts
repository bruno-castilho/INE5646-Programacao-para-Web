import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/lib/prisma.service'
import { FilesRepository } from '../interfaces/files-repository'

@Injectable()
export class PrismaFilesRepository implements FilesRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: {
    data: {
      name: string
      type?: string
      isPrivate?: boolean
      created_by: string
      updated_by: string
    }
  }) {
    const {
      data: { name, type, isPrivate, created_by, updated_by },
    } = params

    return await this.prisma.file.create({
      data: {
        name,
        type,
        private: isPrivate,
        created_by: {
          connect: { id: created_by },
        },
        updated_by: {
          connect: { id: updated_by },
        },
      },
    })
  }

  async update(params: {
    data: { name: string; updated_by: string }
    fileId: string
  }) {
    const {
      data: { name, updated_by },
      fileId,
    } = params

    return await this.prisma.file.update({
      data: {
        name,
        updated_at: new Date(),
        updated_by: {
          connect: { id: updated_by },
        },
      },
      where: {
        id: fileId,
      },
    })
  }

  async delete(params: { fileId: string }) {
    const { fileId } = params

    await this.prisma.file.delete({
      where: {
        id: fileId,
      },
    })
  }

  async findById(params: { fileId: string }) {
    const { fileId } = params

    return await this.prisma.file.findUnique({
      where: {
        id: fileId,
      },
    })
  }

  async searchByCreatedBy(params: {
    query: string
    createdBy: string
    orderBy: 'asc' | 'desc'
    sortBy: 'name' | 'updated_at'
    page: number
    perPage: number
  }) {
    const { query, createdBy, orderBy, sortBy, page, perPage } = params

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        include: {
          created_by: { select: { email: true } },
          updated_by: { select: { email: true } },
          shared_with: {
            include: {
              user: {
                select: { id: true, email: true },
              },
            },
          },
        },
        where: {
          name: { contains: query },
          created_by_id: createdBy,
        },
        orderBy: { [sortBy]: orderBy },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.file.count({
        where: {
          name: { contains: query },
          created_by_id: createdBy,
        },
      }),
    ])

    return {
      files,
      total,
    }
  }

  async searchBySharedWith(params: {
    query: string
    sharedWith: string
    orderBy: 'asc' | 'desc'
    sortBy: 'name' | 'updated_at'
    page: number
    perPage: number
  }) {
    const { query, sharedWith, orderBy, sortBy, page, perPage } = params

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        include: {
          created_by: { select: { email: true } },
          updated_by: { select: { email: true } },
          shared_with: {
            include: {
              user: {
                select: { id: true, email: true },
              },
            },
          },
        },
        where: {
          name: { contains: query },
          shared_with: {
            some: { user_id: sharedWith },
          },
        },
        orderBy: {
          [sortBy]: orderBy,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.file.count({
        where: {
          name: { contains: query },
          shared_with: {
            some: { user_id: sharedWith },
          },
        },
      }),
    ])

    return {
      files,
      total,
    }
  }
}
