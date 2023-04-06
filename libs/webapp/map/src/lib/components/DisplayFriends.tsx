import './Components.css';
import { List, ListItem } from '@mui/material';
import { useGetFriendsLocation } from '@unihub/webapp/api';
import { useEffect, useState } from 'react';
import placeholder from '../assets/friendProfile.png';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();

  const { data: friendsLocation } = useGetFriendsLocation();

  useEffect(() => {
    if (friendsLocation) {
      friendsLocation.map((friend: any) => {
        if (friend.time === '0') {
          friend.time = 'Out of range';
        } else if (friend.time === '-1') {
          friend.time = 'Never seen';
        } else {
          const currentTime = new Date().getTime();
          const friendLastUpdate = friend.time;

          const timestamp = Date.parse(friendLastUpdate);
          const friendLastUpdateDate = new Date(timestamp).getTime();

          const timeAgo = currentTime - friendLastUpdateDate;

          if (timeAgo < 60000) {
            friend.time = 'last seen a few seconds ago';
          } else if (timeAgo < 3600000) {
            friend.time =
              'last seen ' + Math.floor(timeAgo / 60000) + ' minutes ago';
          } else if (timeAgo < 86400000) {
            friend.time =
              'last seen ' + Math.floor(timeAgo / 3600000) + ' hours ago';
          } else if (timeAgo < 604800000) {
            friend.time =
              'last seen ' + Math.floor(timeAgo / 86400000) + ' days ago';
          } else {
            friend.time = 'last seen a long time ago';
          }
        }
      });

      setFriends(friendsLocation);
    }
  }, [friendsLocation]);

  if (friends.length === 0) {
    return <div>No friends found</div>;
  } else {
    const friendsList = friends.map((friend) => (
      <ListItem
        key={friend.name}
        className="panel"
        style={{ borderBottomColor: theme.palette.secondary.main }}
        onClick={() =>
          props.changeMapFocus('friend', friend.latitute, friend.longitude)
        }
      >
        <div id={'id' + friend.name} className="logoDiv">
          <img src={placeholder} alt="logo" className="logo" />
        </div>

        <div className="infoDiv">
          <div className="info" style={{ color: theme.palette.secondary.main }}>
            {friend.name}
          </div>
          <div
            className="info info-small"
            style={{ color: theme.palette.secondary.main }}
          >
            {friend.time}
          </div>
        </div>
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
