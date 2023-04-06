import { useNavigate, useParams } from 'react-router-dom';
import { useGetAllDocuments } from '@unihub/webapp/api';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { usePostUserDocument } from '@unihub/webapp/api';
import styles from './webapp-share-doc-list.module.css';
import { useTheme } from '@mui/material/styles';
import documentImg from './assets/documentImg.webp';

interface Document {
  id: string;
  lectureNumber: string;
  lectureId: string;
  userTitle: string;
}

export function WebappShareDocList() {
  const theme = useTheme();
  //Get the courseCode, sessionId, lectureId from the url
  const { courseCode, sessionId, lectureId } = useParams();
  const navigate = useNavigate();

  //Loading state
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const { mutate: postUserDocument } = usePostUserDocument();

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateDocument = () => {
    // First create the document for the lecture
    const title = (document.getElementById('document-name') as HTMLInputElement)
      .value;
    if (title !== '') {
      postUserDocument(
        { lectureId: lectureId || '', documentName: title },
        {
          onSuccess: (res) => {
            navigate(
              `/home/sharedDocument/${courseCode}/${sessionId}/${lectureId}/${res}/${title}`
            );
            setOpenDialog(false);
          },
        }
      );
    }
  };

  const { data: allDocuments } = useGetAllDocuments(
    lectureId !== undefined ? lectureId : ''
  );

  // For useGetAllDocuments
  useEffect(() => {
    if (allDocuments) {
      setDocuments(allDocuments);
      setLoading(false);
    }
  }, [allDocuments]);

  return (
    <div className={styles.DocumentListDiv}>
      <Grid container spacing={0}>
        <Grid item xs={11}>
          <Typography
            variant="h1"
            className={styles.ListTitle}
            sx={{ color: theme.palette.primary.main }}
          >
            {courseCode} lecture documents
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="text"
            className={styles.CreateDocButton}
            onClick={handleClickOpenDialog}
          >
            Create your own document!
          </Button>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            className={styles.CreateDocDialog}
            maxWidth="lg"
            PaperProps={{ style: { width: '50%', maxHeight: '90%' } }}
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
            <Grid item xs={0} sm={6} md={4} lg={3} key={doc.id}>
              <Button
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
                  src={documentImg}
                ></Box>
              </Button>
              <Typography
                align="center"
                variant="h1"
                className={styles.DocTitle}
                sx={{ color: theme.palette.secondary.main }}
              >
                {doc.lectureNumber === null
                  ? doc.userTitle
                  : doc.lectureNumber
                  ? 'Lecture ' +
                    parseInt(
                      doc.lectureNumber.substring(
                        doc.lectureNumber.lastIndexOf('e') + 1
                      )
                    )
                  : doc.userTitle}
              </Typography>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}

export default WebappShareDocList;
