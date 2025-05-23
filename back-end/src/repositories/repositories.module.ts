import { Module } from '@nestjs/common'
import { PrismaUsersRepository } from './prisma/prisma-users-repository.service'
import { USERS_REPOSITORY } from './users-repository'

@Module({
  providers: [
    {
      provide: USERS_REPOSITORY,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [USERS_REPOSITORY],
})
export class RepositoriesModule {}
