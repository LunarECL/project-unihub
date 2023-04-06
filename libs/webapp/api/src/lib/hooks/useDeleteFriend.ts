// useDeleteFriend.ts
import axios from 'axios';
import { useMutation } from 'react-query';

const deleteFriendMutationFn = async (friendId: string) => {
  const url = `/api/friends/${friendId}`;
  const res = await axios.delete(url);
  return res.data;
};

export function useDeleteFriend() {
  return useMutation(deleteFriendMutationFn);
}

export default useDeleteFriend;
