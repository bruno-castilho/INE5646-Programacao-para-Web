import { File, Prisma, SharedFile, User } from '@prisma/client'

export interface Repository<
  Model,
  Omit,
  Include,
  WhereUniqueInput,
  WhereInput,
  CreateInput,
  UpdateInput,
  OrderByInput,
> {
  findUnique(params: {
    include?: Include
    omit?: Omit
    where: WhereUniqueInput
  }): Promise<Model | null>

  findMany(params: {
    include?: Include
    omit?: Omit
    skip?: number
    take?: number
    cursor?: WhereUniqueInput
    where?: WhereInput
    orderBy?: OrderByInput
  }): Promise<Model[]>

  create(params: {
    include?: Include
    omit?: Omit
    data: CreateInput
  }): Promise<Model>

  update(params: {
    where: WhereUniqueInput
    omit?: Omit
    data: UpdateInput
  }): Promise<Model>

  delete(params: { where: WhereUniqueInput }): Promise<Model>

  count(params: {
    skip?: number
    take?: number
    cursor?: WhereUniqueInput
    where?: WhereInput
    orderBy?: OrderByInput
  }): Promise<Model[]>
}

export type UsersRepository = Repository<
  User,
  Prisma.UserOmit,
  Prisma.UserInclude,
  Prisma.UserWhereUniqueInput,
  Prisma.UserWhereInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserOrderByWithRelationInput
>

export type FilesRepository = Repository<
  File,
  Prisma.FileOmit,
  Prisma.FileInclude,
  Prisma.FileWhereUniqueInput,
  Prisma.FileWhereInput,
  Prisma.FileCreateInput,
  Prisma.FileUpdateInput,
  Prisma.FileOrderByWithRelationInput
>

export type SharedFilesRepository = Repository<
  SharedFile,
  Prisma.SharedFileOmit,
  Prisma.SharedFileInclude,
  Prisma.SharedFileWhereUniqueInput,
  Prisma.SharedFileWhereInput,
  Prisma.SharedFileCreateInput,
  Prisma.SharedFileUpdateInput,
  Prisma.SharedFileOrderByWithRelationInput
>
