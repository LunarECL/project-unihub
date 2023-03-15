import React, { useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import * as ShareDB from 'sharedb/lib/client';
//@ts-ignore
import * as richText from 'rich-text';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import './sharedoc.css';
import { Button, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface SharedocProps {}

ShareDB.types.register(richText.type);

export function Sharedoc(props: SharedocProps) {
  const navigate = useNavigate();
  const [doc, setDoc] = useState<any>(null);
  const editorRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const socket = new ReconnectingWebSocket('ws://localhost:3030');
    const connection = new ShareDB.Connection(socket as any);

    const doc = connection.get('examples', 'textarea');
    doc.subscribe(function (err: any) {
      if (err) throw err;
      if (doc.type === null) {
        throw Error('No document exist with id: textarea');
      }
    });

    doc.on('load', load);
    doc.on('op', update);

    function load() {
      setDoc(doc);
      editorRef.current?.getEditor().setContents(doc.data);
    }

    function update(op: any, source: any) {
      if (!source) {
        const editor = editorRef.current?.getEditor();
        editor?.updateContents(op);
      }
    }
  }, []);

  function handleChange(
    content: string,
    delta: any,
    source: string,
    editor: any
  ) {
    if (source === 'user') {
      doc.submitOp(delta);
    }
  }

  return (
    <>
      <div id="doc-container">
        <Grid container spacing={3}>
          <Grid item xs="auto">
            <Typography variant="h1" sx={{ fontSize: 24, mb: 2 }}>
              Collaborate to create notes!
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <Button
              onClick={() => navigate('/')}
              variant="contained"
              // float right
              sx={{ position: 'absolute', right: 0 }}
            >
              Back
            </Button>
          </Grid>
        </Grid>
        <ReactQuill onChange={handleChange} ref={editorRef} />
      </div>
    </>
  );
}

export default Sharedoc;
