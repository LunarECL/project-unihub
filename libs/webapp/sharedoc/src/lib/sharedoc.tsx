import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import * as ShareDB from 'sharedb/lib/client';
//@ts-ignore
import * as richText from 'rich-text';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import './sharedoc.css';
import {
  Button,
  Typography,
  Grid,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { useGetShareDoc } from '@unihub/webapp/api';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostDocumentContent } from '@unihub/webapp/api';
import { useGetIfUserCanViewDoc } from '@unihub/webapp/api';
export interface SharedocProps {}

ShareDB.types.register(richText.type);

let isAuthorized = false;

export function Sharedoc(props: SharedocProps) {
  const navigate = useNavigate();
  // const [isAuthorized, setIsAuthorized] = useState(true);
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    // Check that the user is authorized to view the document
    useGetIfUserCanViewDoc(documentId).then((res) => {
      if (res === false) {
        alert('You are not authorized to view this document');
        navigate(-1);
      }else {
        isAuthorized = true;
        doc.subscribe(function (err: any) {
          if (err) throw err;

          if (!doc.type) {
            setLoading(true);
            location.reload();
          } else {
            setLoading(false);
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
    usePostDocumentContent(documentId, doc.data);
    navigate(-1);
  }

  return (
    <>
      {isAuthorized ? (
        <div id="doc-container">
          <Grid container spacing={3}>
            <Grid item xs="auto">
              <Typography variant="h1" sx={{ fontSize: 24, mb: 2 }}>
                Collaborate to create notes for {courseCode}, {lectureNumber}
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <Button
                //navigate to the previous page
                onClick={backButton}
                variant="contained"
                sx={{ position: 'absolute', right: 0 }}
              >
                Back
              </Button>
            </Grid>
          </Grid>
          {loading ? (
            <Skeleton variant="rounded" width={'100%'} height={'100%'} />
          ) : (
            <ReactQuill
              onChange={handleChange}
              ref={editorRef}
              style={{ height: '100%' }}
            />
          )}
        </div>
      ) : null}
    </>
  );
}

export default Sharedoc;
