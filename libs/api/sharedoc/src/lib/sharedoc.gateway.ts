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
import { DocumentService } from './sharedoc.service';

ShareDB.types.register(richText.type);
const backend = new ShareDB({ presence: true });
const connection = backend.connect();

@WebSocketGateway(3030, {
  cors: {
    origin:
      'http://localhost:4200/home/sharedDocument/:courseCode/:sessionId/:lectureId/:documentId/:lectureNumber',
  },
})
export class ShareDBServer implements OnGatewayConnection, OnGatewayConnection {
  constructor(private shareDocService: DocumentService) {}

  @WebSocketServer()
  private server: any;

  // Listen for incoming WebSocket connections
  public async handleConnection(client: any, request: IncomingMessage) {
    const stream = new WebSocketJSONStream(client);
    backend.listen(stream);

    const urlParams = request.url?.split('/').slice(-5);

    // Create initial document
    const courseCode = urlParams[0];
    const documentId = urlParams[3];

    // Create initial document
    const doc = connection.get(courseCode, documentId);

    doc.fetch(async (err) => {
      if (err) throw err;
      if (doc.type === null) {
        let content = 'Start typing...';
        doc.create([{ insert: content }], 'rich-text');
        return;
      }
    });
  }
}
