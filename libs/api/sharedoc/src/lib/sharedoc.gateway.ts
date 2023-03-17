import {
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  OnGatewayConnection,
} from '@nestjs/websockets';
import ShareDB = require('sharedb');
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import * as richText from 'rich-text';
import { IncomingMessage } from 'http';

ShareDB.types.register(richText.type);
const backend = new ShareDB({ presence: true });
const connection = backend.connect();

@WebSocketGateway(3030, {
  cors: {
    origin: 'http://localhost:4200/sharedDocument/:courseCode/:lectureNumber',
  },
})
export class ShareDBServer implements OnGatewayConnection, OnGatewayConnection {
  constructor() {}

  @WebSocketServer()
  private server: any;

  // Listen for incoming WebSocket connections
  public handleConnection(client: any, request: IncomingMessage) {
    const stream = new WebSocketJSONStream(client);
    backend.listen(stream);

    const urlParams = request.url?.split('/').slice(-2); 

    // Create initial document
    const courseCode = urlParams[0];
    const lectureNumber = urlParams[1];

    // Create initial document
    const doc = connection.get(courseCode, lectureNumber);
    doc.fetch(function (err) {
      if (err) throw err;
      if (doc.type === null) {
        doc.create([{ insert: 'Start Typing' }], 'rich-text');
        console.log('Created document');
        return;
      }
    });
  }
}
