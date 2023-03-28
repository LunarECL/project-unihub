import axios from 'axios';

const query = async () => {
  const res = await axios.get('https://api.adballoon.me/api/auth');
  return res.data;
};

export function useGetEmail() {
  return query();
}
