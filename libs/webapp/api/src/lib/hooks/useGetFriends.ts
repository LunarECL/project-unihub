// useGetFriends.ts
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchFriends = async () => {
  const res = await axios.get('/api/friends');
  return res.data;
};

export function useGetFriends() {
  return useQuery('getFriends', fetchFriends);
}

export default useGetFriends;
