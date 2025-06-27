import { Module } from '@nestjs/common'
import { RunPhpSriptGateway } from './run-php-script.gateway'
import { UseCasesModule } from 'src/use-cases/use-cases.module'

@Module({
  imports: [UseCasesModule],
  providers: [RunPhpSriptGateway],
  exports: [RunPhpSriptGateway],
})
export class EventsModule {}
