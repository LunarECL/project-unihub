import axios from 'axios';

const query = async () => {
  const res = await axios.get('/api/sharedoc');
  return res.data;
};

export function useGetShareDoc() {
  return query();
}
