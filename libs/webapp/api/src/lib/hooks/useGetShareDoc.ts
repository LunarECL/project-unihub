// useGetShareDoc.ts
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchShareDoc = async () => {
  const res = await axios.get('/api/sharedoc');
  return res.data;
};

export function useGetShareDoc() {
  return useQuery('shareDoc', fetchShareDoc);
}

export default useGetShareDoc;
