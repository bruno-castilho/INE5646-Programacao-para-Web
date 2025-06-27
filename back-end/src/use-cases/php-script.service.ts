import { Injectable } from '@nestjs/common'
import { env } from 'src/env'
import { LocalFileSystem } from 'src/persistence/file-system/local-file-system.service'

import {
  PrismaFilesRepository,
  PrismaSharedFilesRepository,
  PrismaUsersRepository,
} from 'src/persistence/repositories/prisma-repository.service'
import { FileDoesntExistError } from './errors/file-doesnt-exist-error'
import { NotFileOwnerError } from './errors/not-file-owner-error'
import { UserDoesntExistError } from './errors/user-doesnt-exist-error'
import { FileOwnerError } from './errors/file-owner-error'
import { UserAlreadyHasAccessToTheFile } from './errors/user-already-has-access-to-the-file'
import { UserDoesntHasAccessToTheFile } from './errors/user-doesnt-has-access-to-the-file'
import { DockerService } from 'src/lib/dockernode.service'

@Injectable()
export class PHPScriptUseCases {
  constructor(
    private filesRepository: PrismaFilesRepository,
    private localFileSystem: LocalFileSystem,
    private sharedFilesRepository: PrismaSharedFilesRepository,
    private usersRepository: PrismaUsersRepository,
    private docker: DockerService,
  ) {}

  async runPHPScript(params: { clientId: string; script: string }) {
    const { clientId, script } = params

    const buffer = Buffer.from(script)

    await this.localFileSystem.saveFile({
      foldername: `tmp/${clientId}`,
      filename: 'script.php',
      content: buffer,
    })

    const container = await this.docker.createContainer({
      name: clientId,
      Image: 'php:8.2-cli',
      Tty: false,
      WorkingDir: '/app',
      HostConfig: {
        Binds: [`${env.LOCAL_FILE_SYSTEM_SOURCE_PATH}/tmp/${clientId}:/app`],
        Memory: 104857600, // Limita a 100 MB
        AutoRemove: true,
      },
      Cmd: ['sh', '-c', 'php /app/script.php > /app/file.logs 2>&1'],
    })

    await container.start()

    await container.wait()

    const fileLogs = await this.localFileSystem.getFile({
      foldername: `tmp/${clientId}`,
      filename: 'file.logs',
    })

    const logs = fileLogs.toString('utf-8')

    return {
      logs,
    }
  }

  async cleanRunPHPScript(params: { clientId: string }) {
    const { clientId } = params

    await this.localFileSystem.deleteFolder({
      foldername: `tmp/${clientId}`,
    })

    const container = this.docker.getContainer(clientId)
    await container.stop()
  }

  async createFile(params: {
    userId: string
    name: string
    type?: string
    isPrivate?: boolean
    fileContent: Buffer
  }) {
    const { userId, name, type, isPrivate, fileContent } = params

    const file = await this.filesRepository.create({
      data: {
        name,
        type,
        private: isPrivate,
        created_by: {
          connect: { id: userId },
        },
        updated_by: {
          connect: { id: userId },
        },
        updated_at: new Date(),
        created_at: new Date(),
      },
    })

    await this.localFileSystem.saveFile({
      foldername: userId,
      filename: file.id,
      content: fileContent,
    })

    return {
      fileId: file.id,
    }
  }

  async updateFile(params: {
    userId: string
    name: string
    fileId: string
    fileContent: Buffer
  }) {
    const { userId, name, fileId, fileContent } = params

    const file = await this.filesRepository.findUnique({
      where: {
        id: fileId,
      },
    })

    if (!file) throw new FileDoesntExistError()

    if (file.created_by_id !== userId) {
      const sharedFile = await this.sharedFilesRepository.findUnique({
        where: {
          user_id_file_id: {
            file_id: fileId,
            user_id: userId,
          },
        },
      })

      if (!sharedFile) throw new UserDoesntHasAccessToTheFile()
    }

    await this.localFileSystem.saveFile({
      foldername: file.created_by_id,
      filename: fileId,
      content: fileContent,
    })

    await this.filesRepository.update({
      data: {
        name,
        updated_at: new Date(),
        updated_by: {
          connect: { id: userId },
        },
      },
      where: {
        id: fileId,
      },
    })
  }

  async removeFile(params: { userId: string; fileId: string }) {
    const { userId, fileId } = params

    const file = await this.filesRepository.findUnique({
      where: {
        id: fileId,
      },
    })

    if (!file) throw new FileDoesntExistError()

    if (file.created_by_id !== userId) throw new NotFileOwnerError()

    await this.localFileSystem.deleteFile({
      filename: fileId,
      foldername: file.created_by_id,
    })

    await this.filesRepository.delete({
      where: {
        id: fileId,
      },
    })
  }

  async shareFile(params: { fileId: string; userId: string; email: string }) {
    const { fileId, userId, email } = params

    const file = await this.filesRepository.findUnique({
      where: {
        id: fileId,
      },
    })

    if (!file) throw new FileDoesntExistError()

    if (file.created_by_id !== userId) throw new NotFileOwnerError()

    const user = await this.usersRepository.findUnique({ where: { email } })

    if (!user) throw new UserDoesntExistError()

    if (user.id === userId) throw new FileOwnerError()

    let sharedFile = await this.sharedFilesRepository.findUnique({
      where: {
        user_id_file_id: {
          user_id: user.id,
          file_id: fileId,
        },
      },
    })

    if (sharedFile) throw new UserAlreadyHasAccessToTheFile()

    sharedFile = await this.sharedFilesRepository.create({
      omit: {
        id: true,
        file_id: true,
        user_id: true,
      },
      include: {
        user: {
          omit: {
            password_hash: true,
          },
        },
      },
      data: {
        file: {
          connect: {
            id: fileId,
          },
        },
        user: {
          connect: { email },
        },
      },
    })

    return sharedFile
  }

  async unshareFile(params: { fileId: string; userId: string; email: string }) {
    const { fileId, userId, email } = params

    const file = await this.filesRepository.findUnique({
      where: { id: fileId },
    })

    if (!file) throw new FileDoesntExistError()

    if (file.created_by_id !== userId) throw new NotFileOwnerError()

    const user = await this.usersRepository.findUnique({ where: { email } })

    if (!user) throw new UserDoesntExistError()

    const sharedFile = await this.sharedFilesRepository.findUnique({
      where: {
        user_id_file_id: {
          user_id: user.id,
          file_id: fileId,
        },
      },
    })

    if (!sharedFile) throw new UserDoesntHasAccessToTheFile()

    await this.sharedFilesRepository.delete({
      where: {
        user_id_file_id: {
          user_id: user.id,
          file_id: fileId,
        },
      },
    })
  }

  async searchPersonalFiles(params: {
    userId: string
    query: string
    page: number
    perPage: number
    orderBy: 'asc' | 'desc'
    sortBy: 'name' | 'updated_at'
  }) {
    const { userId, query, page, perPage, orderBy, sortBy } = params

    const [files, total] = await Promise.all([
      this.filesRepository.findMany({
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
          created_by_id: userId,
        },
        orderBy: { [sortBy]: orderBy },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.filesRepository.count({
        where: {
          name: { contains: query },
          created_by_id: userId,
        },
      }),
    ])

    return {
      files,
      total,
    }
  }

  async searchFilesSharedWithMe(params: {
    userId: string
    query: string
    page: number
    perPage: number
    orderBy: 'asc' | 'desc'
    sortBy: 'name' | 'updated_at'
  }) {
    const { userId, query, page, perPage, orderBy, sortBy } = params

    const [files, total] = await Promise.all([
      this.filesRepository.findMany({
        include: {
          created_by: {
            select: {
              email: true,
            },
          },
          updated_by: {
            select: {
              email: true,
            },
          },
          shared_with: {
            omit: { id: true, file_id: true, user_id: true },
            include: {
              user: {
                omit: {
                  password_hash: true,
                },
              },
            },
          },
        },
        where: {
          name: { contains: query },
          shared_with: {
            some: { user_id: userId },
          },
        },
        orderBy: {
          [sortBy]: orderBy,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.filesRepository.count({
        where: {
          name: { contains: query },
          shared_with: {
            some: { user_id: userId },
          },
        },
      }),
    ])

    return {
      files,
      total,
    }
  }

  async downloadFile(params: { userId?: string; fileId: string }) {
    const { userId, fileId } = params

    const file = await this.filesRepository.findUnique({
      where: {
        id: fileId,
      },
    })

    if (!file) throw new FileDoesntExistError()

    if (file.private && file.created_by_id !== userId) {
      if (!userId) throw new UserDoesntHasAccessToTheFile()

      const sharedFile = await this.sharedFilesRepository.findUnique({
        where: {
          user_id_file_id: {
            file_id: fileId,
            user_id: userId,
          },
        },
      })

      if (!sharedFile) throw new UserDoesntHasAccessToTheFile()
    }

    const fileContent = await this.localFileSystem.getFile({
      foldername: file.created_by_id,
      filename: file.id,
    })

    return { fileContent, filename: file.name }
  }
}
