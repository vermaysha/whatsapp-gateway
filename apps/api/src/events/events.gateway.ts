import { UseGuards } from '@nestjs/common'
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  type OnGatewayInit,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
} from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import type { Server, Socket } from 'socket.io'
import { AuthWsGuard } from '../auth/auth-ws.guard'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(AuthWsGuard)
export class EventsGateway
  implements
    OnGatewayInit<Server>,
    OnGatewayConnection<Socket>,
    OnGatewayDisconnect<Socket>
{
  @WebSocketServer()
  server: Server
  connectedUsers: number = 1

  afterInit(server: Server) {
    server.emit('events', { message: 'Gateway initialized' })
    console.log('Gateway initialized')
  }

  handleConnection(socket: Socket) {
    socket.emit('events', { message: 'Connection established', id: socket.id })
    console.log('Connection established', socket.id)
    this.connectedUsers++
  }

  handleDisconnect(client: Socket) {
    client.emit('events', { message: 'Disconnected', id: client.id })
    console.log('Disconnected', client.id)
    this.connectedUsers--
  }

  emit(event: string, uuid: string, data: any): boolean {
    const name = `${event}/${uuid}`
    const status = this.server.emit(name, data)
    console.log('emit Event', name, data, status)
    return status
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log('events', data)
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    )
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data
  }
}
