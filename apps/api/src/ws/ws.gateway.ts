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
    origin: ['http://localhost:3000', 'http://192.168.1.243:3000'],
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

  emitMarketCreated(gameId: string, payload: { name: string }) {
    this.server.to(`game:${gameId}`).emit('game.market_created', {
      gameId,
      ...payload,
    });
  }

  emitTeamCreated(
    gameId: string,
    payload: { createdCount: number; names: string[] },
  ) {
    this.server.to(`game:${gameId}`).emit('game.team_created', {
      ...payload,
    });
  }
}
