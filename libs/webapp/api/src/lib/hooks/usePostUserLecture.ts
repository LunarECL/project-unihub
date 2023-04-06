import axios from 'axios';
import { useMutation } from 'react-query';

const postUserLectureMutationFn = async (sectionId: string) => {
  const url = `/api/courses/user/lecture`;
  const res = await axios.post(url, { sectionId });
  return res.data;
};

export function usePostUserLecture() {
  return useMutation(postUserLectureMutationFn);
}

export default usePostUserLecture;
