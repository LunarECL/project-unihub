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

ShareDB.types.register(richText.type);
const backend = new ShareDB({ presence: true });

// Create initial document
const connection = backend.connect();
const doc = connection.get('examples', 'textarea');
doc.fetch(function (err) {
  if (err) throw err;
  if (doc.type === null) {
    doc.create([{ insert: 'Start Typing' }], 'rich-text');
    console.log('Created document');
    return;
  }
});

@WebSocketGateway(3030, {
  cors: {
    origin: 'http://localhost:4200',
  },
})
export class ShareDBServer implements OnGatewayConnection, OnGatewayConnection {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  @WebSocketServer()
  private server: any;

  // Listen for incoming WebSocket connections
  public handleConnection(client: any) {
    const stream = new WebSocketJSONStream(client);
    backend.listen(stream);
  }
}
