// useGetAllDocuments.ts
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchAllDocuments = async (lectureId: string) => {
  const url = '/api/sharedoc/documents';
  const res = await axios.get(url, { params: { lectureId } });
  return res.data;
};

export function useGetAllDocuments(lectureId: string) {
  return useQuery(['getAllDocuments', lectureId], () =>
    fetchAllDocuments(lectureId)
  );
}

export default useGetAllDocuments;
