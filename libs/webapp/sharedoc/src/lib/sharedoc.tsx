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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useGetShareDoc } from '@unihub/webapp/api';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostDocumentContent } from '@unihub/webapp/api';
import { useGetIfUserCanViewDoc } from '@unihub/webapp/api';
import { usePostShareDocument } from '@unihub/webapp/api';
export interface SharedocProps {}

ShareDB.types.register(richText.type);

export function Sharedoc(props: SharedocProps) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const editorRef = useRef<ReactQuill>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isUserDoc, setIsUserDoc] = useState(false);
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
    const doc = connection.get(courseCode!, documentId!);

    const authorizeUser = async () => {
      const res = await useGetIfUserCanViewDoc(documentId);
      if (!res.isAuthorized) {
        alert('You are not authorized to view this document');
        navigate(-1);
      } else {
        // isAuthorized = true; // update state here
        setIsAuthorized(true);
        if (res.isUser) {
          setIsUserDoc(true);
        }
      }
    };

    authorizeUser();

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
      setLoading(false);
    }

    function update(op: any, source: any) {
      if (!source) {
        const editor = editorRef.current?.getEditor();
        editor?.updateContents(op);
      }
    }

    return () => {
      if (doc) {
        doc.unsubscribe();
        doc.destroy();
      }
    };
  }, [isAuthorized]);

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

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleShare = () => {
    //Add the user to the document
    //Get the user email from the text field
    const userEmail = (
      document.getElementById('user-email') as HTMLInputElement
    ).value;
    usePostShareDocument(documentId, userEmail).then((res) => {
      if (res === false) {
        alert('User does not exist');
      } else {
        alert('User added to document');
      }
    });
    setOpenDialog(false);
  };

  return (
    <>
      {isAuthorized ? (
        <div id="doc-container">
          <Grid container spacing={0}>
            <Grid item xs={8}>
              <Typography variant="h1" sx={{ fontSize: 24, mb: 2 }}>
                Collaborate to create notes for {courseCode}, {lectureNumber}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Button
                //navigate to the previous page
                onClick={backButton}
                variant="contained"
                sx={{ position: 'absolute', right: 0 }}
              >
                Back
              </Button>
            </Grid>
            {isUserDoc ? (
              <Grid item xs={8}>
                <Button
                  variant="text"
                  sx={{ mb: 2, left: -5 }}
                  onClick={handleClickOpenDialog}
                >
                  Share with other users!
                </Button>

                <Dialog
                  open={openDialog}
                  onClose={handleCloseDialog}
                  sx={{ width: '100%', height: '100%' }}
                  maxWidth="lg"
                >
                  <DialogTitle>Share with other users on UniHub!</DialogTitle>
                  <DialogContent>
                    <TextField
                      id="user-email"
                      label="User email"
                      type="user-email"
                      variant="standard"
                      // onChange={handleFilter}
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleShare}>Share</Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            ) : (
              <></>
            )}
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
