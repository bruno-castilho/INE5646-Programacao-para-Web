import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  ORIGIN: z.string().default('*'),
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  LOCAL_FILE_SYSTEM_SOURCE_PATH: z.string().default(`${process.cwd()}/files`),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
