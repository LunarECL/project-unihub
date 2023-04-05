import axios from 'axios';

const query = async (friendId: string) => {
  const url = `/api/friends/${friendId}`;

  const res = await axios.delete(url);

  return res.data;
};

export function useDeleteFriend(friendId: string) {
  return query(friendId);
}

export default useDeleteFriend;
