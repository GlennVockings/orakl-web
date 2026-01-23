import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class WsGateway {
  @WebSocketServer()
  server!: Server; // ← add the "!" here

  @SubscribeMessage('join')
  async join(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { room: string },
  ) {
    await socket.join(data.room);
    socket.emit('joined', data);
  }

  emitTo(room: string, event: string, payload: unknown) {
    this.server.to(room).emit(event, payload);
  }
}
