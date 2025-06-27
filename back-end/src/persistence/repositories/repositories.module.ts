import { Module } from '@nestjs/common'
import {
  PrismaFilesRepository,
  PrismaSharedFilesRepository,
  PrismaUsersRepository,
} from './prisma-repository.service'
import { PrismaService } from 'src/lib/prisma.service'

@Module({
  providers: [
    PrismaService,
    PrismaUsersRepository,
    PrismaFilesRepository,
    PrismaSharedFilesRepository,
  ],
  exports: [
    PrismaUsersRepository,
    PrismaFilesRepository,
    PrismaSharedFilesRepository,
  ],
})
export class RepositoriesModule {}
