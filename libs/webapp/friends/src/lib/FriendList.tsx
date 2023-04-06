import { useEffect, useState } from 'react';
import {
  useGetFriends,
  useDeleteFriend,
  useGetRequestsFriends,
  usePatchAcceptFriend,
} from '@unihub/webapp/api';
import { Grid, List, ListItem, ListSubheader } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './FriendList.css';
import { useTheme } from '@mui/material/styles';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FriendsListProps {}

interface Friend {
  userId: string;
  email: string;
  isAccepted: boolean;
  isReqested: boolean;
}

export function FriendsList(props: FriendsListProps) {
  const theme = useTheme();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requestsFriends, setRequestsFriends] = useState<Friend[]>([]);

  const patchAcceptFriendMutation = usePatchAcceptFriend();

  useEffect(() => {
    useGetFriends().then((friends) => setFriends(friends));
    useGetRequestsFriends().then((friends) => setRequestsFriends(friends));
  }, []);

  const { mutate: deleteFriend } = useDeleteFriend();

  const handleDeleteFriend = (friend: Friend) => {
    deleteFriend(friend.userId, {
      onSuccess: (deletedFriend) => {
        console.log(deletedFriend);
        setFriends(friends.filter((f) => f.userId !== friend.userId));
      },
    });
  };

  const handleAddFriend = (friend: Friend) => {
    patchAcceptFriendMutation.mutate(friend.email, {
      onSuccess: (friend) => {
        console.log(friend);
        // Remove from requestsFriends
        setRequestsFriends(
          requestsFriends.filter(
            (requestFriend) => requestFriend.userId !== friend.userId
          )
        );
        // Add to friends
        setFriends([...friends, friend]);
      },
    });
  };

  const friendsList = friends.map((friend) => (
    <ListItem key={friend.userId + 'accepted'} className="list-item">
      <div className="delete-friend">
        <DeleteIcon onClick={() => handleDeleteFriend(friend)} />
      </div>
      {friend.email}
    </ListItem>
  ));

  const requestsFriendsList = requestsFriends.map((friend) => (
    <ListItem key={friend.userId + 'requested'} className="list-item">
      <div className="accept-friend">
        <AddIcon onClick={() => handleAddFriend(friend)} />
      </div>
      {friend.email} has requested to be your friend
    </ListItem>
  ));

  return (
    <div>
      <div className="friends-item">
        <Grid container direction={'row'} spacing={3}>
          <Grid item xs={6}>
            <List className="list" subheader={<li />}>
              <ListSubheader className="friend-item-title">{`Current Friends`}</ListSubheader>
              {friendsList}
            </List>
          </Grid>
          <Grid item xs={6}>
            <List className="list" subheader={<li />}>
              <ListSubheader className="friend-item-title">{`Pending Friends`}</ListSubheader>
              {requestsFriendsList}
            </List>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default FriendsList;
