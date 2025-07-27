import { FilesRepository } from '../interfaces/files-repository'
import { randomUUID } from 'node:crypto'
import { Data } from './data'

export class InMemoryFilesRepository implements FilesRepository {
  constructor(private data: Data) {}

  async create(params: {
    data: {
      name: string
      type?: string
      isPrivate?: boolean
      created_by: string
      updated_by: string
    }
  }) {
    const {
      data: { name, type, isPrivate, updated_by, created_by },
    } = params

    const file = {
      id: randomUUID(),
      name,
      private: isPrivate ?? true,
      type: type ?? 'text/php',
      created_by_id: created_by,
      updated_by_id: updated_by,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.data.items.files.push(file)

    return file
  }

  async update(params: {
    data: { name: string; updated_by: string }
    fileId: string
  }) {
    const {
      fileId,
      data: { name, updated_by },
    } = params

    const fileIndex = this.data.items.files.findIndex(
      (file) => file.id === fileId,
    )

    if (fileIndex === -1) return null

    this.data.items.files[fileIndex] = {
      ...this.data.items.files[fileIndex],
      name,
      updated_by_id: updated_by,
    }

    return {
      name: this.data.items.files[fileIndex].name,
      updated_at: this.data.items.files[fileIndex].updated_at,
      type: this.data.items.files[fileIndex].type,
      id: this.data.items.files[fileIndex].id,
      private: this.data.items.files[fileIndex].private,
      created_by_id: this.data.items.files[fileIndex].created_by_id,
      updated_by_id: this.data.items.files[fileIndex].updated_by_id,
      created_at: this.data.items.files[fileIndex].created_at,
    }
  }

  async delete(params: { fileId: string }) {
    const { fileId } = params

    const fileIndex = this.data.items.files.findIndex(
      (file) => file.id === fileId,
    )

    if (fileIndex === -1) return undefined

    this.data.items.files.splice(fileIndex, 1)
  }

  async findById(params: { fileId: string }) {
    const { fileId } = params

    const file = this.data.items.files.find((file) => file.id === fileId)

    if (!file) return null

    return file
  }

  async searchByCreatedBy(params: {
    query: string
    createdBy: string
    orderBy: 'asc' | 'desc'
    sortBy: 'name' | 'updated_at'
    page: number
    perPage: number
  }) {
    const { query, page, perPage, sortBy, orderBy, createdBy } = params

    const filesSearched = this.data.items.files.filter(
      (file) =>
        file.name.toLowerCase().includes(query.toLowerCase()) &&
        file.created_by_id === createdBy,
    )

    filesSearched.sort((fileA, fileB) => {
      if (sortBy === 'name') {
        const comparison = fileA.name.localeCompare(fileB.name)
        return orderBy === 'asc' ? comparison : -comparison
      }

      if (sortBy === 'updated_at') {
        const dateA = new Date(fileA.updated_at).getTime()
        const dateB = new Date(fileB.updated_at).getTime()
        return orderBy === 'asc' ? dateA - dateB : dateB - dateA
      }

      return 0
    })

    const total = filesSearched.length

    const files = filesSearched
      .slice((page - 1) * perPage, page * perPage)
      .map((file) => {
        const updated_by = this.data.items.users.find(
          (user) => user.id === file.updated_by_id,
        )

        const created_by = this.data.items.users.find(
          (user) => user.id === file.created_by_id,
        )

        const shared_with = this.data.items.sharedFiles
          .filter((sharedFile) => sharedFile.file_id === file.id)
          .map((sharedFile) => {
            const user = this.data.items.users.find(
              (user) => user.id === sharedFile.user_id,
            )

            return {
              shared_at: sharedFile.shared_at,
              user: {
                id: user?.id ?? '',
                email: user?.email ?? '',
              },
            }
          })

        return {
          id: file.id,
          name: file.name,
          updated_at: file.updated_at,
          updated_by: {
            email: updated_by?.email ?? '',
          },
          created_by: {
            email: created_by?.email ?? '',
          },
          shared_with,
        }
      })

    return {
      total,
      files,
    }
  }

  async searchBySharedWith(params: {
    query: string
    sharedWith: string
    orderBy: 'asc' | 'desc'
    sortBy: 'name' | 'updated_at'
    page: number
    perPage: number
  }) {
    const { query, page, perPage, sortBy, orderBy, sharedWith } = params

    const filesSearched = this.data.items.files.filter(
      (file) =>
        file.name.toLowerCase().includes(query.toLowerCase()) &&
        this.data.items.sharedFiles.find(
          (sharedFile) =>
            sharedFile.file_id === file.id && sharedFile.user_id === sharedWith,
        ),
    )

    filesSearched.sort((fileA, fileB) => {
      if (sortBy === 'name') {
        const comparison = fileA.name.localeCompare(fileB.name)
        return orderBy === 'asc' ? comparison : -comparison
      }

      if (sortBy === 'updated_at') {
        const dateA = new Date(fileA.updated_at).getTime()
        const dateB = new Date(fileB.updated_at).getTime()
        return orderBy === 'asc' ? dateA - dateB : dateB - dateA
      }

      return 0
    })

    const total = filesSearched.length

    const files = filesSearched
      .slice((page - 1) * perPage, page * perPage)
      .map((file) => {
        const updated_by = this.data.items.users.find(
          (user) => user.id === file.updated_by_id,
        )

        const created_by = this.data.items.users.find(
          (user) => user.id === file.created_by_id,
        )

        const shared_with = this.data.items.sharedFiles
          .filter((sharedFile) => sharedFile.file_id === file.id)
          .map((sharedFile) => {
            const user = this.data.items.users.find(
              (user) => user.id === sharedFile.user_id,
            )

            return {
              shared_at: sharedFile.shared_at,
              user: {
                id: user?.id ?? '',
                email: user?.email ?? '',
              },
            }
          })

        return {
          id: file.id,
          name: file.name,
          updated_at: file.updated_at,
          updated_by: {
            email: updated_by?.email ?? '',
          },
          created_by: {
            email: created_by?.email ?? '',
          },
          shared_with,
        }
      })

    return {
      total,
      files,
    }
  }
}
