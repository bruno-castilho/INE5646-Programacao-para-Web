import { Inject, Injectable } from '@nestjs/common'
import { env } from 'src/env'
import { LocalFileSystem } from 'src/persistence/file-system/local-file-system.service'
import { FileDoesntExistError } from './errors/file-doesnt-exist-error'
import { NotFileOwnerError } from './errors/not-file-owner-error'
import { UserDoesntExistError } from './errors/user-doesnt-exist-error'
import { FileOwnerError } from './errors/file-owner-error'
import { UserAlreadyHasAccessToTheFile } from './errors/user-already-has-access-to-the-file'
import { UserDoesntHasAccessToTheFile } from './errors/user-doesnt-has-access-to-the-file'
import { DockerService } from 'src/lib/dockernode.service'
import {
  FILES_REPOSITORY,
  SHARED_FILES_REPOSITORY,
  USERS_REPOSITORY,
} from 'src/persistence/repositories/repositories.module'

import { UsersRepository } from 'src/persistence/repositories/interfaces/users-repository'
import { FilesRepository } from 'src/persistence/repositories/interfaces/files-repository'
import { SharedFilesRepository } from 'src/persistence/repositories/interfaces/shared-files-repository'

@Injectable()
export class PHPScriptUseCases {
  constructor(
    private docker: DockerService,
    @Inject(FILES_REPOSITORY)
    private filesRepository: FilesRepository,
    private localFileSystem: LocalFileSystem,
    @Inject(SHARED_FILES_REPOSITORY)
    private sharedFilesRepository: SharedFilesRepository,
    @Inject(USERS_REPOSITORY) private usersRepository: UsersRepository,
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
        Memory: 104857600, // Limit 100 MB
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
        isPrivate,
        created_by: userId,
        updated_by: userId,
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

    const file = await this.filesRepository.findById({
      fileId,
    })

    if (!file) throw new FileDoesntExistError()

    if (file.created_by_id !== userId) {
      const sharedFile = await this.sharedFilesRepository.findByUserIdAndFileId(
        {
          fileId,
          userId,
        },
      )

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
        updated_by: userId,
      },
      fileId,
    })
  }

  async removeFile(params: { userId: string; fileId: string }) {
    const { userId, fileId } = params

    const file = await this.filesRepository.findById({
      fileId,
    })

    if (!file) throw new FileDoesntExistError()

    if (file.created_by_id !== userId) throw new NotFileOwnerError()

    await this.localFileSystem.deleteFile({
      filename: fileId,
      foldername: file.created_by_id,
    })

    await this.filesRepository.delete({
      fileId,
    })
  }

  async shareFile(params: { fileId: string; userId: string; email: string }) {
    const { fileId, userId, email } = params

    const file = await this.filesRepository.findById({
      fileId,
    })

    if (!file) throw new FileDoesntExistError()

    if (file.created_by_id !== userId) throw new NotFileOwnerError()

    const user = await this.usersRepository.findByEmail({ email })

    if (!user?.id) throw new UserDoesntExistError()

    if (user.id === userId) throw new FileOwnerError()

    let sharedFile = await this.sharedFilesRepository.findByUserIdAndFileId({
      fileId,
      userId: user.id,
    })

    if (sharedFile) throw new UserAlreadyHasAccessToTheFile()

    sharedFile = await this.sharedFilesRepository.create({
      data: {
        fileId,
        userId: user.id,
      },
    })

    return sharedFile
  }

  async unshareFile(params: { fileId: string; userId: string; email: string }) {
    const { fileId, userId, email } = params

    const file = await this.filesRepository.findById({
      fileId,
    })

    if (!file) throw new FileDoesntExistError()

    if (file.created_by_id !== userId) throw new NotFileOwnerError()

    const user = await this.usersRepository.findByEmail({ email })

    if (!user?.id) throw new UserDoesntExistError()

    const sharedFile = await this.sharedFilesRepository.findByUserIdAndFileId({
      fileId,
      userId: user.id,
    })

    if (!sharedFile) throw new UserDoesntHasAccessToTheFile()

    await this.sharedFilesRepository.delete({
      fileId,
      userId: user.id,
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

    const { files, total } = await this.filesRepository.searchByCreatedBy({
      createdBy: userId,
      orderBy,
      page,
      perPage,
      query,
      sortBy,
    })

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

    const { files, total } = await this.filesRepository.searchBySharedWith({
      sharedWith: userId,
      orderBy,
      page,
      perPage,
      query,
      sortBy,
    })

    return {
      files,
      total,
    }
  }

  async downloadFile(params: { userId?: string; fileId: string }) {
    const { userId, fileId } = params

    const file = await this.filesRepository.findById({
      fileId,
    })

    if (!file) throw new FileDoesntExistError()

    if (file.private && file.created_by_id !== userId) {
      if (!userId) throw new UserDoesntHasAccessToTheFile()

      const sharedFile = await this.sharedFilesRepository.findByUserIdAndFileId(
        {
          fileId,
          userId,
        },
      )

      if (!sharedFile) throw new UserDoesntHasAccessToTheFile()
    }

    const fileContent = await this.localFileSystem.getFile({
      foldername: file.created_by_id,
      filename: file.id,
    })

    return { fileContent, filename: file.name }
  }
}
