import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from 'src/persistence/repositories/in-memory/in-memory-users-repository.service'
import { Data } from 'src/persistence/repositories/in-memory/data'
import { UsersUseCases } from './users.service'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { hash } from 'bcryptjs'
import { UserDoesntExistError } from './errors/user-doesnt-exist-error'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let data: Data
let usersRepository: InMemoryUsersRepository
let sut: UsersUseCases

describe('Users Use Case', () => {
  beforeEach(() => {
    data = new Data()
    usersRepository = new InMemoryUsersRepository(data)
    sut = new UsersUseCases(usersRepository)
  })

  it('should be able to register a new user', async () => {
    const newUser = {
      name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    }

    const { user } = await sut.register(newUser)

    expect(user).toEqual({
      id: expect.any(String),
      name: newUser.name,
      last_name: newUser.last_name,
      email: newUser.email,
      created_at: expect.any(Date),
      avatar_url: null,
    })
  })

  it('should not be able to register if the email already exists', async () => {
    const newUser = {
      name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    }

    await sut.register(newUser)

    await expect(() => sut.register(newUser)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })

  it('should be able to update the user profile', async () => {
    const userCreated = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const { user } = await sut.updateProfile({
      userId: userCreated.id,
      name: 'Jow',
      last_name: 'Silva',
      email: 'jow@example.com',
      password: '123456',
      new_password: '1234567',
    })

    expect(user).toEqual({
      id: userCreated.id,
      name: 'Jow',
      last_name: 'Silva',
      email: 'jow@example.com',
      created_at: expect.any(Date),
      avatar_url: null,
    })
  })

  it('should not be able to update the profile if the user does not exist', async () => {
    await expect(() =>
      sut.updateProfile({
        userId: '1',
        name: 'Jow',
        last_name: 'Silva',
        email: 'jow@example.com',
        password: '123456',
        new_password: '1234567',
      }),
    ).rejects.toBeInstanceOf(UserDoesntExistError)
  })

  it('should not be able to update the profile if the current password is incorrect', async () => {
    const userCreated = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    await expect(() =>
      sut.updateProfile({
        userId: userCreated.id,
        name: 'Jow',
        last_name: 'Silva',
        email: 'jow@example.com',
        password: '1234567',
        new_password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to update the profile if the new email is already in use', async () => {
    const userCreated = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'jow@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    await expect(() =>
      sut.updateProfile({
        userId: userCreated.id,
        name: 'Jow',
        last_name: 'Silva',
        email: 'jow@example.com',
        password: '123456',
        new_password: '1234567',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
