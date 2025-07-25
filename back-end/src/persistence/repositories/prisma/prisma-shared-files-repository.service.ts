import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/lib/prisma.service'
import { SharedFilesRepository } from '../interfaces/shared-files-repository'

@Injectable()
export class PrismaSharedFilesRepository implements SharedFilesRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: {
    data: {
      fileId: string
      userId: string
    }
  }) {
    const {
      data: { fileId, userId },
    } = params

    return await this.prisma.sharedFile.create({
      data: {
        file: {
          connect: {
            id: fileId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
  }

  async delete(params: { userId: string; fileId: string }) {
    const { fileId, userId } = params
    await this.prisma.sharedFile.delete({
      where: {
        user_id_file_id: {
          user_id: userId,
          file_id: fileId,
        },
      },
    })
  }

  async findByUserIdAndFileId(params: { userId: string; fileId: string }) {
    const { fileId, userId } = params

    return await this.prisma.sharedFile.findUnique({
      where: {
        user_id_file_id: {
          user_id: userId,
          file_id: fileId,
        },
      },
    })
  }
}
