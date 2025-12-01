import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server

  constructor(private readonly messagesWsService: MessagesWsService) {}
  
  handleConnection(client: Socket) {
    //console.log('Client connected', client.id);
    this.messagesWsService.conectedClient(client);

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);
    this.messagesWsService.disconnectClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }


}
