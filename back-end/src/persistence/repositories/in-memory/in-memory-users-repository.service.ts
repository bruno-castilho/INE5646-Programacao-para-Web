import { UsersRepository } from '../interfaces/users-repository'
import { randomUUID } from 'node:crypto'
import { Data } from './data'

export class InMemoryUsersRepository implements UsersRepository {
  constructor(private data: Data) {}

  async create(params: {
    data: {
      name: string
      last_name: string
      email: string
      password_hash: string
    }
  }) {
    const {
      data: { name, last_name, email, password_hash },
    } = params

    const user = {
      id: randomUUID(),
      name,
      last_name,
      email,
      password_hash,
      created_at: new Date(),
      avatar_url: null,
    }

    this.data.items.users.push(user)

    return {
      id: user.id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      created_at: user.created_at,
      avatar_url: user.avatar_url,
    }
  }

  async update(params: {
    userId: string
    data: {
      name?: string
      last_name?: string
      email?: string
      password_hash?: string
    }
  }) {
    const {
      data: { email, name, last_name, password_hash },
      userId,
    } = params

    const userIndex = this.data.items.users.findIndex(
      (user) => user.id === userId,
    )

    if (userIndex === -1) return null

    this.data.items.users[userIndex] = {
      ...this.data.items.users[userIndex],
      name: name ?? this.data.items.users[userIndex].name,
      last_name: last_name ?? this.data.items.users[userIndex].last_name,
      email: email ?? this.data.items.users[userIndex].email,
      password_hash:
        password_hash ?? this.data.items.users[userIndex].password_hash,
    }

    return {
      id: this.data.items.users[userIndex].id,
      name: this.data.items.users[userIndex].name,
      last_name: this.data.items.users[userIndex].last_name,
      email: this.data.items.users[userIndex].email,
      created_at: this.data.items.users[userIndex].created_at,
      avatar_url: this.data.items.users[userIndex].avatar_url,
    }
  }

  async findById(params: { userId: string }) {
    const { userId } = params

    const user = this.data.items.users.find((user) => user.id === userId)

    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      created_at: user.created_at,
      avatar_url: user.avatar_url,
    }
  }

  async findByEmail(params: { email: string }) {
    const { email } = params

    const user = this.data.items.users.find((user) => user.email === email)

    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      created_at: user.created_at,
      avatar_url: user.avatar_url,
    }
  }

  async findByIdWithPassword(params: { userId: string }) {
    const { userId } = params

    const user = this.data.items.users.find((user) => user.id === userId)

    if (!user) return null

    return user
  }

  async findByEmailWithPassword(params: { email: string }) {
    const { email } = params

    const user = this.data.items.users.find((user) => user.email === email)

    if (!user) return null

    return user
  }
}
