import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from 'src/persistence/repositories/in-memory/in-memory-users-repository.service'
import { Data } from 'src/persistence/repositories/in-memory/data'
import { PHPScriptUseCases } from './php-script.service'
import { LocalFileSystem } from 'src/persistence/file-system/local-file-system.service'
import { SharedFilesRepository } from 'src/persistence/repositories/interfaces/shared-files-repository'
import { UsersRepository } from 'src/persistence/repositories/interfaces/users-repository'
import { FilesRepository } from 'src/persistence/repositories/interfaces/files-repository'
import { InMemoryFilesRepository } from 'src/persistence/repositories/in-memory/in-memory-files-repository.service'
import { InMemorySharedFilesRepository } from 'src/persistence/repositories/in-memory/in-memory-shared-files-repository.service'
import { DockerService } from 'src/lib/dockernode.service'
import { env } from 'src/env'
import { FileDoesntExistError } from './errors/file-doesnt-exist-error'
import { UserDoesntHaveAccessToTheFile } from './errors/user-doesnt-have-access-to-the-file'
import { NotFileOwnerError } from './errors/not-file-owner-error'
import { hash } from 'bcryptjs'
import { UserDoesntExistError } from './errors/user-doesnt-exist-error'
import { FileOwnerError } from './errors/file-owner-error'
import { UserAlreadyHasAccessToTheFile } from './errors/user-already-has-access-to-the-file'

const docker = new DockerService()

let localFileSystem: LocalFileSystem
let data: Data
let filesRepository: FilesRepository
let sharedFilesRepository: SharedFilesRepository
let usersRepository: UsersRepository
let sut: PHPScriptUseCases

describe('Users Use Case', () => {
  beforeEach(() => {
    localFileSystem = new LocalFileSystem()
    data = new Data()
    usersRepository = new InMemoryUsersRepository(data)
    filesRepository = new InMemoryFilesRepository(data)
    sharedFilesRepository = new InMemorySharedFilesRepository(data)
    sut = new PHPScriptUseCases(
      docker,
      localFileSystem,
      filesRepository,
      sharedFilesRepository,
      usersRepository,
    )
  })

  it('should be able to run php script', async () => {
    const { logs } = await sut.runPHPScript({
      clientId: 'client1',
      script: '<?php echo "Hello, World!";',
    })

    expect(logs).toEqual('Hello, World!')
  })

  it('should be able to clean run php script', { timeout: 60000 }, async () => {
    const buffer = Buffer.from('<?php sleep(600);')

    await localFileSystem.saveFile({
      foldername: 'tmp/client2',
      filename: 'script.php',
      content: buffer,
    })

    const container = await docker.createContainer({
      name: 'client2',
      Image: 'php:8.2-cli',
      Tty: false,
      WorkingDir: '/app',
      HostConfig: {
        Binds: [`${env.LOCAL_FILE_SYSTEM_SOURCE_PATH}/tmp/client2:/app`],
        Memory: 104857600, // Limit 100 MB
        AutoRemove: true,
      },
      Cmd: ['sh', '-c', 'php /app/script.php > /app/file.logs 2>&1'],
    })

    await container.start()

    await sut.cleanRunPHPScript({
      clientId: 'client2',
    })
  })

  it('should be able to create file', async () => {
    const fileContent = Buffer.from('<?php sleep(600);')

    const { fileId } = await sut.createFile({
      userId: 'userId',
      name: 'script.php',
      fileContent,
    })

    expect(fileId).toEqual(expect.any(String))
  })

  it('should be able to update file', async () => {
    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await sut.updateFile({
      userId: 'userId',
      name: 'script2.php',
      fileId: file.id,
      fileContent: Buffer.from('<?php sleep(60);'),
    })

    const fileUpdated = await filesRepository.findById({
      fileId: file.id,
    })

    const fileUpdatedContent = await localFileSystem.getFile({
      foldername: 'userId',
      filename: file.id,
    })

    expect(fileUpdated).toEqual({
      id: expect.any(String),
      name: 'script2.php',
      private: true,
      type: 'text/php',
      created_by_id: 'userId',
      updated_by_id: 'userId',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    })

    expect(fileUpdatedContent.toString('utf-8')).equal('<?php sleep(60);')
  })

  it('should not be able to update file if file does not exist', async () => {
    await expect(() =>
      sut.updateFile({
        fileId: 'fileId',
        fileContent: Buffer.from('<?php sleep(600);'),
        name: 'script.php',
        userId: 'userId',
      }),
    ).rejects.toBeInstanceOf(FileDoesntExistError)
  })

  it('should not be able to update file if user does not have access to the file', async () => {
    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await expect(() =>
      sut.updateFile({
        fileId: file.id,
        fileContent: Buffer.from('<?php sleep(600);'),
        name: 'script.php',
        userId: 'userWithOutAccess',
      }),
    ).rejects.toBeInstanceOf(UserDoesntHaveAccessToTheFile)
  })

  it('should be able to remove file', async () => {
    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await sut.removeFile({
      fileId: file.id,
      userId: 'userId',
    })

    const fileRemoved = await filesRepository.findById({
      fileId: file.id,
    })

    expect(fileRemoved).toEqual(null)

    await expect(
      localFileSystem.getFile({
        foldername: 'userId',
        filename: file.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to remove file if file does not exist', async () => {
    await expect(() =>
      sut.removeFile({
        fileId: 'fileId',
        userId: 'userId',
      }),
    ).rejects.toBeInstanceOf(FileDoesntExistError)
  })

  it('should not be able to remove file if user is not owner', async () => {
    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await expect(() =>
      sut.removeFile({
        fileId: file.id,
        userId: 'userNotOwner',
      }),
    ).rejects.toBeInstanceOf(NotFileOwnerError)
  })

  it('should be able to share file', async () => {
    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    const user = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const { sharedFile } = await sut.shareFile({
      fileId: file.id,
      userId: 'userId',
      email: 'johndoe@example.com',
    })

    expect(sharedFile).toEqual({
      id: expect.any(String),
      user_id: user.id,
      file_id: file.id,
      shared_at: expect.any(Date),
    })
  })

  it('should not be able to share file if file does not exist', async () => {
    await expect(() =>
      sut.shareFile({
        fileId: 'fileId',
        userId: 'userId',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(FileDoesntExistError)
  })

  it('should not be able to share file if user is not owner', async () => {
    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await expect(() =>
      sut.shareFile({
        fileId: file.id,
        userId: 'userNotOwner',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(NotFileOwnerError)
  })

  it('should not be able to share the file if the target user does not exist', async () => {
    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await expect(() =>
      sut.shareFile({
        fileId: file.id,
        userId: 'userId',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(UserDoesntExistError)
  })

  it('should not be able to share the file if the target user is the owner', async () => {
    const user = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: user.id,
        updated_by: user.id,
      },
    })

    await localFileSystem.saveFile({
      foldername: user.id,
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await expect(() =>
      sut.shareFile({
        fileId: file.id,
        userId: user.id,
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(FileOwnerError)
  })

  it('should not be able to share the file if the target user already has access to the file', async () => {
    const user = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await sharedFilesRepository.create({
      data: {
        fileId: file.id,
        userId: user.id,
      },
    })

    await expect(() =>
      sut.shareFile({
        fileId: file.id,
        userId: 'userId',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyHasAccessToTheFile)
  })

  it('should be able to unshare file', async () => {
    const user = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await sharedFilesRepository.create({
      data: {
        fileId: file.id,
        userId: user.id,
      },
    })

    await sut.unshareFile({
      fileId: file.id,
      userId: 'userId',
      email: 'johndoe@example.com',
    })

    const sharedFile = await sharedFilesRepository.findByUserIdAndFileId({
      fileId: file.id,
      userId: user.id,
    })

    expect(sharedFile).toEqual(null)
  })

  it('should not be able to unshare file if file does not exist', async () => {
    await expect(() =>
      sut.unshareFile({
        fileId: 'fileId',
        userId: 'userId',
        email: 'johndoe@example.com',
      }),
    ).rejects.instanceOf(FileDoesntExistError)
  })

  it('should not be able to unshare file if user is not owner', async () => {
    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await expect(() =>
      sut.unshareFile({
        fileId: file.id,
        userId: 'userNotOwner',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(NotFileOwnerError)
  })

  it('should not be able to unshare the file if the target user does not exist', async () => {
    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await expect(() =>
      sut.unshareFile({
        fileId: file.id,
        userId: 'userId',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(UserDoesntExistError)
  })

  it('should not be able to unshare the file if the target user does not have access to the file', async () => {
    await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await expect(() =>
      sut.unshareFile({
        fileId: file.id,
        userId: 'userId',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(UserDoesntHaveAccessToTheFile)
  })

  it('should be able to search personal files', async () => {
    for (let i = 0; i < 3; i++) {
      await filesRepository.create({
        data: {
          name: `script-${i + 1}.php`,
          created_by: 'userId',
          updated_by: 'userId',
        },
      })
    }

    await filesRepository.create({
      data: {
        name: `file.php`,
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    const { files, total } = await sut.searchPersonalFiles({
      userId: 'userId',
      page: 2,
      perPage: 2,
      orderBy: 'desc',
      query: 'script-',
      sortBy: 'name',
    })

    expect(files).toEqual([
      {
        id: expect.any(String),
        name: 'script-1.php',
        updated_at: expect.any(Date),
        updated_by: {
          email: expect.any(String),
        },
        created_by: {
          email: expect.any(String),
        },
        shared_with: [],
      },
    ])

    expect(total).toEqual(3)
  })

  it('should be able to search files shared with me', async () => {
    for (let i = 0; i < 3; i++) {
      const file = await filesRepository.create({
        data: {
          name: `script-${i + 1}.php`,
          created_by: 'userId',
          updated_by: 'userId',
        },
      })

      await sharedFilesRepository.create({
        data: {
          fileId: file.id,
          userId: 'userId2',
        },
      })
    }

    for (let i = 0; i < 3; i++) {
      await filesRepository.create({
        data: {
          name: `script-${i + 1}.php`,
          created_by: 'userId',
          updated_by: 'userId',
        },
      })
    }

    const file = await filesRepository.create({
      data: {
        name: `file.php`,
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await sharedFilesRepository.create({
      data: {
        fileId: file.id,
        userId: 'userId2',
      },
    })

    const { files, total } = await sut.searchFilesSharedWithMe({
      userId: 'userId2',
      page: 2,
      perPage: 2,
      orderBy: 'desc',
      query: 'script-',
      sortBy: 'name',
    })

    expect(files).toEqual([
      {
        id: expect.any(String),
        name: 'script-1.php',
        updated_at: expect.any(Date),
        updated_by: {
          email: expect.any(String),
        },
        created_by: {
          email: expect.any(String),
        },
        shared_with: [expect.any(Object)],
      },
    ])

    expect(total).toEqual(3)
  })

  it('should be able to download file', async () => {
    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    const { fileContent, filename } = await sut.downloadFile({
      userId: 'userId',
      fileId: file.id,
    })

    expect(filename).toEqual('script.php')
    expect(fileContent.toString('utf-8')).toEqual('<?php sleep(600);')
  })

  it('should not be able to download file if the file does not exist', async () => {
    await expect(() =>
      sut.downloadFile({
        fileId: 'fileId',
        userId: 'userId',
      }),
    ).rejects.instanceOf(FileDoesntExistError)
  })

  it('should not be able to download file if the user does not have access to the file', async () => {
    const file = await filesRepository.create({
      data: {
        name: 'script.php',
        created_by: 'userId',
        updated_by: 'userId',
      },
    })

    await localFileSystem.saveFile({
      foldername: 'userId',
      filename: file.id,
      content: Buffer.from('<?php sleep(600);'),
    })

    await expect(() =>
      sut.downloadFile({
        fileId: file.id,
        userId: 'userIdWithOutAccess',
      }),
    ).rejects.instanceOf(UserDoesntHaveAccessToTheFile)
  })
})
