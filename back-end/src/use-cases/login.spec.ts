import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { LoginUseCase } from './login.service'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: LoginUseCase

describe('Login Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new LoginUseCase(usersRepository)
  })

  it('should be able to login', async () => {
    await usersRepository.create({
      name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to login with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to login with wrong password', async () => {
    await usersRepository.create({
      name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
