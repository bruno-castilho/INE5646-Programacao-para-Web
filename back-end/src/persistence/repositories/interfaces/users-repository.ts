export interface UsersRepository {
  create(params: {
    data: {
      name: string
      last_name: string
      email: string
      password_hash: string
    }
  }): Promise<{
    name: string
    id: string
    last_name: string
    email: string
    created_at: Date
    avatar_url: string | null
  }>
  update(params: {
    userId: string
    data: {
      name?: string
      last_name?: string
      email?: string
      password_hash?: string
    }
  }): Promise<{
    name: string
    id: string
    last_name: string
    email: string
    created_at: Date
    avatar_url: string | null
  } | null>

  findById(params: { userId: string }): Promise<{
    name: string
    id: string
    last_name: string
    email: string
    created_at: Date
    avatar_url: string | null
  } | null>

  findByEmail(params: { email: string }): Promise<{
    name: string
    id: string
    last_name: string
    email: string
    created_at: Date
    avatar_url: string | null
  } | null>

  findByIdWithPassword(params: { userId: string }): Promise<{
    name: string
    id: string
    last_name: string
    email: string
    created_at: Date
    avatar_url: string | null
    password_hash: string
  } | null>
  findByEmailWithPassword(params: { email: string }): Promise<{
    name: string
    id: string
    last_name: string
    email: string
    created_at: Date
    avatar_url: string | null
    password_hash: string
  } | null>
}
