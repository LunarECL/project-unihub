import axios from 'axios';
import { useQuery } from 'react-query';

const fetchCourses = async () => {
  const res = await axios.get('/api/courses');
  return res.data;
};

export function useGetCourses() {
  return useQuery('getCourses', fetchCourses, {
    refetchOnMount: true,
  });
}

export default useGetCourses;
