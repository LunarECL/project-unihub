import { useEffect, useRef, useState } from 'react';

export interface SharedocProps {}

import ReconnectingWebSocket from 'reconnecting-websocket';
import * as ShareDB from 'sharedb/lib/client';
//@ts-ignore
import * as richText from 'rich-text';
//@ts-ignore
import * as Quill from 'quill';
ShareDB.types.register(richText.type);
import 'quill/dist/quill.snow.css';
import './sharedoc.css';

export function Sharedoc(props: SharedocProps) {
  useEffect(() => {
    const element = document.getElementById('editor');

    var socket = new ReconnectingWebSocket('ws://localhost:3030');
    const connection = new ShareDB.Connection(socket as any);

    const doc = connection.get('examples', 'textarea');
    doc.subscribe(function (err: any) {
      if (err) throw err;

      var quill = new Quill('#editor', { theme: 'snow' });

      //Removing the first toolbar so only one shows up (Quill bug)
      (document.querySelector('.ql-toolbar') as HTMLElement).style.display =
        'none';

      quill.setContents(doc.data);

      quill.on(
        'text-change',
        function (delta: any, oldDelta: any, source: any) {
          if (source !== 'user') return;
          const currentText = doc.data.content;
          doc.submitOp(delta, { source: quill });
        }
      );

      doc.on('op', function (op, source) {
        if (source === quill) return;
        quill.updateContents(op);
      });
    });
  }, []);

  return (
    <>
      <div id="container">
        <h1 id="header">Collaborate to create notes!</h1>
        <a id="back-button" href="/">
          Back
        </a>
        <div id="editor"></div>
      </div>
    </>
  );
}

export default Sharedoc;
