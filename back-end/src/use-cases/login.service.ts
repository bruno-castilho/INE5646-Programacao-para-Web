import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import {
  USERS_REPOSITORY,
  UsersRepository,
} from 'src/repositories/users-repository'
import { User } from '@prisma/client'
import { Inject, Injectable } from '@nestjs/common'

interface LoginUseCaseRequest {
  email: string
  password: string
}

interface LoginUseCaseResponse {
  user: User
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private usersRepository: UsersRepository,
  ) {}

  async execute({
    email,
    password,
  }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    return {
      user,
    }
  }
}
