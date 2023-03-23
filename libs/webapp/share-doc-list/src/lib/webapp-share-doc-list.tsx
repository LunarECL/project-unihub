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
    const title = (document.getElementById('document-name') as HTMLInputElement).value;
    if (title !== '') {
      usePostUserDocument(lectureId || '',  title).then((res) => {
        //Then navigate to the document
        navigate(
          `/home/sharedDocument/${courseCode}/${sessionId}/${lectureId}/${res.id}/${title}`
        );
        console.log(res);
        setOpenDialog(false);
      });
    }
  };

  useEffect(() => {
    async function fetchDocuments() {
      const res = await useGetAllDocuments(
        lectureId !== undefined ? lectureId : ''
      );
      setDocuments(res);
      setLoading(false);
    }
    fetchDocuments();
  }, [lectureId]);

  return (
    <div style={{ marginLeft: '10%', marginRight: '10%', marginTop: '5%' }}>
      <Grid container spacing={0}>
        <Grid item xs={11}>
          <Typography variant="h1" sx={{ fontSize: 35, mb: 2 }}>
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
            sx={{ marginBottom: '4%', float: 'left' }}
            onClick={handleClickOpenDialog}
          >
            Create your own document!
          </Button>
          {/* fix the way this looks later */}
          <Dialog open={openDialog} onClose={handleCloseDialog} sx={{width: '100%', height: '100%'}} maxWidth='lg'>
            <DialogTitle>Create a new document</DialogTitle>
            <DialogContent>
              <TextField
                id="document-name"
                label="Name of your document"
                type="name"
                variant="standard"
                // onChange={handleFilter}
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
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          documents.map((doc) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
              <Button
                style={{ cursor: 'pointer', width: '100%' }}
                onClick={() =>
                  navigate(
                    `/home/sharedDocument/${courseCode}/${sessionId}/${lectureId}/${doc.id}/${doc.lectureNumber ? doc.lectureNumber : doc.userTitle}`
                  )
                }
              >
                <Box
                  component="img"
                  sx={{
                    maxHeight: { xs: 233, md: 167 },
                    maxWidth: { xs: 350, md: 250 },
                    color: 'primary.main',
                  }}
                  src="https://cdn.iconscout.com/icon/free/png-256/google-docs-1772228-1507812.png"
                ></Box>
              </Button>
              <Typography
                align="center"
                variant="h1"
                sx={{ fontSize: 24, mb: 2 }}
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
