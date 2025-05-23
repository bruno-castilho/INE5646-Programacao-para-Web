import { Module } from '@nestjs/common'
import { RegisterUseCase } from './register.service'
import { LoginUseCase } from './login.service'
import { RepositoriesModule } from 'src/repositories/repositories.module'

@Module({
  imports: [RepositoriesModule],
  providers: [RegisterUseCase, LoginUseCase],
  exports: [RegisterUseCase, LoginUseCase],
})
export class UseCasesModule {}
