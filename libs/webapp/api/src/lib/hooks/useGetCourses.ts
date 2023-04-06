import axios from 'axios';

const query = async () => {
  const res = await axios.get('/api/courses');
  return res.data;
};

export function useGetCourses() {
  return query();
}

export default useGetCourses;
