import { Inject, Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { UserDoesntExistError } from './errors/user-doesnt-exist-error'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { USERS_REPOSITORY } from 'src/persistence/repositories/repositories.module'
import { UsersRepository } from 'src/persistence/repositories/interfaces/users-repository'

@Injectable()
export class UsersUseCases {
  constructor(
    @Inject(USERS_REPOSITORY) private usersRepository: UsersRepository,
  ) {}

  async register(params: {
    name: string
    last_name: string
    email: string
    password: string
  }) {
    const { name, last_name, email, password } = params

    const userWithSameEmail = await this.usersRepository.findByEmail({
      email,
    })

    if (userWithSameEmail) throw new UserAlreadyExistsError()

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      data: {
        name,
        last_name,
        email,
        password_hash,
      },
    })

    return { user }
  }

  async updateProfile(params: {
    userId: string
    name: string
    last_name: string
    email: string
    password: string
    new_password?: string
  }) {
    const { userId, name, last_name, email, password, new_password } = params

    const user = await this.usersRepository.findByIdWithPassword({
      userId,
    })

    if (!user) throw new UserDoesntExistError()

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    const changedEmail = user.email !== email

    if (changedEmail) {
      const userWithSameEmail =
        await this.usersRepository.findByEmailWithPassword({
          email,
        })

      if (userWithSameEmail) throw new UserAlreadyExistsError()
    }

    const password_hash = new_password
      ? await hash(new_password, 6)
      : new_password

    const userUpdated = await this.usersRepository.update({
      userId,
      data: {
        name,
        last_name,
        email,
        password_hash,
      },
    })

    return { user: userUpdated }
  }
}
