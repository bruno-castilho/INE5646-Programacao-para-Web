import { AxiosInstance } from 'axios'
import { api } from '../lib/axios'
import { File } from '../@types/file'
import { User } from '../@types/user'

export class Files {
  constructor(private readonly api: AxiosInstance) {}
  async searchPersonalFiles(params: {
    query?: string
    page?: number
    perPage?: number
    orderBy?: 'asc' | 'desc'
    sortBy?: 'name' | 'updated_at'
  }): Promise<{ files: File[]; total: number }> {
    const { query, page, perPage, orderBy, sortBy } = params
    const response = await this.api.get('/files/personal', {
      params: {
        query,
        page,
        perPage,
        orderBy,
        sortBy,
      },
    })

    return response.data
  }

  async searchFilesSharedWithMe(params: {
    query?: string
    page?: number
    perPage?: number
    orderBy?: 'asc' | 'desc'
    sortBy?: 'name' | 'updated_at'
  }): Promise<{ files: File[]; total: number }> {
    const { query, page, perPage, orderBy, sortBy } = params
    const response = await this.api.get('/files/sharedwithme', {
      params: {
        query,
        page,
        perPage,
        orderBy,
        sortBy,
      },
    })

    return response.data
  }

  async shareFile(params: { fileId: string; email: string }): Promise<{
    message: string
    shared_with: {
      shared_at: Date
      user: User
    }
  }> {
    const { fileId, email } = params
    const response = await this.api.post(`/files/${fileId}/share`, {
      email,
    })

    return response.data
  }

  async unshareFile(params: {
    fileId: string
    email: string
  }): Promise<{ message: string }> {
    const { fileId, email } = params
    const response = await this.api.post(`/files/${fileId}/unshare`, {
      email,
    })

    return response.data
  }

  async createFile(params: {
    file: Blob
  }): Promise<{ message: string; fileId: string }> {
    const { file } = params
    const response = await this.api.postForm('/files', {
      file,
    })

    return response.data
  }

  async updateFile(params: {
    file: Blob
    fileId: string
  }): Promise<{ message: string }> {
    const { file, fileId } = params
    const response = await this.api.putForm(`/files/${fileId}`, {
      file,
    })

    return response.data
  }

  async removeFile(params: { fileId: string }): Promise<{ message: string }> {
    const { fileId } = params
    const response = await this.api.delete(`/files/${fileId}`)

    return response.data
  }

  async downloadFile(params: {
    fileId: string
  }): Promise<{ file: string; filename: string }> {
    const { fileId } = params
    const response = await this.api.get<string>(`/files/${fileId}`)

    const contentDisposition = response.headers['content-disposition']

    let filename = 'sem-nome.php'

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/)
      if (match && match[1]) {
        filename = match[1]
      }
    }
    return { file: response.data, filename }
  }
}

export const files = new Files(api)
