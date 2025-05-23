import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'
import { Inject, Injectable } from '@nestjs/common'

interface RegisterUseCaseParams {
  name: string
  last_name: string
  email: string
  password: string
}
interface RegisterUseCaseResponse {
  user: User
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private usersRepository: UsersRepository,
  ) {}

  async execute({
    name,
    last_name,
    email,
    password,
  }: RegisterUseCaseParams): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) throw new UserAlreadyExistsError()

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      last_name,
      email,
      password_hash,
    })

    return { user }
  }
}
