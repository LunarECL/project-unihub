import { useEffect, useState } from 'react';
import { usePostFriend, useGetFriends } from '@unihub/webapp/api';
import FriendsList from './FriendList';
import './Friends.css';
import { Grid, Box, Typography, Button, Input } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FriendsProps {}

export function Friends(props: FriendsProps) {
  // const testEmail = 'nicoled0210@gmail.com';

  // usePostFriend(testEmail);

  // console.log('testEmail: ', testEmail);

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
          <Typography variant="h5" component="div" gutterBottom>
            Invite friends
          </Typography>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
                color: 'primary.contrastText',
              },
            }}
          >
            Invite
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
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
