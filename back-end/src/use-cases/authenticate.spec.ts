import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { AuthenticateUseCases } from './authenticate.service'
import { InMemoryUsersRepository } from 'src/persistence/repositories/in-memory/in-memory-users-repository.service'
import { JwtService } from 'src/lib/jwt.service'
import { Data } from 'src/persistence/repositories/in-memory/data'
import { JsonWebTokenError } from '@nestjs/jwt'

let data: Data
let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCases
let jwtService: JwtService

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    data = new Data()
    usersRepository = new InMemoryUsersRepository(data)
    jwtService = new JwtService()
    sut = new AuthenticateUseCases(usersRepository, jwtService)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to do login', async () => {
    await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const { user, access_token } = await sut.login({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(access_token).toEqual(expect.any(String))
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to do login with wrong email', async () => {
    await expect(() =>
      sut.login({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to do login with wrong password', async () => {
    await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    await expect(() =>
      sut.login({
        email: 'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to recover logged-in user', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    const userCreated = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const accessToken = await jwtService.signAsync(userCreated)

    vi.setSystemTime(new Date(2025, 0, 20, 8, 10, 0))

    const { user, access_token } = await sut.loggedIn({
      access_token: accessToken,
    })

    expect(user).toEqual(userCreated)
    expect(access_token).not.toEqual(accessToken)
  })

  it('should not recover logged-in user if access token is not correctly signed', async () => {
    const userCreated = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const accessToken = await jwtService.signAsync(userCreated, {
      secret: 'wrong-secret',
    })

    await expect(
      sut.loggedIn({
        access_token: accessToken,
      }),
    ).rejects.toBeInstanceOf(JsonWebTokenError)
  })

  it('should not recover logged-in user if the access token is expired', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))
    const userCreated = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const accessToken = await jwtService.signAsync(userCreated)

    vi.setSystemTime(new Date(2025, 0, 20, 9, 0, 0))

    await expect(
      sut.loggedIn({
        access_token: accessToken,
      }),
    ).rejects.toBeInstanceOf(JsonWebTokenError)
  })

  it('should be able to verify access', async () => {
    const userCreated = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const accessToken = await jwtService.signAsync(userCreated)

    const { user } = await sut.verifyAccess({
      access_token: accessToken,
    })

    expect(user).not.toEqual(userCreated)
  })

  it('should not be able to verify access if access token is not correctly signed', async () => {
    const userCreated = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const accessToken = await jwtService.signAsync(userCreated, {
      secret: 'wrong-secret',
    })

    await expect(
      sut.verifyAccess({
        access_token: accessToken,
      }),
    ).rejects.toBeInstanceOf(JsonWebTokenError)
  })

  it('should not be able to verify access if access token is expired', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))
    const userCreated = await usersRepository.create({
      data: {
        name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const accessToken = await jwtService.signAsync(userCreated)

    vi.setSystemTime(new Date(2025, 0, 20, 9, 0, 0))

    await expect(
      sut.verifyAccess({
        access_token: accessToken,
      }),
    ).rejects.toBeInstanceOf(JsonWebTokenError)
  })
})
