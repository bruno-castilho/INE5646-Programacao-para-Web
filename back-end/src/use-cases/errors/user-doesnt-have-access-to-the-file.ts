import { BadRequestException } from '@nestjs/common'

export class UserDoesntHaveAccessToTheFile extends BadRequestException {
  constructor() {
    super('Usuario não tem acesso ao arquivo')
  }
}
