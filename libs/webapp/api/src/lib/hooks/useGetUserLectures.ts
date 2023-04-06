import axios from 'axios';
import { useQuery } from 'react-query';

const fetchUserLectures = async () => {
  const res = await axios.get('/api/courses/user/lectures');
  return res.data;
};

export function useGetUserLectures() {
  return useQuery('getUserLectures', fetchUserLectures, {
    refetchOnMount: true,
  });
}

export default useGetUserLectures;
