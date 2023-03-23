import axios from 'axios';
import { useQuery } from 'react-query';

const query = async () => {
  // const res = await axios.get('/api/sharedoc');
  const res = await axios.get('http://localhost:3333/api/sharedoc');
  return res.data;
};

export function useGetShareDoc() {
  return query();
}

export default useGetShareDoc;
