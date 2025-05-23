import { api } from '../lib/axios'
import { User } from '../types/User'

interface AuthenticateRegisterParams {
  name: string
  last_name: string
  email: string
  password: string
}

interface AuthenticateLoginParams {
  email: string
  password: string
}

export class Authenticate {
  static async register({
    name,
    email,
    last_name,
    password,
  }: AuthenticateRegisterParams): Promise<{ message: string }> {
    const response = await api.post('/authenticate/register', {
      name,
      last_name,
      email,
      password,
    })

    return response.data
  }

  static async login({
    email,
    password,
  }: AuthenticateLoginParams): Promise<{ user: User; message: string }> {
    const response = await api.post('/authenticate/login', {
      email,
      password,
    })

    return response.data
  }

  static async logged(): Promise<{ user: User; message: string }> {
    const response = await api.get('/authenticate/logged')

    return response.data
  }
}
