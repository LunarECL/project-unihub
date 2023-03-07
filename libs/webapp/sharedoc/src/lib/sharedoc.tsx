import { useEffect, useRef, useState } from 'react';

export interface SharedocProps { }

// const ReconnectingWebSocket = require('reconnecting-websocket');
import ReconnectingWebSocket from 'reconnecting-websocket';
import io from 'socket.io-client';
import * as  ShareDB from 'sharedb/lib/client';
// import sharedb from 'sharedb/lib/client';
// var sharedb = require('sharedb/lib/client');
// import { Doc } from 'sharedb/lib/client';
//@ts-ignore
import StringBinding from 'sharedb-string-binding';

export function Sharedoc(props: SharedocProps) {

  const [status, setStatus] = useState('Not Connected');

  // const socket = new WebSocket('http://localhost:3030')
  
  useEffect(() => { 
    
    const element = document.getElementById('note');
  

    // const socket: any = new ReconnectingWebSocket('ws://localhost:3030');
    
    var socket = new ReconnectingWebSocket('ws://localhost:3030');

    // const doc = connection.get('examples', 'textarea');
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
      console.log(doc.data); // {comment: 'Hello world!'}
      const binding = new StringBinding(element, doc, ['content']);
      binding.setup();
    }
    );
    
  
  }, []);

  return (
    <>
      <textarea id="note" />
      <span id="status-span">{status}</span>
    </>
  );
}

export default Sharedoc;
