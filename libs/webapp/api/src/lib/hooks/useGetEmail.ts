import axios from 'axios';
import { useQuery } from 'react-query';

const query = async () => {
  const res = await axios.get('http://localhost:3333/api/auth');
  return res.data;
};

export function useGetEmail() {
  return query();
}

export default useGetEmail;
