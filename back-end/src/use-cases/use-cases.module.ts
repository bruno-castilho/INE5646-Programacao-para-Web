import { Module } from '@nestjs/common'
import { RepositoriesModule } from 'src/persistence/repositories/repositories.module'
import { FileSystemModule } from 'src/persistence/file-system/file-system.module'

import { PHPScriptUseCases } from './php-script.service'
import { AuthenticateUseCases } from './authenticate.service'
import { UsersUseCases } from './users.service'
import { DockerService } from 'src/lib/dockernode.service'
import { JwtModule } from '@nestjs/jwt'
import { env } from 'src/env'

@Module({
  imports: [
    RepositoriesModule,
    FileSystemModule,
    JwtModule.register({
      secret: env.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    DockerService,
    AuthenticateUseCases,
    UsersUseCases,
    PHPScriptUseCases,
  ],
  exports: [AuthenticateUseCases, UsersUseCases, PHPScriptUseCases],
})
export class UseCasesModule {}
