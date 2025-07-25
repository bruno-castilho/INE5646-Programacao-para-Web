export interface SharedFilesRepository {
  create(params: {
    data: {
      fileId: string
      userId: string
    }
  }): Promise<{
    id: string
    user_id: string
    file_id: string
    shared_at: Date
  }>

  delete(params: { userId: string; fileId: string }): Promise<void>

  findByUserIdAndFileId(params: { userId: string; fileId: string }): Promise<{
    id: string
    user_id: string
    file_id: string
    shared_at: Date
  } | null>
}
