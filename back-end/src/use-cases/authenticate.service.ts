import { Inject, Injectable } from '@nestjs/common'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { UserDoesntExistError } from './errors/user-doesnt-exist-error'
import { USERS_REPOSITORY } from 'src/persistence/repositories/repositories.module'
import { UsersRepository } from 'src/persistence/repositories/interfaces/users-repository'
import { JwtService } from 'src/lib/jwt.service'

@Injectable()
export class AuthenticateUseCases {
  constructor(
    @Inject(USERS_REPOSITORY) private usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(params: { email: string; password: string }) {
    const { email, password } = params

    const user = await this.usersRepository.findByEmailWithPassword({
      email,
    })

    if (!user) throw new InvalidCredentialsError()

    const { password_hash, ...userWithOutPassword } = user

    const doesPasswordMatches = await compare(password, password_hash ?? '')

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    const access_token = await this.jwtService.signAsync(userWithOutPassword)

    return {
      access_token,
      user: userWithOutPassword,
    }
  }

  async logged(params: { access_token: string }) {
    const { access_token } = params

    const { id } = await this.jwtService.verifyAsync(access_token)

    const user = await this.usersRepository.findById({
      userId: id,
    })

    if (!user) throw new UserDoesntExistError()

    const newAccessToken = await this.jwtService.signAsync(user)

    return {
      access_token: newAccessToken,
      user,
    }
  }

  async verifyAcess(params: { access_token: string }) {
    const { access_token } = params

    const user = await this.jwtService.verifyAsync(access_token)

    return {
      user,
    }
  }
}
