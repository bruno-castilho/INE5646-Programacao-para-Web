import { Injectable } from '@nestjs/common'
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { env } from 'src/env'
import { PHPScriptUseCases } from 'src/use-cases/php-script.service'

@WebSocketGateway({
  cors: {
    origin: env.ORIGIN,
  },
})
@Injectable()
export class RunPhpSriptGateway {
  constructor(private phpScriptUseCases: PHPScriptUseCases) {}

  async handleDisconnect(client: Socket) {
    try {
      await this.phpScriptUseCases.cleanRunPHPScript({
        clientId: client.id,
      })
    } catch {}
  }

  @SubscribeMessage('run-php-script')
  async handleMessage(
    @MessageBody() data: { script: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { logs } = await this.phpScriptUseCases.runPHPScript({
      clientId: client.id,
      script: data.script,
    })

    client.emit('response-run-php-script', {
      logs,
    })
  }
}
