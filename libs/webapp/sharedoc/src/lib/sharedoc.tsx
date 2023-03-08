import { useEffect, useRef, useState } from 'react';

export interface SharedocProps { }

import ReconnectingWebSocket from 'reconnecting-websocket';
import * as  ShareDB from 'sharedb/lib/client';
//@ts-ignore
import StringBinding from 'sharedb-string-binding';
// var richText = require('rich-text');
//@ts-ignore
import * as richText from 'rich-text';
// var Quill = require('quill');
//@ts-ignore
import * as Quill from 'quill';
ShareDB.types.register(richText.type);
import 'quill/dist/quill.snow.css';

export function Sharedoc(props: SharedocProps) {

  const [status, setStatus] = useState('Not Connected');
  
  useEffect(() => { 
    
    const element = document.getElementById('editor');
    
    var socket = new ReconnectingWebSocket('ws://localhost:3030');
    const connection = new ShareDB.Connection(socket as any);
    
    socket.addEventListener('open', function (event) {
      setStatus('Connected');
    }
    );

    socket.addEventListener('close', function (event) {
      setStatus('Not Connected');
    }
    );

    socket.addEventListener('error', function (event) {
      setStatus('Error');
    }
    );

    const doc  = connection.get('examples', 'textarea');
    doc.subscribe(function(err: any) {
      if (err) throw err;
      console.log(doc.data);
      var quill = new Quill('#editor', {theme: 'snow'});
      quill.setContents(doc.data);
      quill.on('text-change', function(delta: any, oldDelta: any, source: any) {
        if (source !== 'user') return;
        console.log('delta', delta);
        const currentText = doc.data.content;
        doc.submitOp(delta, {source: quill});
        //
      });
      doc.on('op', function(op, source) {
        if (source === quill) return;
        quill.updateContents(op);
      });
    }
    );
    
  
  }, []);

  return (
    <>
      <div id="editor"></div>
    </>
  );
}

export default Sharedoc;
