import axios from 'axios';
import { useQuery } from 'react-query';

const query = async () => {
  const res = await axios.get('/api/sharedoc');
  return res.data;
};

export function useGetShareDoc() {
  return query();
}

export default useGetShareDoc;
