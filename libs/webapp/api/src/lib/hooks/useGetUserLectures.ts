import axios from 'axios';
import { useQuery } from 'react-query';

const query = async () => {
  const res = await axios.get(
    // 'http://localhost:3333/api/courses/user/lectures'
    '/api/courses/user/lectures'
  );
  return res.data;
};

export function useGetUserLectures() {
  return query();
}

export default useGetUserLectures;
