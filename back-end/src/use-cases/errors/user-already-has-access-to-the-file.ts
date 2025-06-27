import { ConflictException } from '@nestjs/common'

export class UserAlreadyHasAccessToTheFile extends ConflictException {
  constructor() {
    super('Usuario já tem acesso ao arquivo')
  }
}
