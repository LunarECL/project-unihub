// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { Server } from 'socket.io';
// import { Injectable } from '@nestjs/common';
// import ShareDB = require('sharedb');
// import WebSocketJSONStream from '@teamwork/websocket-json-stream';

import { WebSocketServer, SubscribeMessage, MessageBody, WebSocketGateway, OnGatewayConnection } from '@nestjs/websockets';
import ShareDB = require('sharedb');
import WebSocketJSONStream from '@teamwork/websocket-json-stream';



const backend = new ShareDB();

// Create initial document
const connection = backend.connect();
const doc = connection.get('examples', 'textarea');
doc.fetch(function(err) {
  if (err) throw err;
  if (doc.type === null) {
    doc.create({content: ''});
    console.log('Created document');
    return;
  }
});

@WebSocketGateway(3030, {
  cors: {
    origin: 'http://localhost:4200',
  }
})
export class ShareDBServer implements
  OnGatewayConnection, OnGatewayConnection {

  constructor() {}

  @WebSocketServer()
  private server: any;


  // Listen for incoming WebSocket connections
  public handleConnection(client: any) { 
    const stream = new WebSocketJSONStream(client);
    backend.listen(stream);
  }
  
}

// @Injectable()
// export class ShareDBServer extends IoAdapter {
//   private backend = new ShareDB();

//   // Create initial document
//   private connection = this.backend.connect();
//   private doc = this.connection.get('examples', 'textarea');

//   constructor() {
//     super();
//     this.doc.fetch((err) => {
//       if (err) throw err;
//       if (this.doc.type === null) {
//         this.doc.create({content: ''});
//         return;
//       }
//     });
//   }

//   createIOServer(port: number): Server {
//     const server = super.createIOServer(port);
//     console.log('ShareDBServer.createIOServer()');

//     server.on('connection', (client) => {
//         console.log('ShareDBServer.createIOServer().connection()');
//       const stream = new WebSocketJSONStream(client);
//       this.backend.listen(stream);
//     });

//     return server;
//   }
// }
