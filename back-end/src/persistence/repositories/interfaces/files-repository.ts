export interface FilesRepository {
  create(params: {
    data: {
      name: string
      type?: string
      isPrivate?: boolean
      created_by: string
      updated_by: string
    }
  }): Promise<{
    name: string
    updated_at: Date
    type: string
    id: string
    private: boolean
    created_by_id: string
    updated_by_id: string
    created_at: Date
  }>

  update(params: {
    data: {
      name: string
      updated_by: string
    }
    fileId: string
  }): Promise<{
    name: string
    updated_at: Date
    type: string
    id: string
    private: boolean
    created_by_id: string
    updated_by_id: string
    created_at: Date
  }>

  delete(params: { fileId: string }): Promise<void>

  findById(params: { fileId: string }): Promise<{
    name: string
    updated_at: Date
    type: string
    id: string
    private: boolean
    created_by_id: string
    updated_by_id: string
    created_at: Date
  } | null>

  searchByCreatedBy(params: {
    query: string
    createdBy: string
    orderBy: 'asc' | 'desc'
    sortBy: 'name' | 'updated_at'
    page: number
    perPage: number
  }): Promise<{
    total: number
    files: {
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
        user: {
          id: string
          email: string
        }
      }[]
    }[]
  }>

  searchBySharedWith(params: {
    query: string
    sharedWith: string
    orderBy: 'asc' | 'desc'
    sortBy: 'name' | 'updated_at'
    page: number
    perPage: number
  }): Promise<{
    total: number
    files: {
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
        user: {
          id: string
          email: string
        }
      }[]
    }[]
  }>
}
