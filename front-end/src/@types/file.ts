import { User } from './user'

export interface File {
  id: string
  name: string
  updated_by: {
    email: string
  }
  created_by: {
    email: string
  }
  updated_at: Date
  shared_with: {
    shared_at: Date
    user: User
  }[]
}
