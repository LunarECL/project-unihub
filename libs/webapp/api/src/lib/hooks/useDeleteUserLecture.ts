import axios from 'axios';
import { useQuery } from 'react-query';

const query = async (sectionId: string) => {
  const url = `/api/courses/user/section/${sectionId}`;
  // const url = `http://localhost:3333/api/courses/user/section/${sectionId}`;

  const res = await axios.delete(url);

  return res.data;
};

export function useDeleteUserLecture(sectionId: string) {
  return query(sectionId);
}

export default useDeleteUserLecture;