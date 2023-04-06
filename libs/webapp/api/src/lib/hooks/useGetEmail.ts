// useGetEmail.ts
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchEmail = async () => {
  const res = await axios.get('/api/auth');
  return res.data;
};

export function useGetEmail() {
  return useQuery('getEmail', fetchEmail);
}

export default useGetEmail;
