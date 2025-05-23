import { Body, Controller, Post, Res } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { LoginUseCase } from 'src/use-cases/login.service'
import { RegisterUseCase } from 'src/use-cases/register.service'
import { z } from 'zod'
import { JwtService } from '@nestjs/jwt'

@Controller('authenticate')
export class AuthenticateController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    const bodySchema = z.object({
      name: z
        .string()
        .trim()
        .min(1, { message: 'Digite um nome' })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
          message: 'O nome deve conter apenas letras',
        }),

      last_name: z
        .string()
        .trim()
        .min(1, { message: 'Digite um sobrenome' })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
          message: 'O sobrenome deve conter apenas letras',
        }),

      email: z.string().trim().email({ message: 'E-mail inválido' }),

      password: z
        .string()
        .trim()
        .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
        .regex(/(?=.*[A-Z])/, {
          message: 'A senha deve conter pelo menos uma letra maiúscula',
        })
        .regex(/(?=.*[0-9])/, {
          message: 'A senha deve conter pelo menos um número',
        })
        .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
          message: 'A senha deve conter pelo menos um símbolo especial',
        }),
    })

    const { name, email, last_name, password } = bodySchema.parse(body)
    await this.registerUseCase.execute({ name, email, last_name, password })

    return {
      message: 'Cadastro efetuado com sucesso',
    }
  }

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const bodySchema = z.object({
      email: z.string().trim().email({ message: 'E-mail inválido' }),

      password: z
        .string()
        .trim()
        .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
        .regex(/(?=.*[A-Z])/, {
          message: 'A senha deve conter pelo menos uma letra maiúscula',
        })
        .regex(/(?=.*[0-9])/, {
          message: 'A senha deve conter pelo menos um número',
        })
        .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
          message: 'A senha deve conter pelo menos um símbolo especial',
        }),
    })

    const { email, password } = bodySchema.parse(body)

    const {
      user: { id, name, last_name, created_at },
    } = await this.loginUseCase.execute({
      email,
      password,
    })

    const user = {
      id,
      name,
      last_name,
      email,
      created_at,
    }

    const access_token = await this.jwtService.signAsync(user)

    return res
      .setCookie('access_token', access_token, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ user, message: `Bem vindo, ${user.name}` })
  }
}
