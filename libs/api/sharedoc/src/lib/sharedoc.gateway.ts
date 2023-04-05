import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayConnection,
} from '@nestjs/websockets';
import ShareDB = require('sharedb');
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import * as richText from 'rich-text';
import { IncomingMessage } from 'http';
import { DocumentService } from './sharedoc.service';
import Delta from 'quill-delta';

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
  public handleConnection(client: any, request: IncomingMessage) {
    const urlParams = request.url?.split('/').slice(-5);

    // Create initial document
    const courseCode = urlParams[0];
    const documentId = urlParams[3];

    this.shareDocService.getDocumentContent(Number(documentId)).then((ops) => {
      const stream = new WebSocketJSONStream(client);
      backend.listen(stream);
      // Create initial document
      const doc = connection.get(courseCode, documentId);
      if (ops.length === 0) {
        ops = [
          {
            insert: 'Start typing...',
          },
        ];
      }

      const delta = new Delta(ops);

      return new Promise((resolve, reject) => {
        doc.fetch((err) => {
          if (err) return reject(err);
          if (doc.type === null) {
            doc.create(delta, 'rich-text');
            return resolve('done');
          }
        });
      });
    });
  }
}
