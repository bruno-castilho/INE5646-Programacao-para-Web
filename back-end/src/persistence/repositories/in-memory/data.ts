import { User } from '@prisma/client'

export class Data {
  public items: {
    users: User[]
  }

  constructor() {
    this.items = {
      users: [],
    }
  }
}
