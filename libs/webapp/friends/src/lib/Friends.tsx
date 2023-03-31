import { useEffect, useState } from 'react';
import { usePostFriend, useGetFriends } from '@unihub/webapp/api';
import FriendsList from './FriendList';
import './Friends.css';
import { Grid, Box, Typography } from '@mui/material';

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
    // <div className="friends-container">
    //   <h1>Welcome to Friends!</h1>
    //   <div>
    //     <h2>Invite friends</h2>
    //     <input
    //       type="email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //     <button onClick={handleInviteClick}>Invite</button>
    //   </div>
    //   <div>
    //     <FriendsList />
    //   </div>
    // </div>

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          <Typography variant="h4" component="div" gutterBottom>
            Welcome to Friends!
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          <Typography variant="h5" component="div" gutterBottom>
            Invite friends
          </Typography>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={handleInviteClick}>Invite</button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            bgcolor: 'background.paper',
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
