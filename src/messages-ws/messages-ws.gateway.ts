import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messagesWsService: MessagesWsService) {}
  
  handleConnection(client: Socket) {
    //console.log('Client connected', client.id);
    this.messagesWsService.conectedClient(client);
    console.log(this.messagesWsService.countConnectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);
    this.messagesWsService.disconnectClient(client.id);
    console.log(this.messagesWsService.countConnectedClients());

  }


}
