import { Module } from '@nestjs/common'
import {
  PrismaFilesRepository,
  PrismaSharedFilesRepository,
  PrismaUsersRepository,
} from './prisma-repository.service'
import { PrismaService } from 'src/lib/prisma.service'

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY')
export const FILES_REPOSITORY = Symbol('FILES_REPOSITORY')
export const SHARED_FILES_REPOSITORY = Symbol('SHARED_FILES_REPOSITORY')

@Module({
  providers: [
    PrismaService,
    {
      provide: USERS_REPOSITORY,
      useClass: PrismaUsersRepository,
    },
    {
      provide: FILES_REPOSITORY,
      useClass: PrismaFilesRepository,
    },
    {
      provide: SHARED_FILES_REPOSITORY,
      useClass: PrismaSharedFilesRepository,
    },
  ],
  exports: [USERS_REPOSITORY, FILES_REPOSITORY, SHARED_FILES_REPOSITORY],
})
export class RepositoriesModule {}
