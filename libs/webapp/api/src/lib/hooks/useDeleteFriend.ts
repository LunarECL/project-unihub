import axios from 'axios';
import { useQuery } from 'react-query';

const query = async (friendId: string) => {
  const url = `/api/friends/${friendId}`;
  // const url = `http://localhost:3333/api/friends/${friendId}`;

  const res = await axios.delete(url);

  return res.data;
};

export function useDeleteFriend(friendId: string) {
  return query(friendId);
}

export default useDeleteFriend;
