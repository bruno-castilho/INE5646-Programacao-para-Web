import { SharedFilesRepository } from '../interfaces/shared-files-repository'
import { randomUUID } from 'node:crypto'
import { Data } from './data'

export class InMemorySharedFilesRepository implements SharedFilesRepository {
  constructor(private data: Data) {}

  async create(params: { data: { fileId: string; userId: string } }) {
    const {
      data: { fileId, userId },
    } = params

    const sharedFile = {
      id: randomUUID(),
      user_id: userId,
      file_id: fileId,
      shared_at: new Date(),
    }

    this.data.items.sharedFiles.push(sharedFile)

    return sharedFile
  }

  async delete(params: { userId: string; fileId: string }) {
    const { userId, fileId } = params

    const sharedFileIndex = this.data.items.sharedFiles.findIndex(
      (sharedFile) =>
        sharedFile.file_id === fileId && sharedFile.user_id === userId,
    )

    if (sharedFileIndex === -1) return undefined

    this.data.items.sharedFiles.splice(sharedFileIndex, 1)
  }

  async findByUserIdAndFileId(params: { userId: string; fileId: string }) {
    const { fileId, userId } = params

    const sharedFile = this.data.items.sharedFiles.find(
      (sharedFile) =>
        sharedFile.file_id === fileId && sharedFile.user_id === userId,
    )

    if (!sharedFile) return null

    return sharedFile
  }
}
