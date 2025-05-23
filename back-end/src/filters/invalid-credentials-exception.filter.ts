import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { InvalidCredentialsError } from 'src/use-cases/errors/invalid-credentials-error'

@Catch(InvalidCredentialsError)
export class InvalidCredentialsExceptionFilter implements ExceptionFilter {
  catch(error: InvalidCredentialsError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    response.status(401).send({
      message: error.message,
    })
  }
}
