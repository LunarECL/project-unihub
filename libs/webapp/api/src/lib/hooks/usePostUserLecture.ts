import axios from 'axios';
import { useQuery } from 'react-query';

const query = async (sectionId: string) => {
  // const url = `/api/courses/user/lecture`;
  const url = 'http://localhost:3333/api/courses/user/lecture';

  const res = await axios.post(url, {
    sectionId,
  });

  return res.data;
};

export function usePostUserLecture(sectionId: string) {
  return query(sectionId);
}

export default usePostUserLecture;
