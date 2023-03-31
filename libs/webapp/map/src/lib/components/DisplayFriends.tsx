import './components.css';
import { List, ListItem } from '@mui/material';
import { useGetFriendsLocation } from '@unihub/webapp/api';
import { useEffect, useState } from 'react';
import placeholder from '../assets/friendProfile.png';

export interface DisplayFriendsProps {
  changeMapFocus: (
    location: string,
    latitute?: string,
    longitude?: string
  ) => void;
}

export interface FriendLocation {
  latitute: string;
  longitude: string;
  name: string;
  time: string;
}

export function DisplayFriends(props: DisplayFriendsProps) {
  const [friends, setFriends] = useState<FriendLocation[]>([]);

  useEffect(() => {
    useGetFriendsLocation().then((res) => {
      setFriends(res);
    });
  }, []);

  if (friends.length === 0) {
    // return "No friends found"
    return <div>No friends found</div>;
  } else {
    console.log(friends);

    const friendsList = friends.map((friend) => (
      <ListItem
        key={friend.name}
        className="panel"
        onClick={() =>
          props.changeMapFocus('friend', friend.latitute, friend.longitude)
        }
      >
        <div id={'id' + friend.name} className="logoDiv">
          <img src={placeholder} alt="logo" className="logo" />
        </div>

        <div className="info">{friend.name}</div>
      </ListItem>
    ));

    return (
      <div>
        <List>{friendsList}</List>
      </div>
    );
  }
}

export default DisplayFriends;
