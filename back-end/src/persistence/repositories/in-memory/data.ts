import { File, SharedFile, User } from '@prisma/client'

export class Data {
  public items: {
    users: User[]
    files: File[]
    sharedFiles: SharedFile[]
  }

  constructor() {
    this.items = {
      users: [],
      files: [],
      sharedFiles: [],
    }
  }
}
