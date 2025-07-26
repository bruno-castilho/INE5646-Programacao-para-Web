import { JwtService as JWT } from '@nestjs/jwt'
import { env } from 'src/env'

export class JwtService extends JWT {
  constructor() {
    super({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  }
}
