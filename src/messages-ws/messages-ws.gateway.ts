import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    //console.log('Client connected', client.id);
    this.messagesWsService.conectedClient(client);

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);
    this.messagesWsService.disconnectClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  // Message from client
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //console.log(client.id, payload);
    //! Emit to this client
    // client.emit('message-from-server', {
    //   message: `Hello, you sent -> ${payload.message}`,
    // });
  
    //! Emit to all clients except the one who sent the message
    // client.broadcast.emit('message-from-server', {
    //   message: payload.message,
    // });

    //! Emit to all clients
    this.wss.emit('message-from-server', {
      message: payload.message,
    });
  }
}
