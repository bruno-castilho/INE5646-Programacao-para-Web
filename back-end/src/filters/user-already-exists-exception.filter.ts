import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { UserAlreadyExistsError } from 'src/use-cases/errors/user-already-exists-error'

@Catch(UserAlreadyExistsError)
export class UserAlreadyExistsExceptionFilter implements ExceptionFilter {
  catch(error: UserAlreadyExistsError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    response.status(409).send({
      message: error.message,
    })
  }
}
