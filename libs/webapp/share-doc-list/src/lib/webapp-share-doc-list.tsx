import { useNavigate, useParams } from 'react-router-dom';
import { useGetAllDocuments } from '@unihub/webapp/api';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { usePostUserDocument } from '@unihub/webapp/api';
import styles from './webapp-share-doc-list.module.css';

/* eslint-disable-next-line */
export interface WebappShareDocListProps {}

interface Document {
  id: string;
  lectureNumber: string;
  lectureId: string;
  userTitle: string;
}

export function WebappShareDocList(props: WebappShareDocListProps) {
  //Get the courseCode, sessionId, lectureId from the url
  const { courseCode, sessionId, lectureId } = useParams();
  const navigate = useNavigate();

  //Loading state
  const [loading, setLoading] = useState(true);

  // Use state to store the documents and loading status
  const [documents, setDocuments] = useState<Document[]>([]);

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateDocument = () => {
    //First create the document for the lecture
    const title = (document.getElementById('document-name') as HTMLInputElement)
      .value;
    if (title !== '') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      usePostUserDocument(lectureId || '', title).then((res) => {
        //Then navigate to the document
        navigate(
          `/home/sharedDocument/${courseCode}/${sessionId}/${lectureId}/${res}/${title}`
        );
        setOpenDialog(false);
      });
    }
  };

  useEffect(() => {
    async function fetchDocuments() {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const res = await useGetAllDocuments(
        lectureId !== undefined ? lectureId : ''
      );
      setDocuments(res);
      setLoading(false);
    }
    fetchDocuments();
  }, [lectureId]);

  return (
    <div className={styles.DocumentListDiv}>
      <Grid container spacing={0}>
        <Grid item xs={11}>
          <Typography variant="h1" className={styles.ListTitle}>
            {courseCode} lecture documents
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            //navigate to the previous page
            onClick={() => navigate(-1)}
            variant="contained"
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="text"
            className={styles.CreateDocButton}
            onClick={handleClickOpenDialog}
          >
            Create your own document!
          </Button>
          {/* fix the way this looks later */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            className={styles.CreateDocDialog}
            maxWidth="lg"
          >
            <DialogTitle>Create a new document</DialogTitle>
            <DialogContent>
              <TextField
                id="document-name"
                label="Name of your document"
                type="name"
                variant="standard"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleCreateDocument}>Create</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
      <Grid container spacing={10}>
        {loading ? (
          <Grid item xs={12} className={styles.Loading}>
            <CircularProgress />
          </Grid>
        ) : (
          documents.map((doc) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
              <Button
                // style={{ cursor: 'pointer', width: '100%' }}
                className={styles.DocumentItem}
                onClick={() =>
                  navigate(
                    `/home/sharedDocument/${courseCode}/${sessionId}/${lectureId}/${
                      doc.id
                    }/${doc.lectureNumber ? doc.lectureNumber : doc.userTitle}`
                  )
                }
              >
                <Box
                  component="img"
                  className={styles.DocImage}
                  src="https://cdn.iconscout.com/icon/free/png-256/google-docs-1772228-1507812.png"
                ></Box>
              </Button>
              <Typography
                align="center"
                variant="h1"
                className={styles.DocTitle}
              >
                {doc.lectureNumber === null ? doc.userTitle : doc.lectureNumber}
              </Typography>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}

export default WebappShareDocList;
