import { ForbiddenException } from '@nestjs/common'

export class NotFileOwnerError extends ForbiddenException {
  constructor() {
    super('Usuario não é proprietário do arquivo')
  }
}
