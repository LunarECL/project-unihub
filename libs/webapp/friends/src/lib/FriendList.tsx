import { useEffect, useState } from 'react';
import {
  usePostFriend,
  useGetFriends,
  useDeleteFriend,
} from '@unihub/webapp/api';
import { List, ListItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './FriendList.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FriendsListProps {}

interface Friend {
  userId: string;
  email: string;
}

export function FriendsList(props: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    useGetFriends().then((friends) => setFriends(friends));
  }, []);

  console.log('friends: ', friends);

  //   const friendsList = friends.map((friend) => (
  //     <ListItem key={friend}>{friend}</ListItem>
  //   ));

  const handleDeleteFriend = (friend: Friend) => {
    console.log('delete friend: ', friend);
    useDeleteFriend(friend.userId).then((friend) => console.log(friend));
  };

  const friendsList = friends.map((friend) => (
    <ListItem key={friend.userId} className="friend-list-item">
      <div>{friend.email}</div>
      <div className="delete-friend">
        <DeleteIcon onClick={() => handleDeleteFriend(friend)} />
      </div>
    </ListItem>
  ));

  // get the list of friends from the database
  return (
    <div>
      <div>
        <h2>Current friends</h2>
        <List>{friendsList}</List>
      </div>
    </div>
  );
}

export default FriendsList;
