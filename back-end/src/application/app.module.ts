import { Module } from '@nestjs/common'
import { UseCasesModule } from 'src/use-cases/use-cases.module'
import { FiltersModule } from './filters/filters.module'
import { EventsModule } from './events/events.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { FilesController } from './controllers/files.controller'
import { UsersController } from './controllers/users.controller'
import { GuardsModule } from './guards/guards.module'

@Module({
  imports: [UseCasesModule, FiltersModule, EventsModule, GuardsModule],
  providers: [],
  controllers: [AuthenticateController, FilesController, UsersController],
})
export class AppModule {}
