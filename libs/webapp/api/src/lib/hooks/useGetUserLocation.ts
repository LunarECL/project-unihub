import axios from 'axios';

const query = async (userId: string) => {
  const url = `/api/map/user/location/`;
  // const url = `/apimap/user/location/`;

  const res = await axios.get(url, {
    params: {
      userId: userId,
    },
  });

  return res.data;
};

export function useGetUserLocation(userId: string) {
  return query(userId);
}

export default useGetUserLocation;
