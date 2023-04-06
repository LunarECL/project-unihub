// useGetUserLocation.ts
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchUserLocation = async (userId: string) => {
  const url = `/api/map/user/location/`;

  const res = await axios.get(url, {
    params: {
      userId: userId,
    },
  });

  return res.data;
};

export function useGetUserLocation(userId: string) {
  return useQuery(['userLocation', userId], () => fetchUserLocation(userId));
}

export default useGetUserLocation;
