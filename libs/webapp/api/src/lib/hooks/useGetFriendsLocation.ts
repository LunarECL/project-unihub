import axios from 'axios';

const query = async () => {
  //   const res = await axios.get('/api/friends/location'); //switch back for docker
  const res = await axios.get('http://localhost:3333/api/friends/location');
  return res.data;
};

export function useGetFriendsLocation() {
  return query();
}

export default useGetFriendsLocation;
