import axios from 'axios';

const query = async (latitude: string, longitude: string) => {
  // const url = `/api/map/user/location/`;
  const url = `http://localhost:3333/api/map/user/location/`;

  const res = await axios.post(url, {
    latitude,
    longitude,
  });

  return res.data;
};

export function usePostUserLocation(latitude: string, longitude: string) {
  return query(latitude, longitude);
}

export default usePostUserLocation;
