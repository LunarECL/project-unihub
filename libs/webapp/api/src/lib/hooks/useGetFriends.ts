import axios from 'axios';

const query = async () => {
  const res = await axios.get('/api/friends'); //switch back for docker
  // const res = await axios.get('http://localhost:3333/api/friends');
  return res.data;
};

export function useGetFriends() {
  return query();
}

export default useGetFriends;
