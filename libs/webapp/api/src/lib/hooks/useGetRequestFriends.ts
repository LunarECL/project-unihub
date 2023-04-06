// useGetRequestsFriends.ts
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchRequestsFriends = async () => {
  const res = await axios.get('/api/friends/requests');
  return res.data;
};

export function useGetRequestsFriends() {
  return useQuery('requestsFriends', fetchRequestsFriends);
}

export default useGetRequestsFriends;
