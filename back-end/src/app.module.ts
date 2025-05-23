import { Module } from '@nestjs/common'
import { FiltersModule } from './filters/filters.module'
import { JwtModule } from '@nestjs/jwt'
import { AuthenticateController } from './controllers/authenticate.controller'
import { UseCasesModule } from './use-cases/use-cases.module'
import { env } from './env'

@Module({
  imports: [
    UseCasesModule,
    FiltersModule,
    JwtModule.register({
      secret: env.SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthenticateController],
})
export class AppModule {}
