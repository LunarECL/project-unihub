import { useEffect, useState } from 'react';
import { usePostFriend, useGetFriends } from '@unihub/webapp/api';
import FriendsList from './FriendList';
import './Friends.css';
import { Grid, Box, Typography, Button, Input, TextField } from '@mui/material';
import friendPic from './assets/addFriend.png';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FriendsProps {}

export function Friends(props: FriendsProps) {
  const [email, setEmail] = useState('');

  const handleInviteClick = () => {
    if (email.trim()) {
      usePostFriend(email);
      setEmail('');
    }
  };

  return (
    <Grid container spacing={2} className="friends-container">
      <Grid item xs={12}>
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            color: 'text.primary',
          }}
        ></Box>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          <Grid container direction={'row'} spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h3" component="div" gutterBottom>
                Invite friends
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <img src={friendPic} alt="friend" className="friendImage" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                placeholder="Enter email"
                sx={{
                  width: '50%',
                  color: 'text.primary',
                  '&:hover': {
                    color: 'text.primary',
                  },
                  paddingRight: '10px',
                }}
              />

              <Button
                onClick={handleInviteClick}
                sx={{
                  backgroundColor: 'primary.main',
                  height: '56px',
                  width: '100px',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    color: 'primary.contrastText',
                  },
                }}
              >
                Invite
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: '5%', marginBottom: '2%' }}>
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          <FriendsList />
        </Box>
      </Grid>
    </Grid>
  );
}

export default Friends;
