import { Injectable } from '@nestjs/common'
import { File, Prisma, SharedFile, User } from '@prisma/client'
import { PrismaService } from 'src/lib/prisma.service'
import {
  FilesRepository,
  Repository,
  SharedFilesRepository,
  UsersRepository,
} from './repository'

class PrismaRepositoryService<
  Model,
  Omit,
  Include,
  WhereUniqueInput,
  WhereInput,
  CreateInput,
  UpdateInput,
  OrderByInput,
> implements
    Repository<
      Model,
      Omit,
      Include,
      WhereUniqueInput,
      WhereInput,
      CreateInput,
      UpdateInput,
      OrderByInput
    >
{
  constructor(
    private prisma: PrismaService,
    private model: string,
  ) {}

  async findUnique(params: {
    include?: Include
    omit?: Omit
    where: WhereUniqueInput
  }): Promise<Model | null> {
    const { where, omit, include } = params
    return this.prisma[this.model].findUnique({ omit, include, where })
  }

  async findMany(params: {
    include?: Include
    omit?: Omit
    skip?: number
    take?: number
    cursor?: WhereUniqueInput
    where?: WhereInput
    orderBy?: OrderByInput
  }): Promise<Model[]> {
    const { omit, include, skip, take, cursor, where, orderBy } = params
    return this.prisma[this.model].findMany({
      include,
      omit,
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async create(params: {
    include?: Include
    omit?: Omit
    data: CreateInput
  }): Promise<Model> {
    const { data, include, omit } = params
    return this.prisma[this.model].create({
      include,
      omit,
      data,
    })
  }

  async update(params: {
    where: WhereUniqueInput
    omit?: Omit
    data: UpdateInput
  }): Promise<Model> {
    const { where, data, omit } = params
    return this.prisma[this.model].update({
      omit,
      data,
      where,
    })
  }

  async delete(params: { where: WhereUniqueInput }): Promise<Model> {
    const { where } = params
    return this.prisma[this.model].delete({
      where,
    })
  }

  async count(params: {
    skip?: number
    take?: number
    cursor?: WhereUniqueInput
    where?: WhereInput
    orderBy?: OrderByInput
  }): Promise<Model[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma[this.model].count({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }
}

@Injectable()
export class PrismaUsersRepository
  extends PrismaRepositoryService<
    User,
    Prisma.UserOmit,
    Prisma.UserInclude,
    Prisma.UserWhereUniqueInput,
    Prisma.UserWhereInput,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserOrderByWithRelationInput
  >
  implements UsersRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'user')
  }
}

@Injectable()
export class PrismaFilesRepository
  extends PrismaRepositoryService<
    File,
    Prisma.FileOmit,
    Prisma.FileInclude,
    Prisma.FileWhereUniqueInput,
    Prisma.FileWhereInput,
    Prisma.FileCreateInput,
    Prisma.FileUpdateInput,
    Prisma.FileOrderByWithRelationInput
  >
  implements FilesRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'file')
  }
}

@Injectable()
export class PrismaSharedFilesRepository
  extends PrismaRepositoryService<
    SharedFile,
    Prisma.SharedFileOmit,
    Prisma.SharedFileInclude,
    Prisma.SharedFileWhereUniqueInput,
    Prisma.SharedFileWhereInput,
    Prisma.SharedFileCreateInput,
    Prisma.SharedFileUpdateInput,
    Prisma.SharedFileOrderByWithRelationInput
  >
  implements SharedFilesRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'sharedFile')
  }
}
