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
    const lectureNumber = urlParams[4];

    console.log(courseCode, documentId, lectureNumber);

    // Create initial document
    const doc = connection.get(courseCode, lectureNumber);

    doc.fetch(async (err) => {
      if (err) throw err;
      if (doc.type === null) {
        // const document = await this.shareDocService.getDocumentContent(
        //   Number(documentId)
        // );

        let content = 'Start Typing';
        // if (document !== '') {
        //   content = document;
        // }

        doc.create([{ insert: content }], 'rich-text');

        // // Check if document already exists
        // if (doc.type === null) {
        //   doc.create([{ insert: content }], 'rich-text');
        //   console.log('Created document');
        // } else {
        //   console.log('Document already exists');
        // }
        return;
      }
    });
  }
}
