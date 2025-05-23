import fastifyCookie from '@fastify/cookie'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { env } from './env'
import fastifyCors from '@fastify/cors'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  await app.register(fastifyCors, {
    origin: true,
    credentials: true,
  })
  await app.register(fastifyCookie)
  await app.listen(env.PORT ?? 3000)
}
bootstrap()
