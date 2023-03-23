// import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
// import { Server } from 'socket.io';
// import ShareDB = require('sharedb');
// import WebSocketJSONStream from '@teamwork/websocket-json-stream';

// const backend = new ShareDB();

// // Create initial document
// const connection = backend.connect();
// const doc = connection.get('examples', 'textarea');
// doc.fetch(function(err) {
//   if (err) throw err;
//   if (doc.type === null) {
//     doc.create({content: ''});
//     return;
//   }
// });

// export class AppWebSocketServer {
//   @WebSocketServer()
//   private server: Server

//   constructor() {}

//   // Listen for incoming WebSocket connections
//   @SubscribeMessage('connection')
//   handleConnection(client: Server) {
//     const stream = new WebSocketJSONStream(client);
//     backend.listen(stream);
//   }
// }

// import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
// import { Server } from 'socket.io';
// import ShareDB = require('sharedb');
// import WebSocketJSONStream from '@teamwork/websocket-json-stream';

// @WebSocketGateway()
// export class AppWebSocketGateway implements OnGatewayConnection {
//   @WebSocketServer()
//   private server: Server;

//   private backend = new ShareDB();

//   // Create initial document
//   private connection = this.backend.connect();
//   private doc = this.connection.get('examples', 'textarea');

//   handleConnection(client: Server, ...args: any[]) {
//     const stream = new WebSocketJSONStream(client);
//     this.backend.listen(stream);
//     this.doc.fetch((err) => {
//       if (err) throw err;
//       if (this.doc.type === null) {
//         this.doc.create({ content: '' });
//       }
//     });
//   }
// }

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('sharedoc')
export class AppController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  getHello(): string {
    return 'Hello World!';
  }
}
