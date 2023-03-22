import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import * as ShareDB from 'sharedb/lib/client';
//@ts-ignore
import * as richText from 'rich-text';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import './sharedoc.css';
import { Button, Typography, Grid } from '@mui/material';
import { useGetShareDoc } from '@unihub/webapp/api';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostDocumentContent } from '@unihub/webapp/api';

export interface SharedocProps {}

ShareDB.types.register(richText.type);

export function Sharedoc(props: SharedocProps) {
  const navigate = useNavigate();
  const [doc, setDoc] = useState<any>(null);
  const editorRef = useRef<ReactQuill>(null);
  const {
    courseCode = '',
    sessionId = '',
    lectureId = '',
    documentId = '',
    lectureNumber = '',
  } = useParams();

  useEffect(() => {
    const url = `ws://localhost:3030/sharedDocument/${courseCode}/${sessionId}/${lectureId}/${documentId}/${lectureNumber}`;
    const socket = new ReconnectingWebSocket(url);
    const connection = new ShareDB.Connection(socket as any);
    useGetShareDoc();

    const doc = connection.get(courseCode!, documentId!);
    doc.subscribe(function (err: any) {
      if (err) throw err;
      if (doc.type === null) {
        throw Error('No document exist with id: ' + documentId);
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

    return () => {
      doc.unsubscribe();
      doc.destroy();
    };
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

  function backButton() {
    usePostDocumentContent(documentId, doc.data).then((res) => {
      navigate(-1);
    });
  }

  return (
    <>
      <div id="doc-container">
        <Grid container spacing={3}>
          <Grid item xs="auto">
            <Typography variant="h1" sx={{ fontSize: 24, mb: 2 }}>
              Collaborate to create notes for {courseCode} {lectureNumber}!
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <Button
              //navigate to the previous page
              onClick={backButton}
              variant="contained"
              // float right
              sx={{ position: 'absolute', right: 0 }}
            >
              Back
            </Button>
          </Grid>
        </Grid>
        <ReactQuill
          onChange={handleChange}
          ref={editorRef}
          style={{ height: '100%' }}
        />
      </div>
    </>
  );
}

export default Sharedoc;
