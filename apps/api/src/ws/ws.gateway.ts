import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_game_room')
  handleJoinGameRoom(
    @MessageBody() body: { gameId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`game:${body.gameId}`);
    return { ok: true };
  }

  emitMemberJoined(
    gameId: string,
    payload: { userId: string; displayName: string },
  ) {
    this.server.to(`game:${gameId}`).emit('game.member_joined', {
      gameId,
      ...payload,
    });
  }
}
