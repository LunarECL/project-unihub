import React from 'react';
import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetEmail } from '@unihub/webapp/api';
import { WebappShareDocList } from '@unihub/webapp/share-doc-list';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashboardProps {}

export function Forum(props: DashboardProps) {
  const navigate = useNavigate();

  useGetEmail();

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <Button onClick={() => navigate('/home/timetable')} variant="contained">
          Timetable
        </Button>
        <Button
          onClick={() => navigate('/home/rooms/join')}
          variant="contained"
          sx={{ ml: 2 }}
        >
          WebRTC App
        </Button>
        <Button
          onClick={() => navigate('/home/map')}
          variant="contained"
          sx={{ ml: 2 }}
        >
          Map
        </Button>
        <Button
          onClick={() => navigate('/home/friends')}
          variant="contained"
          sx={{ ml: 2 }}
        >
          Friends
        </Button>
      </Grid>
    </Grid>
  );
}

export default Forum;
