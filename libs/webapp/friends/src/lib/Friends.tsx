import { useEffect, useState } from 'react';
import { usePostFriend, useGetFriends } from '@unihub/webapp/api';
import FriendsList from './FriendList';

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
    <div>
      <h1>Welcome to Friends!</h1>
      <div>
        <h2>Invite friends</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleInviteClick}>Invite</button>
      </div>
      <div>
        <FriendsList />
      </div>
    </div>
  );
}

export default Friends;
