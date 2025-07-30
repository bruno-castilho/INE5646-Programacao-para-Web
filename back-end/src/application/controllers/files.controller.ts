import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthGuard } from 'src/application/guards/auth.guard'
import { PHPScriptUseCases } from 'src/use-cases/php-script.service'

import { z } from 'zod'

@Controller('files')
export class FilesController {
  constructor(private readonly readonlyphpScriptUseCases: PHPScriptUseCases) {}

  @Get('personal')
  @UseGuards(AuthGuard)
  async searchPersonalFiles(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const querySchema = z.object({
      query: z.string().default(''),
      page: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 1, { message: 'perPage deve ser >= 1' })
        .default('1'),
      perPage: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 1, { message: 'perPage deve ser >= 1' })
        .default('10'),
      orderBy: z.enum(['asc', 'desc']).default('asc'),
      sortBy: z.enum(['name', 'updated_at']).default('name'),
    })

    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação.')
    }

    const { page, perPage, orderBy, query, sortBy } = querySchema.parse(
      req.query,
    )

    const { files, total } =
      await this.readonlyphpScriptUseCases.searchPersonalFiles({
        page,
        perPage,
        orderBy,
        query,
        sortBy,
        userId,
      })

    res.status(HttpStatus.OK)
    return {
      total,
      files,
    }
  }

  @Get('sharedwithme')
  @UseGuards(AuthGuard)
  async searchFilesSharedWithMe(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const querySchema = z.object({
      query: z.string().default(''),
      page: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 1, { message: 'perPage deve ser >= 1' })
        .default('1'),
      perPage: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 1, { message: 'perPage deve ser >= 1' })
        .default('10'),
      orderBy: z.enum(['asc', 'desc']).default('asc'),
      sortBy: z.enum(['name', 'updated_at']).default('name'),
    })

    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação.')
    }

    const { page, perPage, orderBy, query, sortBy } = querySchema.parse(
      req.query,
    )

    const { files, total } =
      await this.readonlyphpScriptUseCases.searchFilesSharedWithMe({
        page,
        perPage,
        orderBy,
        query,
        sortBy,
        userId,
      })

    res.status(HttpStatus.OK)
    return {
      files,
      total,
    }
  }

  @Post(':id/share')
  @UseGuards(AuthGuard)
  async shareFile(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const bodySchema = z.object({
      email: z.string().trim().email({ message: 'E-mail inválido' }),
    })

    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação')
    }

    const { email } = bodySchema.parse(req.body)

    const { id: fileId } = paramsSchema.parse(req.params)

    const { sharedFile } = await this.readonlyphpScriptUseCases.shareFile({
      email,
      fileId,
      userId,
    })

    res.status(HttpStatus.CREATED)
    return {
      shared_with: sharedFile,
      message: 'Arquivo compartilhado com sucesso',
    }
  }

  @Post(':id/unshare')
  @UseGuards(AuthGuard)
  async unshareFile(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const bodySchema = z.object({
      email: z.string().trim().email({ message: 'E-mail inválido' }),
    })

    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação.')
    }

    const { email } = bodySchema.parse(req.body)

    const { id: fileId } = paramsSchema.parse(req.params)

    await this.readonlyphpScriptUseCases.unshareFile({
      email,
      fileId,
      userId,
    })

    res.status(HttpStatus.OK)
    return {
      message: 'Arquivo descompartilhado com sucesso',
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async createFile(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação.')
    }
    const parts = req.parts()
    const filePart = await parts.next()

    if (!filePart || filePart.done || filePart.value.type !== 'file') {
      throw new BadRequestException('Nenhum arquivo enviado')
    }

    const { filename, file } = filePart.value

    if (!filename.endsWith('.php'))
      throw new BadRequestException('Somente arquivos .php são permitidos')

    const chunks: Buffer[] = []
    const MAX_SIZE = 1 * 1024 * 1024 // 1 MB

    let totalSize = 0
    for await (const chunk of file) {
      totalSize += chunk.length
      if (totalSize > MAX_SIZE) {
        throw new BadRequestException('Arquivo muito grande')
      }
      chunks.push(chunk)
    }

    const fileContent = Buffer.concat(chunks)

    if (!userId) throw new Error()

    const { fileId } = await this.readonlyphpScriptUseCases.createFile({
      userId,
      name: filename,
      fileContent,
    })

    res.status(HttpStatus.CREATED)
    return {
      fileId,
      message: 'Arquivo criado com sucesso',
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateFile(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id: fileId } = paramsSchema.parse(req.params)

    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação.')
    }
    const parts = req.parts()
    const filePart = await parts.next()

    if (!filePart || filePart.done || filePart.value.type !== 'file') {
      throw new BadRequestException('Nenhum arquivo enviado')
    }

    const { filename, file } = filePart.value

    if (!filename.endsWith('.php'))
      throw new BadRequestException('Somente arquivos .php são permitidos')

    const chunks: Buffer[] = []
    const MAX_SIZE = 1 * 1024 * 1024 // 1 MB

    let totalSize = 0
    for await (const chunk of file) {
      totalSize += chunk.length
      if (totalSize > MAX_SIZE) {
        throw new BadRequestException('Arquivo muito grande')
      }
      chunks.push(chunk)
    }

    const fileContent = Buffer.concat(chunks)

    if (!userId) throw new Error()

    await this.readonlyphpScriptUseCases.updateFile({
      name: filename,
      fileId,
      userId,
      fileContent,
    })

    res.status(HttpStatus.OK)
    return {
      message: 'Arquivo atualizado com sucesso',
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeFile(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação.')
    }

    const { id: fileId } = paramsSchema.parse(req.params)

    await this.readonlyphpScriptUseCases.removeFile({
      userId,
      fileId,
    })

    res.status(HttpStatus.OK)
    return {
      message: 'Arquivo removido com sucesso',
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async downloadFile(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação.')
    }

    const { id: fileId } = paramsSchema.parse(req.params)

    const { fileContent, filename } =
      await this.readonlyphpScriptUseCases.downloadFile({
        fileId,
        userId,
      })

    res
      .header('Content-Type', 'text/php')
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .status(HttpStatus.OK)
    return new StreamableFile(fileContent)
  }
}
