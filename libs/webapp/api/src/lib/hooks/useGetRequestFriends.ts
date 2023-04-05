import axios from 'axios';

const query = async () => {
  const res = await axios.get('/api/friends/requests');
  return res.data;
};

export function useGetRequestsFriends() {
  return query();
}

export default useGetRequestsFriends;
