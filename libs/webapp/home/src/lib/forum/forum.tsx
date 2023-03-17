import React from 'react';
import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface DashboardProps {}

export function Forum(props: DashboardProps) {
  const navigate = useNavigate();

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
        <Button
          onClick={() => navigate('/home/sharedDocument')}
          variant="contained"
        >
          ShareDoc
        </Button>
      </Grid>
    </Grid>
  );
}

export default Forum;
