import { Module } from '@nestjs/common'
import { ZodExceptionFilter } from './zod-exception.filter'
import { InvalidCredentialsExceptionFilter } from './invalid-credentials-exception.filter'
import { UserAlreadyExistsExceptionFilter } from './user-already-exists-exception.filter'
import { APP_FILTER } from '@nestjs/core'

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: UserAlreadyExistsExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: InvalidCredentialsExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ZodExceptionFilter,
    },
  ],
})
export class FiltersModule {}
