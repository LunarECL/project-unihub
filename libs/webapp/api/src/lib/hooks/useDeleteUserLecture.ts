// useDeleteUserLecture.ts
import axios from 'axios';
import { useMutation } from 'react-query';

const deleteUserLectureMutationFn = async (sectionId: string) => {
  const url = `/api/courses/user/section/${sectionId}`;
  const res = await axios.delete(url);
  return res.data;
};

export function useDeleteUserLecture() {
  return useMutation(deleteUserLectureMutationFn);
}

export default useDeleteUserLecture;
