import axios from 'axios';

const query = async () => {
  const res = await axios.get('https://api.unihub.one/api/auth');
  return res.data;
};

export function useGetEmail() {
  return query();
}
