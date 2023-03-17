import React, { useEffect } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import * as ShareDB from 'sharedb/lib/client';
//@ts-ignore
import * as richText from 'rich-text';
//@ts-ignore
import * as Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './sharedoc.css';
import { Button, Typography, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export interface SharedocProps {}

ShareDB.types.register(richText.type);

export function Sharedoc(props: SharedocProps) {
  const navigate = useNavigate();
  const { courseCode, lectureNumber } = useParams();

  useEffect(() => {
    const url = `ws://localhost:3030/sharedDocument/${courseCode}/${lectureNumber}`;
    const socket = new ReconnectingWebSocket(url);
    const connection = new ShareDB.Connection(socket as any);

    const doc = connection.get(courseCode!, lectureNumber!);
    doc.subscribe(function (err: any) {
      if (err) throw err;

      const quill = new Quill('#editor', { theme: 'snow' });

      //Removing the first toolbar so only one shows up (Quill bug)
      (document.querySelector('.ql-toolbar') as HTMLElement).style.display =
        'none';

      quill.setContents(doc.data);

      quill.on(
        'text-change',
        function (delta: any, oldDelta: any, source: any) {
          if (source !== 'user') return;
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
        <div id="editor"></div>
      </div>
    </>
  );
}

export default Sharedoc;
