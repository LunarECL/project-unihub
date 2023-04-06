// useGetFriendsLocation.ts
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchFriendsLocation = async () => {
  const res = await axios.get('/api/friends/location');
  return res.data;
};

export function useGetFriendsLocation() {
  return useQuery('getFriendsLocation', fetchFriendsLocation);
}

export default useGetFriendsLocation;
